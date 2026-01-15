import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface N8nPayload {
  event: string;
  user_email?: string;
  user_id?: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const payload: N8nPayload = await req.json();
    console.log('Received n8n webhook:', JSON.stringify(payload, null, 2));

    // Log the webhook
    const { data: logEntry } = await supabase.from('webhook_logs').insert({
      source: 'n8n',
      event: payload.event || 'unknown',
      payload: payload,
    }).select('id').single();

    const response: Record<string, unknown> = { success: true };

    // Handle different event types from n8n
    switch (payload.event) {
      case 'send_welcome_email':
        // n8n sends this to confirm welcome email was sent
        console.log('Welcome email confirmed for:', payload.user_email);
        response.message = 'Welcome email logged';
        break;

      case 'send_milestone_email':
        // n8n sends this for milestone notifications
        console.log('Milestone email for:', payload.user_email, payload.data);
        response.message = 'Milestone email logged';
        break;

      case 'generate_certificate':
        // n8n sends this when certificate is generated
        console.log('Certificate generated for:', payload.user_email);
        response.message = 'Certificate generation logged';
        break;

      case 'user_feedback':
        // Store user feedback
        if (payload.user_id && payload.data) {
          // You could store this in a feedback table if created
          console.log('User feedback received:', payload.data);
          response.message = 'Feedback received';
        }
        break;

      case 'get_user_progress':
        // Return user progress for n8n workflows
        if (payload.user_email) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('email', payload.user_email)
            .maybeSingle();

          if (profile) {
            const { data: progress } = await supabase
              .from('day_progress')
              .select('day_id, completed, completed_at')
              .eq('user_id', profile.id)
              .eq('completed', true)
              .order('day_id', { ascending: false });

            response.user = {
              id: profile.id,
              name: profile.full_name,
              completedDays: progress?.length || 0,
              lastCompletedDay: progress?.[0]?.day_id || 0,
              progress: progress,
            };
          }
        }
        break;

      case 'get_milestone_users': {
        // Return users who reached a milestone (for batch emails)
        const milestone = typeof payload.data?.milestone === 'number' ? payload.data.milestone : 5;
        const { data: milestoneUsers } = await supabase
          .from('day_progress')
          .select(`
            user_id,
            day_id,
            completed_at,
            profiles!inner(email, full_name)
          `)
          .eq('day_id', milestone)
          .eq('completed', true);

        interface MilestoneUserRow {
          user_id: string;
          day_id: number;
          completed_at: string | null;
          profiles: { email: string | null; full_name: string | null }[];
        }

        const users = (milestoneUsers as MilestoneUserRow[] || []).map((item) => ({
          user_id: item.user_id,
          email: item.profiles?.[0]?.email ?? null,
          name: item.profiles?.[0]?.full_name ?? null,
          completed_at: item.completed_at,
        }));

        response.users = users;
        break;
      }

      default:
        console.log('Unknown event type:', payload.event);
        response.message = 'Event logged';
    }

    // Update webhook log
    if (logEntry?.id) {
      await supabase
        .from('webhook_logs')
        .update({ status_code: 200, response })
        .eq('id', logEntry.id);
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('n8n webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
