const express = require('express');
const auth = require('../middleware/auth');
const {
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
  stripeWebhook,
  getPaymentMethods,
  savePaymentMethod
} = require('../controllers/paymentController');

const router = express.Router();

// Stripe routes
router.post('/stripe/create-intent', auth, createStripePaymentIntent);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Razorpay routes
router.post('/razorpay/create-order', auth, createRazorpayOrder);
router.post('/razorpay/verify', auth, verifyRazorpayPayment);

// Payment methods
router.get('/methods', auth, getPaymentMethods);
router.post('/methods', auth, savePaymentMethod);

module.exports = router;