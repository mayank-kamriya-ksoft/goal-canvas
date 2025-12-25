import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    console.log('Fetching templates', category ? `for category: ${category}` : 'all');

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
      console.error('Error fetching templates:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch templates' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${templates?.length || 0} templates`);

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
    console.error('Templates error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
