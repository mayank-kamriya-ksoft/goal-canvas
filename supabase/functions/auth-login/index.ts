import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64, decodeBase64 } from "https://deno.land/std@0.208.0/encoding/base64.ts";

// Get the app origin for cookie domain
const APP_ORIGIN = Deno.env.get('APP_ORIGIN') || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': APP_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,          // Max failed attempts before blocking
  windowMinutes: 15,       // Time window for counting attempts
  blockMinutes: 30,        // How long to block after exceeding limit
};

// Get client IP from request headers
function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// Check rate limit and return whether request is allowed
async function checkRateLimit(
  supabase: any, 
  identifier: string, 
  actionType: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = new Date();
  
  // Get existing rate limit record
  const { data: record } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('action_type', actionType)
    .maybeSingle();

  if (!record) {
    return { allowed: true };
  }

  // Check if currently blocked
  if (record.blocked_until) {
    const blockedUntil = new Date(record.blocked_until);
    if (blockedUntil > now) {
      const retryAfter = Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000);
      return { allowed: false, retryAfter };
    }
  }

  // Check if within rate limit window
  const windowStart = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000);
  const firstAttempt = new Date(record.first_attempt_at);

  // If first attempt is outside window, reset is allowed
  if (firstAttempt < windowStart) {
    return { allowed: true };
  }

  // Check if attempts exceed limit
  if (record.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
    const retryAfter = RATE_LIMIT_CONFIG.blockMinutes * 60;
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

// Record a failed attempt
async function recordFailedAttempt(
  supabase: any, 
  identifier: string, 
  actionType: string
): Promise<void> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000);

  // Get existing record
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('action_type', actionType)
    .maybeSingle();

  if (!existing) {
    // Create new record
    await supabase.from('rate_limits').insert({
      identifier,
      action_type: actionType,
      attempts: 1,
      first_attempt_at: now.toISOString(),
      last_attempt_at: now.toISOString(),
    });
  } else {
    const firstAttempt = new Date(existing.first_attempt_at);
    
    if (firstAttempt < windowStart) {
      // Reset window
      await supabase
        .from('rate_limits')
        .update({
          attempts: 1,
          first_attempt_at: now.toISOString(),
          last_attempt_at: now.toISOString(),
          blocked_until: null,
        })
        .eq('id', existing.id);
    } else {
      const newAttempts = existing.attempts + 1;
      const blockedUntil = newAttempts >= RATE_LIMIT_CONFIG.maxAttempts
        ? new Date(now.getTime() + RATE_LIMIT_CONFIG.blockMinutes * 60 * 1000).toISOString()
        : null;

      await supabase
        .from('rate_limits')
        .update({
          attempts: newAttempts,
          last_attempt_at: now.toISOString(),
          blocked_until: blockedUntil,
        })
        .eq('id', existing.id);
    }
  }
}

// Clear rate limit on successful login
async function clearRateLimit(
  supabase: any, 
  identifier: string, 
  actionType: string
): Promise<void> {
  await supabase
    .from('rate_limits')
    .delete()
    .eq('identifier', identifier)
    .eq('action_type', actionType);
}

// Verify password against stored hash
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const combined = decodeBase64(storedHash);
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const derivedHashBytes = new Uint8Array(derivedBits);
    
    // Constant-time comparison
    if (derivedHashBytes.length !== storedHashBytes.length) return false;
    let diff = 0;
    for (let i = 0; i < derivedHashBytes.length; i++) {
      diff |= derivedHashBytes[i] ^ storedHashBytes[i];
    }
    return diff === 0;
  } catch {
    return false;
  }
}

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return encodeBase64(bytes).replace(/[+/=]/g, '');
}

// Create secure cookie string
function createSessionCookie(token: string, expiresAt: Date): string {
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  return `session_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use external Supabase if configured, otherwise fall back to default
    const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password } = await req.json();
    const clientIP = getClientIP(req);
    const rateLimitIdentifier = `${clientIP}:${email?.toLowerCase() || 'unknown'}`;

    // Check rate limit before processing
    const rateLimit = await checkRateLimit(supabase, rateLimitIdentifier, 'login');
    if (!rateLimit.allowed) {
      console.log('Rate limit exceeded for login attempt');
      return new Response(
        JSON.stringify({ 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter || 1800)
          } 
        }
      );
    }

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find user
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, password_hash, created_at')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (findError || !user) {
      console.log('Login failed: user not found');
      await recordFailedAttempt(supabase, rateLimitIdentifier, 'login');
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      console.log('Login failed: invalid password');
      await recordFailedAttempt(supabase, rateLimitIdentifier, 'login');
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clear rate limit on successful login
    await clearRateLimit(supabase, rateLimitIdentifier, 'login');

    // Create new session (invalidate old ones)
    await supabase
      .from('sessions')
      .delete()
      .eq('user_id', user.id);

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      console.error('Error creating session');
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User logged in successfully');

    // Set httpOnly cookie for session token
    const sessionCookie = createSessionCookie(sessionToken, expiresAt);

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        session: {
          expires_at: expiresAt.toISOString(),
        },
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Set-Cookie': sessionCookie,
        } 
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});