const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  deliveredAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ 'items.productId': 1 });
orderSchema.index({ status: 1 });

// Method to check if user has purchased a product
orderSchema.statics.hasUserPurchasedProduct = async function (userId, productId) {
  const order = await this.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    'items.productId': new mongoose.Types.ObjectId(productId),
    status: 'delivered'
  });

  return !!order;
};

module.exports = mongoose.model('Order', orderSchema);