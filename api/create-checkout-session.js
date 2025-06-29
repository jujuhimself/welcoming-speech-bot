const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { amount, currency, productName, success_url, cancel_url } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency || 'usd',
          product_data: { name: productName || 'Checkout' },
          unit_amount: amount, // in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url,
      cancel_url,
    });
    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 