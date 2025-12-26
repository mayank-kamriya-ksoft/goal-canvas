import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the app origin for cookie domain
const APP_ORIGIN = Deno.env.get('APP_ORIGIN') || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': APP_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxUploads: 10,        // Max uploads per window
  windowMinutes: 5,      // Time window
  blockMinutes: 15,      // Block duration
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number; blockedUntil?: number }>();

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(userId);
  
  // Clean up old entries
  if (rateLimitMap.size > 500) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now && (!val.blockedUntil || val.blockedUntil < now)) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  if (!record) {
    rateLimitMap.set(userId, { 
      count: 1, 
      resetAt: now + RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000 
    });
    return { allowed: true };
  }
  
  if (record.blockedUntil && record.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((record.blockedUntil - now) / 1000) };
  }
  
  if (record.resetAt < now) {
    rateLimitMap.set(userId, { 
      count: 1, 
      resetAt: now + RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000 
    });
    return { allowed: true };
  }
  
  record.count++;
  
  if (record.count > RATE_LIMIT_CONFIG.maxUploads) {
    record.blockedUntil = now + RATE_LIMIT_CONFIG.blockMinutes * 60 * 1000;
    rateLimitMap.set(userId, record);
    return { allowed: false, retryAfter: RATE_LIMIT_CONFIG.blockMinutes * 60 };
  }
  
  rateLimitMap.set(userId, record);
  return { allowed: true };
}

// Parse session token from cookies
function getSessionTokenFromCookies(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'session_token') {
      return value;
    }
  }
  return null;
}

// Validate session and return user_id
async function validateSession(supabase: any, token: string): Promise<string | null> {
  if (!token) return null;

  const { data: session, error } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (error || !session) return null;
  if (new Date(session.expires_at) < new Date()) return null;

  return session.user_id;
}

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const formData = await req.formData();
    const bodyToken = formData.get('token') as string;
    const action = formData.get('action') as string;
    const file = formData.get('file') as File | null;

    // Try to get token from cookies first, then fall back to body (for backward compatibility)
    const token = getSessionTokenFromCookies(req) || bodyToken;

    // Validate session
    const userId = await validateSession(supabase, token);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      console.log('Avatar upload rate limit exceeded');
      return new Response(
        JSON.stringify({ 
          error: 'Too many uploads. Please try again later.',
          retryAfter: rateLimit.retryAfter
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter || 900)
          } 
        }
      );
    }

    switch (action) {
      case 'upload': {
        if (!file) {
          return new Response(
            JSON.stringify({ error: 'No file provided' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          return new Response(
            JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return new Response(
            JSON.stringify({ error: 'File too large. Maximum size is 2MB.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate unique filename with user folder structure
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${userId}/${Date.now()}.${ext}`;

        // Delete existing avatars for this user first
        const { data: existingFiles } = await supabase.storage
          .from('avatars')
          .list(userId);

        if (existingFiles && existingFiles.length > 0) {
          const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
          await supabase.storage.from('avatars').remove(filesToDelete);
        }

        // Upload new avatar
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return new Response(
            JSON.stringify({ error: 'Failed to upload file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        console.log('Avatar uploaded successfully');

        return new Response(
          JSON.stringify({ url: urlData.publicUrl }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const path = formData.get('path') as string;
        
        if (!path) {
          return new Response(
            JSON.stringify({ error: 'File path is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Security: Ensure user can only delete their own files
        if (!path.startsWith(`${userId}/`)) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - Cannot delete files from other users' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([path]);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Avatar deleted successfully');

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Avatar storage error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});