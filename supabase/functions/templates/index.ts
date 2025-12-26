import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration for templates endpoint
const RATE_LIMIT_CONFIG = {
  maxRequests: 30,       // Max requests per window
  windowMinutes: 1,      // Time window in minutes
  blockMinutes: 5,       // Block duration after exceeding limit
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

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number; blockedUntil?: number }>();

function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now && (!val.blockedUntil || val.blockedUntil < now)) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  if (!record) {
    rateLimitMap.set(identifier, { 
      count: 1, 
      resetAt: now + RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000 
    });
    return { allowed: true };
  }
  
  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((record.blockedUntil - now) / 1000) };
  }
  
  // Reset window if expired
  if (record.resetAt < now) {
    rateLimitMap.set(identifier, { 
      count: 1, 
      resetAt: now + RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000 
    });
    return { allowed: true };
  }
  
  // Increment count
  record.count++;
  
  if (record.count > RATE_LIMIT_CONFIG.maxRequests) {
    record.blockedUntil = now + RATE_LIMIT_CONFIG.blockMinutes * 60 * 1000;
    rateLimitMap.set(identifier, record);
    return { allowed: false, retryAfter: RATE_LIMIT_CONFIG.blockMinutes * 60 };
  }
  
  rateLimitMap.set(identifier, record);
  return { allowed: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = getClientIP(req);
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      console.log('Templates rate limit exceeded');
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfter
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter || 300)
          } 
        }
      );
    }

    // Use external Supabase if configured, otherwise fall back to default
    const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    let query = supabase
      .from('vision_board_templates')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching templates');
      return new Response(
        JSON.stringify({ error: 'Failed to fetch templates' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Group templates by category
    const grouped = templates?.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, typeof templates>);

    return new Response(
      JSON.stringify({ 
        templates: templates || [],
        grouped: grouped || {}
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Templates error');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
