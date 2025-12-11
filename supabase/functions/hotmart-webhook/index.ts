import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hotmart-hottok',
};

interface HotmartPayload {
  event: string;
  data: {
    buyer: {
      email: string;
      name: string;
    };
    purchase: {
      transaction: string;
      status: string;
      approved_date?: number;
    };
    product: {
      id: string;
      name: string;
    };
    subscription?: {
      status: string;
      subscriber_code: string;
    };
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const hotmartToken = Deno.env.get('HOTMART_WEBHOOK_SECRET');

    // Validate Hotmart token if configured
    const receivedToken = req.headers.get('x-hotmart-hottok');
    if (hotmartToken && receivedToken !== hotmartToken) {
      console.error('Invalid Hotmart token received');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: HotmartPayload = await req.json();
    console.log('Received Hotmart webhook:', JSON.stringify(payload, null, 2));

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the webhook
    await supabase.from('webhook_logs').insert({
      source: 'hotmart',
      event: payload.event,
      payload: payload,
    });

    const buyerEmail = payload.data?.buyer?.email;
    const buyerName = payload.data?.buyer?.name;
    const transactionId = payload.data?.purchase?.transaction;
    const productId = payload.data?.product?.id;

    if (!buyerEmail) {
      console.error('No buyer email in payload');
      return new Response(
        JSON.stringify({ error: 'Missing buyer email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Hotmart events to subscription status
    let subscriptionStatus: 'active' | 'canceled' | 'overdue' | 'refunded' = 'active';
    
    switch (payload.event) {
      case 'PURCHASE_APPROVED':
      case 'PURCHASE_COMPLETE':
      case 'SUBSCRIPTION_REACTIVATION':
        subscriptionStatus = 'active';
        break;
      case 'PURCHASE_CANCELED':
      case 'SUBSCRIPTION_CANCELLATION':
        subscriptionStatus = 'canceled';
        break;
      case 'PURCHASE_REFUNDED':
      case 'PURCHASE_CHARGEBACK':
        subscriptionStatus = 'refunded';
        break;
      case 'PURCHASE_DELAYED':
      case 'PURCHASE_PROTEST':
        subscriptionStatus = 'overdue';
        break;
      default:
        console.log('Unhandled event type:', payload.event);
    }

    // Check if user exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const user = existingUser?.users?.find(u => u.email === buyerEmail);

    if (user) {
      // Update or create subscription for existing user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', buyerEmail)
        .maybeSingle();

      if (profile) {
        // Upsert subscription
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: profile.id,
            product_id: productId || 'fire-challenge',
            status: subscriptionStatus,
            hotmart_sale_id: transactionId,
            started_at: new Date().toISOString(),
          }, {
            onConflict: 'hotmart_sale_id',
          });

        if (subError) {
          console.error('Error upserting subscription:', subError);
        }
      }
    } else if (payload.event === 'PURCHASE_APPROVED' || payload.event === 'PURCHASE_COMPLETE') {
      // Create new user for approved purchases
      const tempPassword = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: buyerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: buyerName || 'Participante',
        },
      });

      if (createError) {
        console.error('Error creating user:', createError);
      } else if (newUser?.user) {
        // Create subscription for new user
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: newUser.user.id,
            product_id: productId || 'fire-challenge',
            status: 'active',
            hotmart_sale_id: transactionId,
            started_at: new Date().toISOString(),
          });

        if (subError) {
          console.error('Error creating subscription:', subError);
        }

        console.log('Created new user and subscription for:', buyerEmail);
        
        // TODO: Trigger n8n webhook to send welcome email with password reset link
      }
    }

    // Update webhook log with response
    await supabase
      .from('webhook_logs')
      .update({
        status_code: 200,
        response: { success: true, status: subscriptionStatus },
      })
      .eq('event', payload.event)
      .order('received_at', { ascending: false })
      .limit(1);

    return new Response(
      JSON.stringify({ success: true, status: subscriptionStatus }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
