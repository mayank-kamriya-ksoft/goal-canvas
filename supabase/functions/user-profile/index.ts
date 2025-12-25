import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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
    const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, token, ...data } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .maybeSingle();

    if (sessionError || !session) {
      console.error('Session validation failed:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date(session.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Session expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user_id;

    switch (action) {
      case 'get': {
        // Get user email first (this should always work)
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('email, created_at')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Try to get user profile (may not exist yet)
        let profile = null;
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (profileError) {
            console.warn('Error fetching profile (non-blocking):', profileError);
            // Continue without profile data
          } else {
            profile = profileData;
          }
        } catch (err) {
          console.warn('Profile fetch exception (non-blocking):', err);
        }

        console.log('Data fetched for user:', userId);

        return new Response(
          JSON.stringify({
            profile: profile || { user_id: userId },
            user: { email: user.email, created_at: user.created_at }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { display_name, bio, avatar_url, theme_preference, email_notifications } = data;

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        let result;
        const updateData: Record<string, any> = {};
        
        // Only include fields that are explicitly provided
        if (display_name !== undefined) updateData.display_name = display_name?.trim() || null;
        if (bio !== undefined) updateData.bio = bio?.trim() || null;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url || null;
        if (theme_preference !== undefined) updateData.theme_preference = theme_preference || 'system';
        if (email_notifications !== undefined) updateData.email_notifications = email_notifications ?? true;

        if (existingProfile) {
          // Update existing profile
          result = await supabase
            .from('profiles')
            .update(updateData)
            .eq('user_id', userId)
            .select()
            .single();
        } else {
          // Create new profile
          result = await supabase
            .from('profiles')
            .insert({
              user_id: userId,
              ...updateData,
            })
            .select()
            .single();
        }

        if (result.error) {
          console.error('Error updating profile:', result.error);
          return new Response(
            JSON.stringify({ error: 'Failed to update profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Profile updated for user:', userId);

        return new Response(
          JSON.stringify({ profile: result.data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'change-password': {
        const { current_password, new_password } = data;

        if (!current_password || !new_password) {
          return new Response(
            JSON.stringify({ error: 'Current and new password are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (new_password.length < 6) {
          return new Response(
            JSON.stringify({ error: 'New password must be at least 6 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get current user password hash
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('password_hash')
          .eq('id', userId)
          .single();

        if (userError || !user) {
          console.error('Error fetching user for password change:', userError);
          return new Response(
            JSON.stringify({ error: 'Failed to verify current password' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
        if (!isValidPassword) {
          return new Response(
            JSON.stringify({ error: 'Current password is incorrect' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(new_password);

        // Update password
        const { error: updateError } = await supabase
          .from('users')
          .update({ password_hash: newPasswordHash })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating password:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update password' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Password changed for user:', userId);

        return new Response(
          JSON.stringify({ success: true, message: 'Password updated successfully' }),
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
    console.error('Profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
