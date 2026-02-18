const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics for admin
// @access  Private/Admin
router.get('/dashboard-stats', [auth, admin], async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats for admin:', req.user.email);

    // Get total products count
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total users count (exclude admins if needed)
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get total revenue from all orders using aggregation
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get additional useful stats
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    // Get revenue from delivered orders only (confirmed revenue)
    const confirmedRevenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          confirmedRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const confirmedRevenue = confirmedRevenueResult.length > 0
      ? confirmedRevenueResult[0].confirmedRevenue
      : 0;

    console.log('✅ Dashboard stats calculated:', {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      confirmedRevenue
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        confirmedRevenue,
        pendingOrders,
        deliveredOrders
      }
    });

  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
