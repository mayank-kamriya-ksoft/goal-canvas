import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,          // Max signup attempts before blocking
  windowMinutes: 60,       // Time window for counting attempts (1 hour for signup)
  blockMinutes: 60,        // How long to block after exceeding limit
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

// Record an attempt (for signup, we track all attempts, not just failed ones)
async function recordAttempt(
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

// Simple password hashing using Web Crypto API (PBKDF2)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
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
  const hashArray = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  return encodeBase64(combined);
}

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return encodeBase64(bytes).replace(/[+/=]/g, '');
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

    // Check rate limit before processing (use IP only for signup to prevent enumeration)
    const rateLimit = await checkRateLimit(supabase, clientIP, 'signup');
    if (!rateLimit.allowed) {
      console.log('Signup rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          error: 'Too many signup attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter || 3600)
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record the attempt before processing
    await recordAttempt(supabase, clientIP, 'signup');

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'An account with this email already exists' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
      })
      .select('id, email, created_at')
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: newUser.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Account created but failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created successfully:', newUser.email);

    return new Response(
      JSON.stringify({
        user: {
          id: newUser.id,
          email: newUser.email,
          created_at: newUser.created_at,
        },
        session: {
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
