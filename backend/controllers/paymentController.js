const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Stripe payment intent
// @route   POST /api/payment/stripe/create-intent
// @access  Private
const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    // Validate order belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderId,
        userId: req.user.userId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    order.paymentDetails.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });

  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    // Validate order belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId,
        userId: req.user.userId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    order.paymentDetails.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order'
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    order.paymentDetails.paymentStatus = 'completed';
    order.status = 'confirmed';
    order.confirmedAt = new Date();

    // Add to status history
    order.statusHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Payment confirmed via Razorpay'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payment/stripe/webhook
// @access  Public (but verified via Stripe signature)
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      // Find and update order
      const order = await Order.findOne({
        'paymentDetails.stripePaymentIntentId': paymentIntent.id
      });

      if (order) {
        order.paymentDetails.paymentStatus = 'completed';
        order.status = 'confirmed';
        order.confirmedAt = new Date();

        // Add to status history
        order.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(),
          note: 'Payment confirmed via Stripe webhook'
        });

        await order.save();
        console.log('Order confirmed via Stripe webhook:', order.orderNumber);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;

      // Find and update order
      const failedOrder = await Order.findOne({
        'paymentDetails.stripePaymentIntentId': failedPayment.id
      });

      if (failedOrder) {
        failedOrder.paymentDetails.paymentStatus = 'failed';
        failedOrder.status = 'payment_failed';

        // Add to status history
        failedOrder.statusHistory.push({
          status: 'payment_failed',
          timestamp: new Date(),
          note: 'Payment failed via Stripe webhook'
        });

        await failedOrder.save();
        console.log('Order payment failed via Stripe webhook:', failedOrder.orderNumber);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// @desc    Get payment methods for user
// @route   GET /api/payment/methods
// @access  Private
const getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json({
      success: true,
      data: {
        savedCards: user.paymentMethods || [],
        availableGateways: {
          stripe: !!process.env.STRIPE_SECRET_KEY,
          razorpay: !!process.env.RAZORPAY_KEY_ID
        }
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
};

// @desc    Save payment method
// @route   POST /api/payment/methods
// @access  Private
const savePaymentMethod = async (req, res) => {
  try {
    const { type, last4, brand, expiryMonth, expiryYear } = req.body;

    const user = await User.findById(req.user.userId);

    // Initialize paymentMethods array if it doesn't exist
    if (!user.paymentMethods) {
      user.paymentMethods = [];
    }

    // Add new payment method
    user.paymentMethods.push({
      type,
      last4,
      brand,
      expiryMonth,
      expiryYear,
      isDefault: user.paymentMethods.length === 0 // First card is default
    });

    await user.save();

    res.json({
      success: true,
      message: 'Payment method saved successfully'
    });

  } catch (error) {
    console.error('Save payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save payment method'
    });
  }
};

module.exports = {
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
  stripeWebhook,
  getPaymentMethods,
  savePaymentMethod
};