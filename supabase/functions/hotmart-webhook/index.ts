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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
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

    // Log the webhook
    const { data: logEntry } = await supabase.from('webhook_logs').insert({
      source: 'hotmart',
      event: payload.event,
      payload: payload,
    }).select('id').single();

    const buyerEmail = payload.data?.buyer?.email?.toLowerCase()?.trim();
    const buyerName = payload.data?.buyer?.name || 'Participante';
    const transactionId = payload.data?.purchase?.transaction;
    const productId = payload.data?.product?.id || 'fire-challenge';

    if (!buyerEmail) {
      console.error('No buyer email in payload');
      await updateWebhookLog(supabase, logEntry?.id, 400, { error: 'Missing buyer email' });
      return new Response(
        JSON.stringify({ error: 'Missing buyer email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Hotmart events to subscription status
    let subscriptionStatus: 'active' | 'canceled' | 'overdue' | 'refunded' = 'active';
    let shouldCreateUser = false;
    let shouldBlockAccess = false;
    
    switch (payload.event) {
      case 'PURCHASE_APPROVED':
      case 'PURCHASE_COMPLETE':
      case 'SUBSCRIPTION_REACTIVATION':
        subscriptionStatus = 'active';
        shouldCreateUser = true;
        break;
      case 'PURCHASE_CANCELED':
      case 'SUBSCRIPTION_CANCELLATION':
        subscriptionStatus = 'canceled';
        shouldBlockAccess = true;
        break;
      case 'PURCHASE_REFUNDED':
      case 'PURCHASE_CHARGEBACK':
        subscriptionStatus = 'refunded';
        shouldBlockAccess = true;
        break;
      case 'PURCHASE_DELAYED':
      case 'PURCHASE_PROTEST':
        subscriptionStatus = 'overdue';
        break;
      default:
        console.log('Unhandled event type:', payload.event);
    }

    // Check if user exists by email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let user = existingUsers?.users?.find(u => u.email?.toLowerCase() === buyerEmail);

    // Create user if this is a purchase event and user doesn't exist
    if (shouldCreateUser && !user) {
      console.log('Creating new user for:', buyerEmail);
      const tempPassword = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: buyerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: buyerName,
        },
      });

      if (createError) {
        console.error('Error creating user:', createError);
        await updateWebhookLog(supabase, logEntry?.id, 500, { error: createError.message });
        return new Response(
          JSON.stringify({ error: 'Failed to create user', details: createError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      user = newUser?.user;
      console.log('User created successfully:', user?.id);

      // Send password reset email so user can set their password
      if (user?.email) {
        const { error: resetError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: user.email,
        });
        if (resetError) {
          console.warn('Could not generate recovery link:', resetError);
        }
      }
    }

    // Get or create profile
    let profileId = user?.id;
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', buyerEmail)
        .maybeSingle();
      
      profileId = profile?.id || user.id;
    }

    // Update subscription if we have a user
    if (profileId) {
      const subscriptionData = {
        user_id: profileId,
        product_id: productId,
        status: subscriptionStatus,
        hotmart_sale_id: transactionId,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Try to update existing subscription by hotmart_sale_id first
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('hotmart_sale_id', transactionId)
        .maybeSingle();

      if (existingSub) {
        await supabase
          .from('subscriptions')
          .update({ status: subscriptionStatus, updated_at: new Date().toISOString() })
          .eq('id', existingSub.id);
      } else {
        // Check for existing subscription by user and product
        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', profileId)
          .eq('product_id', productId)
          .maybeSingle();

        if (userSub) {
          await supabase
            .from('subscriptions')
            .update({ 
              status: subscriptionStatus, 
              hotmart_sale_id: transactionId,
              updated_at: new Date().toISOString() 
            })
            .eq('id', userSub.id);
        } else {
          await supabase.from('subscriptions').insert(subscriptionData);
        }
      }

      console.log('Subscription updated:', { profileId, status: subscriptionStatus });
    }

    // Update webhook log with success
    await updateWebhookLog(supabase, logEntry?.id, 200, { 
      success: true, 
      status: subscriptionStatus,
      userId: profileId,
      userCreated: shouldCreateUser && !existingUsers?.users?.find(u => u.email?.toLowerCase() === buyerEmail)
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: subscriptionStatus,
        message: shouldCreateUser ? 'User created/updated' : 'Subscription updated'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function updateWebhookLog(supabase: any, logId: string | undefined, statusCode: number, response: any) {
  if (!logId) return;
  await supabase
    .from('webhook_logs')
    .update({ status_code: statusCode, response })
    .eq('id', logId);
}
