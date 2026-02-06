const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  sizeFit: {
    type: String,
    enum: ['Runs Small', 'True to Size', 'Runs Large'],
    required: [true, 'Size fit is required']
  },
  verifiedBuyer: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reviews from same user for same product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ isApproved: 1 });

// Virtual for time ago
reviewSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

// Static method to calculate product rating stats
reviewSchema.statics.calculateProductRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length > 0) {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    stats[0].ratingDistribution.forEach(rating => {
      distribution[rating]++;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      distribution
    };
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };
};

// Static method to calculate size fit stats
reviewSchema.statics.calculateSizeFitStats = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$sizeFit',
        count: { $sum: 1 }
      }
    }
  ]);

  const sizeFitStats = {
    'Runs Small': 0,
    'True to Size': 0,
    'Runs Large': 0
  };

  stats.forEach(stat => {
    sizeFitStats[stat._id] = stat.count;
  });

  const total = Object.values(sizeFitStats).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return { recommendation: 'True to Size', percentage: 0 };
  }

  const maxFit = Object.keys(sizeFitStats).reduce((a, b) =>
    sizeFitStats[a] > sizeFitStats[b] ? a : b
  );

  return {
    recommendation: maxFit,
    percentage: Math.round((sizeFitStats[maxFit] / total) * 100),
    breakdown: sizeFitStats
  };
};

// Ensure virtual fields are serialized
reviewSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Review', reviewSchema);