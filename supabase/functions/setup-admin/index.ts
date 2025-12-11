import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, email, password, full_name, user_id, new_password } = body;

    console.log(`Admin action received: ${action}`);

    // Create new user
    if (action === 'create_user') {
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || 'Participante' },
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create default subscription for new user
      if (userData?.user) {
        await supabase.from('subscriptions').insert({
          user_id: userData.user.id,
          product_id: 'fire-challenge',
          status: 'active',
          started_at: new Date().toISOString(),
        });
      }

      console.log('User created successfully:', email);
      return new Response(
        JSON.stringify({ success: true, user_id: userData?.user?.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Reset password (admin sends reset link)
    if (action === 'reset_password_link') {
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
      });

      if (error) {
        console.error('Error generating reset link:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Password reset link generated for:', email);
      return new Response(
        JSON.stringify({ success: true, message: 'Link de reset enviado' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update password directly (admin sets new password)
    if (action === 'update_password') {
      if (!user_id || !new_password) {
        return new Response(
          JSON.stringify({ error: 'user_id and new_password required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase.auth.admin.updateUserById(user_id, {
        password: new_password,
      });

      if (error) {
        console.error('Error updating password:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Password updated for user:', user_id);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete user
    if (action === 'delete_user') {
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'user_id required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase.auth.admin.deleteUser(user_id);

      if (error) {
        console.error('Error deleting user:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('User deleted:', user_id);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin user (legacy support)
    if (!action) {
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Admin FIRE' },
      });

      if (createError) {
        console.error('Error creating admin:', createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (userData?.user) {
        await supabase.from('user_roles').upsert({
          user_id: userData.user.id,
          role: 'admin',
        }, { onConflict: 'user_id,role' });
      }

      console.log('Admin user created:', email);
      return new Response(
        JSON.stringify({ success: true, user: userData?.user?.email }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Setup error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
