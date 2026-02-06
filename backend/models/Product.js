const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      "Men's Shirts",
      "Men's Pants",
      "Men's Jeans",
      "Men's T-Shirts",
      "Men's Jackets",
      "Men's Sweaters",
      "Men's Suits",
      "Men's Shorts",
      "Men's Underwear",
      "Men's Activewear",
      "Women's Sweaters",
      "Women's Tops",
      "Women's Dresses",
      "Women's Pants",
      "Women's Jeans",
      "Women's Skirts",
      "Women's Jackets",
      "Women's Shoes",
      "Women's Accessories",
      "Women's Underwear",
      "Shoes",
      "Accessories"
    ]
  },
  // Section of the catalog this product belongs to (men / women)
  // Kept optional so existing products without section continue to work.
  // New products should always set this explicitly.
  section: {
    type: String,
    enum: ['men', 'women'],
    index: true
  },
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    hex: {
      type: String,
      required: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format']
    },
    image: String // Optional color-specific image
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  brand: {
    type: String,
    trim: true
  },
  material: String,
  fit: {
    type: String,
    enum: ['Slim', 'Regular', 'Relaxed', 'Oversized'],
    default: 'Regular'
  },
  care: [String],
  features: [String],
  sku: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, section: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isFeatured: 1 });

// Virtual for total stock across all sizes
productSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((total, size) => total + size.stock, 0);
});

// Virtual for available sizes (sizes with stock > 0)
productSchema.virtual('availableSizes').get(function () {
  return this.sizes.filter(size => size.stock > 0).map(size => size.size);
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function () {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '');
});

// Pre-save middleware to calculate discount percentage
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.price) {
    this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function () {
  return this.totalStock > 0;
};

// Method to get stock for specific size
productSchema.methods.getStockForSize = function (size) {
  const sizeObj = this.sizes.find(s => s.size === size);
  return sizeObj ? sizeObj.stock : 0;
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema);