// Middleware to log all incoming requests to /api/orders
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Log all requests to /api/orders
app.use('/api/orders', (req, res, next) => {
  console.log('\\n🔍 INCOMING REQUEST TO /api/orders');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Params:', JSON.stringify(req.params, null, 2));
  console.log('\\n' + '='.repeat(80) + '\\n');
  next();
});

// Simple test endpoint
app.post('/api/orders', (req, res) => {
  console.log('📦 Processing order request...');

  // Check for common validation issues
  const issues = [];

  if (!req.body.customerInfo) {
    issues.push('Missing customerInfo');
  } else {
    if (!req.body.customerInfo.name) issues.push('Missing customerInfo.name');
    if (!req.body.customerInfo.email) issues.push('Missing customerInfo.email');
  }

  if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
    issues.push('Missing or empty items array');
  } else {
    req.body.items.forEach((item, index) => {
      if (!item.name) issues.push(`Item ${index}: missing name`);
      if (!item.price) issues.push(`Item ${index}: missing price`);
      if (!item.quantity) issues.push(`Item ${index}: missing quantity`);
      if (!item.size) issues.push(`Item ${index}: missing size`);
      if (!item.color) issues.push(`Item ${index}: missing color`);
      if (!item.productId && !item.product) issues.push(`Item ${index}: missing productId/product`);
    });
  }

  if (!req.body.shippingAddress) {
    issues.push('Missing shippingAddress');
  } else {
    const addr = req.body.shippingAddress;
    if (!addr.fullName) issues.push('Missing shippingAddress.fullName');
    if (!addr.address) issues.push('Missing shippingAddress.address');
    if (!addr.city) issues.push('Missing shippingAddress.city');
    if (!addr.state) issues.push('Missing shippingAddress.state');
    if (!addr.zipCode) issues.push('Missing shippingAddress.zipCode');
    if (!addr.phone) issues.push('Missing shippingAddress.phone');
  }

  if (!req.body.paymentMethod) {
    issues.push('Missing paymentMethod');
  }

  if (req.body.subtotal === undefined) issues.push('Missing subtotal');
  if (req.body.total === undefined) issues.push('Missing total');

  if (issues.length > 0) {
    console.log('❌ Validation Issues Found:');
    issues.forEach(issue => console.log(`  - ${issue}`));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      issues: issues
    });
  }

  console.log('✅ All validation checks passed!');

  res.status(201).json({
    success: true,
    message: 'Order would be created successfully',
    data: {
      order: {
        _id: 'test-id',
        orderNumber: 'TEST-001',
        status: 'pending',
        total: req.body.total
      }
    }
  });
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`🔍 Request Logger Server running on port ${PORT}`);
  console.log('Change your frontend API base URL to http://localhost:5003 to test');
});

module.exports = app;