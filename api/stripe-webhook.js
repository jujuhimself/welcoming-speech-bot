const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // You should store order/session metadata when creating the session
    const userId = session.metadata?.user_id;
    const orderId = session.metadata?.order_id;
    try {
      // 1. Find the order in Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();
      if (error || !order) throw error || new Error('Order not found');

      // 2. Deduct stock for each product in the order
      for (const item of order.items) {
        await supabase.rpc('deduct_stock', {
          product_id: item.id,
          quantity: item.quantity
        });
      }

      // 3. Mark the order as paid
      await supabase
        .from('orders')
        .update({ status: 'paid', payment_status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      // 4. Send notifications (implement your notification logic here)
      // await sendNotification(userId, orderId, ...);
      console.log('Order paid, stock deducted, notifications sent');
    } catch (err) {
      console.error('Error handling checkout.session.completed:', err);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.status(200).json({ received: true });
}; 