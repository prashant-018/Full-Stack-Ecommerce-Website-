const express = require('express');
const mongoose = require('mongoose');
const { body, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order (supports both guest and logged-in users)
// @access  Public (with optional auth)
router.post('/', optionalAuth, [
  // Items validation - flexible to handle both productId and product fields
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').optional().isMongoId().withMessage('Valid product ID is required'),
  body('items.*.productId').optional().isMongoId().withMessage('Valid product ID is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Valid item price is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('items.*.size').notEmpty().withMessage('Item size is required'),
  body('items.*.color').notEmpty().withMessage('Item color is required'),

  // Customer info validation (required for guest orders, optional for logged-in users)
  body('customerInfo').optional().isObject().withMessage('Customer info must be an object'),
  body('customerInfo.name').optional().notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').optional().isEmail().withMessage('Valid customer email is required'),

  // Shipping address validation
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone number is required'),

  // Payment and pricing validation
  body('paymentMethod').isIn(['COD', 'CARD', 'cod', 'card']).withMessage('Valid payment method is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal is required'),
  body('shipping').optional().isFloat({ min: 0 }).withMessage('Valid shipping cost required'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Valid tax amount required'),
  body('total').isFloat({ min: 0 }).withMessage('Valid total amount is required')
], async (req, res) => {
  try {
    console.log('📦 Creating new order:', {
      user: req.user?.userId || 'guest',
      customerInfo: req.body.customerInfo,
      itemsCount: req.body.items?.length || 0,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod,
      hasAuthToken: !!req.headers.authorization
    });

    console.log('🔍 Full request body:', JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Order validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          value: err.value
        }))
      });
    }

    const {
      customerInfo,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentId,
      subtotal,
      shippingCost = 0,
      shipping = 0,
      tax = 0,
      discount = 0,
      total
    } = req.body;

    // For guest orders, customerInfo is required
    if (!req.user && (!customerInfo || !customerInfo.name || !customerInfo.email)) {
      return res.status(400).json({
        success: false,
        message: 'Customer information (name and email) is required for guest checkout'
      });
    }

    // Validate and populate product details
    const orderItems = [];
    let calculatedSubtotal = 0;

    console.log('🔍 Processing items:', items.map(item => ({
      product: item.product,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })));

    for (const [index, item] of items.entries()) {
      // Handle both productId and product fields from frontend
      const productRef = item.product || item.productId;

      console.log(`🔍 Processing item ${index + 1}:`, {
        productRef,
        name: item.name,
        hasProduct: !!item.product,
        hasProductId: !!item.productId
      });

      if (!productRef) {
        console.error(`❌ Missing product ID for item ${index + 1}:`, item);
        return res.status(400).json({
          success: false,
          message: `Product ID is required for item ${index + 1}: ${item.name || 'Unknown item'}`
        });
      }

      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(productRef)) {
        console.error(`❌ Invalid product ID format for item ${index + 1}:`, productRef);
        return res.status(400).json({
          success: false,
          message: `Invalid product ID format for item ${index + 1}: ${item.name || productRef}`
        });
      }

      console.log(`🔍 Looking up product: ${productRef}`);
      const product = await Product.findById(productRef);
      if (!product) {
        console.error(`❌ Product not found: ${productRef}`);
        return res.status(400).json({
          success: false,
          message: `Product not found for item ${index + 1}: ${item.name || productRef}`
        });
      }

      console.log(`✅ Found product: ${product.name}`);

      // Check if product is active (if field exists)
      if (product.isActive !== undefined && !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product is not available: ${item.name || product.name}`
        });
      }

      // Check stock availability (flexible based on product schema)
      if (product.stock !== undefined && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name || product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      const itemPrice = Number(item.price);
      const itemQuantity = Number(item.quantity);

      if (isNaN(itemPrice) || itemPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for item ${index + 1}: ${item.name}`
        });
      }

      if (isNaN(itemQuantity) || itemQuantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item ${index + 1}: ${item.name}`
        });
      }

      calculatedSubtotal += itemPrice * itemQuantity;

      orderItems.push({
        product: productRef,
        name: item.name || product.name,
        price: itemPrice,
        quantity: itemQuantity,
        size: item.size || 'M',
        color: item.color || 'Default',
        image: item.image || product.images?.[0]?.url || '/placeholder-image.jpg'
      });
    }

    console.log('✅ All items processed successfully:', {
      itemCount: orderItems.length,
      calculatedSubtotal
    });

    // Verify total calculation (allow small rounding differences)
    const normalizedShipping = shipping || shippingCost || 0;
    const calculatedTotal = calculatedSubtotal + normalizedShipping + (tax || 0) - (discount || 0);

    if (Math.abs(calculatedTotal - total) > 0.02) {
      console.warn('⚠️ Total calculation mismatch:', {
        calculated: calculatedTotal,
        provided: total,
        difference: Math.abs(calculatedTotal - total)
      });
      // Don't fail for small differences, just log warning
    }

    // Create order object
    const orderData = {
      user: req.user?.userId || null, // null for guest orders
      customerInfo: customerInfo || {
        name: req.user?.name || 'Unknown',
        email: req.user?.email || 'unknown@example.com',
        phone: req.user?.phone || ''
      },
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod: paymentMethod.toUpperCase(), // Normalize to uppercase
      paymentId: paymentId || null,
      paymentStatus: paymentMethod.toUpperCase() === 'COD' ? 'Pending' : 'Paid',
      subtotal: calculatedSubtotal,
      shippingCost: normalizedShipping,
      shipping: normalizedShipping,
      tax: tax || 0,
      discount: discount || 0,
      total,
      status: 'pending',
      orderStatus: 'Pending',
      statusHistory: [{
        status: 'pending',
        updatedAt: new Date(),
        note: 'Order placed successfully'
      }]
    };

    console.log('💾 Saving order to database:', {
      user: orderData.user || 'guest',
      itemsCount: orderItems.length,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod
    });

    // Create and save order
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created successfully:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      itemsArray: order.items,
      itemsLength: order.items ? order.items.length : 'undefined'
    });

    // Update product stock (simplified - adjust based on your Product schema)
    for (const item of orderItems) {
      try {
        const product = await Product.findById(item.product);
        if (product && typeof product.stock === 'number') {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      } catch (stockError) {
        console.warn('⚠️ Failed to update stock for product:', item.product, stockError.message);
        // Don't fail the order creation for stock update issues
      }
    }

    // Calculate totalItems safely without using virtual field
    const totalItems = order.items && Array.isArray(order.items)
      ? order.items.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          customerInfo: order.customerInfo,
          items: order.items || [],
          totalItems: totalItems,
          shippingAddress: order.shippingAddress
        }
      }
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({
        success: false,
        message: 'Order validation failed',
        errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid ${error.path}: ${error.value}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', [auth, admin], [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    // Admin sees all orders (no user filter)

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Transform orders to ensure consistent customer data
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      // Ensure customer data is always available
      customer: order.user ? {
        name: order.user.name,
        email: order.user.email
      } : {
        name: order.customerInfo.name,
        email: order.customerInfo.email
      }
    }));

    // Get total count
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders: transformedOrders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/my
// @desc    Get logged-in user's orders
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only) - kept for existing AdminOrders.jsx
// @access  Private/Admin
router.put('/:id/status', [auth, admin], [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  body('note').optional().isString().withMessage('Note must be a string'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string')
], async (req, res) => {
  try {
    console.log('📦 Order status update request:', { orderId: req.params.id, body: req.body, user: req.user });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, note, trackingNumber, estimatedDelivery } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ Invalid ObjectId:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      console.error('❌ Order not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('📦 Found order:', { orderNumber: order.orderNumber, currentStatus: order.status });

    // Update status and optional fields
    const oldStatus = order.status;
    order.status = status;

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (note) {
      order.notes = note;
    }

    // Add to status history
    order.statusHistory.push({
      status: status,
      updatedBy: req.user.userId,
      updatedAt: new Date(),
      note: note || `Status changed from ${oldStatus} to ${status}`
    });

    // Set delivery timestamp if delivered
    if (status === 'delivered' && oldStatus !== 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    console.log('✅ Order status updated successfully:', { orderNumber: order.orderNumber, newStatus: status });

    // Populate for response
    await order.populate('user', 'name email');
    await order.populate('items.product', 'name images');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/orders/stats
// @desc    Get order statistics (Admin only)
// @access  Private/Admin
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    // Get order statistics using aggregation
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();

    // Get total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent orders with safe population
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerInfo total status createdAt user');

    // Format status breakdown
    const statusBreakdown = statusStats.map(stat => ({
      _id: stat._id,
      count: stat.count,
      totalAmount: stat.totalAmount
    }));

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        statusBreakdown,
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          customerInfo: order.customerInfo,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          // Use populated user data if available, otherwise use customerInfo
          customer: order.user ? {
            name: order.user.name,
            email: order.user.email
          } : {
            name: order.customerInfo.name,
            email: order.customerInfo.email
          }
        }))
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const filter = { _id: id };

    // If not admin, only allow access to own orders
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }

    const order = await Order.findOne(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .populate('statusHistory.updatedBy', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, admin], [
  body('orderStatus').optional().isIn(['Pending', 'Processing', 'Shipped', 'Completed']).withMessage('Invalid orderStatus'),
  body('paymentStatus').optional().isIn(['Pending', 'Paid', 'Failed', 'Refunded']).withMessage('Invalid paymentStatus'),
  body('note').optional().isString().withMessage('Note must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { orderStatus, paymentStatus, note, trackingNumber, estimatedDelivery } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    if (note) order.notes = note;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    await order.save();

    // Populate for response
    await order.populate('user', 'name email');
    await order.populate('items.product', 'name images');

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order details (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['notes', 'trackingNumber', 'estimatedDelivery', 'shippingAddress', 'billingAddress'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        order[field] = updates[field];
      }
    });

    await order.save();

    // Populate for response
    await order.populate('user', 'name email');
    await order.populate('items.product', 'name images');

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order'
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order (Admin only or order owner within time limit)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && order.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in current status'
      });
    }

    // Cancel order
    await order.updateStatus('cancelled', req.user.id, reason);
    order.cancelReason = reason;
    order.cancelledAt = new Date();
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].stock += item.quantity;
          await product.save();
        }
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

module.exports = router;