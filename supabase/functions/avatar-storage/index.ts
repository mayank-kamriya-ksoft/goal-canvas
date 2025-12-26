import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const token = formData.get('token') as string;
    const action = formData.get('action') as string;
    const file = formData.get('file') as File | null;

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

        // Generate file path
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Delete existing avatar files for this user (cleanup old avatars)
        try {
          const { data: existingFiles } = await supabase.storage
            .from('avatars')
            .list(userId);
          
          if (existingFiles && existingFiles.length > 0) {
            const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
            await supabase.storage.from('avatars').remove(filesToDelete);
          }
        } catch {
          // Ignore cleanup errors
        }

        // Upload file using service role
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, arrayBuffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error');
          return new Response(
            JSON.stringify({ error: 'Failed to upload file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        console.log('Avatar uploaded successfully');

        return new Response(
          JSON.stringify({ 
            success: true, 
            url: urlData.publicUrl,
            path: filePath
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const filePath = formData.get('path') as string;
        
        // Verify the path belongs to this user
        if (!filePath || !filePath.startsWith(`${userId}/`)) {
          return new Response(
            JSON.stringify({ error: 'Invalid file path' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);

        if (deleteError) {
          console.error('Delete error');
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
    console.error('Avatar storage error');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
