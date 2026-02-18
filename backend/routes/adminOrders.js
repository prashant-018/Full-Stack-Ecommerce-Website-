const express = require('express');
const mongoose = require('mongoose');
const { body, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// GET /api/admin/orders -> admin fetch all orders
router.get('/orders', [auth, admin], [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
], async (req, res) => {
  try {
    console.log('📡 Admin fetching orders with params:', req.query);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
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
    if (status) filter.status = status;

    if (search) {
      // Search by orderNumber only since customerInfo doesn't exist in schema
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .populate({
        path: 'items.productId',
        select: 'name images price salePrice category subcategory'
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Transform orders to ensure consistent customer data and rich product info
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();

      // Enhanced customer information - userId is now the field name
      const customer = order.userId ? {
        name: order.userId.name,
        email: order.userId.email,
        type: 'registered'
      } : {
        name: 'Guest Customer',
        email: 'No email',
        type: 'guest'
      };

      // Enhanced items with product details - productId is now the field name
      const enhancedItems = orderObj.items.map(item => ({
        ...item,
        productDetails: item.productId ? {
          name: item.productId.name,
          image: item.productId.images?.[0]?.url || item.image || '/placeholder-image.jpg',
          category: item.productId.category,
          subcategory: item.productId.subcategory
        } : {
          name: item.name || 'Unknown Product',
          image: item.image || '/placeholder-image.jpg',
          category: 'Unknown',
          subcategory: 'Unknown'
        }
      }));

      // Calculate total items
      const totalItems = enhancedItems.reduce((total, item) => total + (item.quantity || 0), 0);

      return {
        ...orderObj,
        customer,
        items: enhancedItems,
        totalItems,
        totalAmount: orderObj.totalAmount, // Use correct field name
        // Add summary for quick display
        itemsSummary: {
          count: totalItems,
          firstItem: enhancedItems[0] || null,
          hasMultiple: enhancedItems.length > 1,
          additionalCount: enhancedItems.length > 1 ? enhancedItems.length - 1 : 0
        }
      };
    });

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    console.log('📦 Admin orders fetched:', { total, page: parseInt(page), totalPages });

    return res.json({
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
    console.error('❌ Admin get orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/admin/orders/stats -> get order statistics
router.get('/orders/stats', [auth, admin], async (req, res) => {
  try {
    console.log('📊 Admin fetching order stats...');

    // Get order statistics using aggregation - use totalAmount instead of total
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();

    // Get total revenue from delivered orders - use totalAmount instead of total
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent orders - populate userId instead of user
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalAmount status createdAt userId');

    // Format status breakdown
    const statusBreakdown = statusStats.map(stat => ({
      _id: stat._id,
      count: stat.count,
      totalAmount: stat.totalAmount
    }));

    console.log('📊 Order stats calculated:', { totalOrders, totalRevenue, statusBreakdown: statusBreakdown.length });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        statusBreakdown,
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount, // Use correct field name
          status: order.status,
          createdAt: order.createdAt,
          customer: order.userId ? {
            name: order.userId.name,
            email: order.userId.email
          } : {
            name: 'Guest Customer',
            email: 'No email'
          }
        }))
      }
    });

  } catch (error) {
    console.error('❌ Get admin order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/admin/orders/:id/status -> update order status
router.put('/orders/:id/status', [auth, admin], [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid status'),
  body('note').optional().isString().withMessage('Note must be a string'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string')
], async (req, res) => {
  try {
    console.log('🔧 Admin updating order status:', {
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

    // Store old status for logging
    const oldStatus = order.status;

    // Update order fields
    order.status = status;

    if (trackingNumber !== undefined && trackingNumber !== null) {
      order.trackingNumber = trackingNumber;
    }

    if (note) {
      order.notes = note;
    }

    // Note: statusHistory field doesn't exist in current schema
    // If you need status history, add it to the Order model first

    // Set delivery timestamp if status is delivered
    if (status === 'delivered' && oldStatus !== 'delivered') {
      order.deliveredAt = new Date();
    }

    // Note: cancelledAt field doesn't exist in current schema
    // If you need it, add it to the Order model first

    await order.save();

    console.log('✅ Order status updated successfully:', {
      orderNumber: order.orderNumber,
      oldStatus,
      newStatus: status,
      trackingNumber: order.trackingNumber
    });

    // Populate for response - use userId and items.productId
    await order.populate('userId', 'name email');
    await order.populate({
      path: 'items.productId',
      select: 'name images price salePrice category subcategory'
    });

    // Calculate totalItems safely
    const totalItems = order.items && Array.isArray(order.items)
      ? order.items.reduce((total, item) => total + (item.quantity || 0), 0)
      : 0;

    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: {
          ...order.toObject(),
          totalItems: totalItems
        },
        statusChanged: oldStatus !== status,
        previousStatus: oldStatus
      }
    });
  } catch (error) {
    console.error('❌ Admin update order status error:', error);

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

    return res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/admin/orders/:id -> delete order (admin only)
router.delete('/orders/:id', [auth, admin], async (req, res) => {
  try {
    console.log('🗑️ Admin deleting order:', {
      orderId: req.params.id,
      adminUser: req.user.email
    });

    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    // Find the order first to get details for logging
    const order = await Order.findById(id);
    if (!order) {
      console.error('❌ Order not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('📦 Found order to delete:', {
      orderNumber: order.orderNumber,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status
    });

    // Check if order can be deleted (business logic)
    if (order.status === 'delivered') {
      console.warn('⚠️ Attempting to delete delivered order:', order.orderNumber);
      return res.status(400).json({
        success: false,
        message: 'Cannot delete delivered orders. Please contact system administrator.'
      });
    }

    // Delete the order
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      console.error('❌ Failed to delete order:', id);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete order'
      });
    }

    console.log('✅ Order deleted successfully:', {
      orderNumber: deletedOrder.orderNumber,
      deletedBy: req.user.email,
      deletedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Order deleted successfully',
      data: {
        deletedOrder: {
          _id: deletedOrder._id,
          orderNumber: deletedOrder.orderNumber,
          userId: deletedOrder.userId,
          totalAmount: deletedOrder.totalAmount,
          status: deletedOrder.status
        }
      }
    });

  } catch (error) {
    console.error('❌ Admin delete order error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;


