const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// @route   POST /api/reviews
// @desc    Add a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment, sizeFit } = req.body;

    // Validation
    if (!productId || !rating || !title || !comment || !sizeFit) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      userId: req.user.id,
      productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product (for verified buyer badge)
    const hasPurchased = await Order.hasUserPurchasedProduct(req.user.id, productId);

    // Create review
    const review = new Review({
      userId: req.user.id,
      userName: req.user.name || req.user.firstName + ' ' + req.user.lastName,
      productId,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      sizeFit,
      verifiedBuyer: hasPurchased
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    // Populate user info for response
    await review.populate('userId', 'name firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    console.error('Add review error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   GET /api/reviews/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'newest',
      rating = null
    } = req.query;

    // Build sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'oldest':
        sortCriteria = { createdAt: 1 };
        break;
      case 'highest':
        sortCriteria = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortCriteria = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortCriteria = { helpfulCount: -1, createdAt: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    // Build filter criteria
    const filterCriteria = {
      productId,
      isApproved: true
    };

    if (rating) {
      filterCriteria.rating = parseInt(rating);
    }

    // Get reviews with pagination
    const reviews = await Review.find(filterCriteria)
      .populate('userId', 'name firstName lastName avatar')
      .sort(sortCriteria)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const totalReviews = await Review.countDocuments(filterCriteria);

    // Get rating statistics
    const ratingStats = await Review.calculateProductRating(productId);

    // Get size fit statistics
    const sizeFitStats = await Review.calculateSizeFitStats(productId);

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        ...review,
        timeAgo: getTimeAgo(review.createdAt)
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page < Math.ceil(totalReviews / limit),
        hasPrevPage: page > 1
      },
      ratingStats,
      sizeFitStats
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (review owner or Admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const isAdminUser = req.user.role === 'admin';
    const isOwner =
      review.userId?.toString() === req.user.id?.toString() ||
      review.userId?.toString() === req.user.userId?.toString();

    if (!isAdminUser && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating after deletion
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      helpfulCount: review.helpfulCount
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/admin/all
// @desc    Get all reviews for admin
// @access  Private/Admin
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;

    let filterCriteria = {};
    if (status === 'approved') {
      filterCriteria.isApproved = true;
    } else if (status === 'pending') {
      filterCriteria.isApproved = false;
    }

    const reviews = await Review.find(filterCriteria)
      .populate('userId', 'name firstName lastName email')
      .populate('productId', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments(filterCriteria);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews
      }
    });

  } catch (error) {
    console.error('Get admin reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const ratingStats = await Review.calculateProductRating(productId);

    await Product.findByIdAndUpdate(productId, {
      'rating.average': ratingStats.averageRating,
      'rating.count': ratingStats.totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

module.exports = router;