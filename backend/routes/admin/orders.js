const express = require('express');
const mongoose = require('mongoose');
const { body, query, validationResult } = require('express-validator');
const Order = require('../../models/Order');
const auth = require('../../middleware/auth');
const { admin } = require('../../middleware/admin');

const router = express.Router();

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [auth, admin], [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  body('note').optional().isString().withMessage('Note must be a string'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string')
], async (req, res) => {
  try {
    console.log('🔧 Admin order status update:', {
      orderId: req.params.id,
      body: req.body,
      adminUser: req.user.email
    });

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
    const { status, note, trackingNumber } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      console.error('❌ Order not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('📦 Found order:', {
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      requestedStatus: status
    });

    // Store old status for history
    const oldStatus = order.status;

    // Update order fields
    order.status = status;

    if (trackingNumber !== undefined && trackingNumber !== null) {
      order.trackingNumber = trackingNumber;
    }

    if (note) {
      order.notes = note;
    }

    // Add to status history
    order.statusHistory.push({
      status: status,
      updatedBy: req.user.userId,
      updatedAt: new Date(),
      note: note || `Status updated from ${oldStatus} to ${status} by admin`
    });

    // Set delivery timestamp if status is delivered
    if (status === 'delivered' && oldStatus !== 'delivered') {
      order.deliveredAt = new Date();
    }

    // Set cancellation timestamp if status is cancelled
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      order.cancelledAt = new Date();
    }

    // Save the order
    await order.save();

    console.log('✅ Order status updated successfully:', {
      orderNumber: order.orderNumber,
      oldStatus,
      newStatus: status,
      trackingNumber: order.trackingNumber
    });

    // Populate for response
    await order.populate('user', 'name email');
    await order.populate('items.product', 'name images');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order,
        statusChanged: oldStatus !== status,
        previousStatus: oldStatus
      }
    });

  } catch (error) {
    console.error('❌ Admin order status update error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
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
      customer: order.user ? {
        name: order.user.name,
        email: order.user.email
      } : {
        name: order.customerInfo?.name || 'Guest Customer',
        email: order.customerInfo?.email || 'No email'
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
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/admin/orders/stats
// @desc    Get order statistics for admin
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

    // Get recent orders
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
          customer: order.user ? {
            name: order.user.name,
            email: order.user.email
          } : {
            name: order.customerInfo?.name || 'Guest Customer',
            email: order.customerInfo?.email || 'No email'
          }
        }))
      }
    });

  } catch (error) {
    console.error('Get admin order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;