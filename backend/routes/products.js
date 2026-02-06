const express = require('express');
const mongoose = require('mongoose');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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
      q: query,
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sortBy = 'relevance'
    } = req.query;

    // Build search filter
    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };

    // Additional filters
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'price_low':
        sortOptions = { price: 1 };
        break;
      case 'price_high':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.json({
      success: true,
      data: {
        products,
        searchQuery: query,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrivals
// @access  Public
router.get('/new-arrivals', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isNewArrival: true
    })
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching new arrivals'
    });
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative')
], async (req, res) => {
  try {
    console.log('📦 GET /api/products - Query params:', req.query);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      gender,
      section,
      minPrice,
      maxPrice,
      color,
      size,
      sort = 'createdAt',
      order = 'desc',
      search,
      isNew,
      isFeatured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Safe section handling with case-insensitive matching
    if (section && section.trim()) {
      const sectionValue = section.trim().toLowerCase();
      console.log('🔍 Filtering by section:', sectionValue);

      // Handle both exact match and case-insensitive regex
      filter.$or = [
        { section: sectionValue },
        { section: { $regex: new RegExp(`^${sectionValue}$`, 'i') } }
      ];
    }

    if (category && category.trim()) {
      filter.category = { $regex: new RegExp(category.trim(), 'i') };
    }

    if (gender && gender.trim()) {
      filter.gender = { $regex: new RegExp(gender.trim(), 'i') };
    }

    if (color && color.trim()) {
      filter['colors.name'] = { $regex: new RegExp(color.trim(), 'i') };
    }

    if (size && size.trim()) {
      filter['sizes.size'] = size.trim();
    }

    if (isNew === 'true') {
      filter.isNewArrival = true;
    }

    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    console.log('🔍 MongoDB filter:', JSON.stringify(filter, null, 2));

    // Build sort object
    const sortObj = {};
    const sortField = sort || 'createdAt';
    const sortOrder = order === 'desc' ? -1 : 1;
    sortObj[sortField] = sortOrder;

    console.log('📊 Sort options:', sortObj);

    // Calculate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    console.log('📄 Pagination - Page:', pageNum, 'Limit:', limitNum, 'Skip:', skip);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance

    console.log('✅ Found products:', products.length);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    console.log('📊 Total products:', total, 'Total pages:', totalPages);

    // Always return 200 with data, even if empty
    res.status(200).json({
      success: true,
      data: {
        products: products || [],
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages || 0,
          totalProducts: total || 0,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('❌ Get products error:', error);
    console.error('❌ Error stack:', error.stack);

    // Always return 200 with empty data instead of 500
    res.status(200).json({
      success: false,
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
      data: {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🔍 Fetching product with ID:', id);

    // Validate MongoDB ObjectId format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
        error: 'Product ID must be a valid MongoDB ObjectId (24 character hex string)'
      });
    }

    // Find product by ID
    const product = await Product.findById(id).lean();

    if (!product) {
      console.log('❌ Product not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'No product exists with the provided ID'
      });
    }

    // Check if product is active (don't show inactive products to public)
    if (!product.isActive) {
      console.log('❌ Product is inactive:', id);
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'Product is no longer available'
      });
    }

    console.log('✅ Product found:', product.name, '| Section:', product.section);

    // Return consistent response structure
    res.status(200).json({
      success: true,
      product: product,
      message: 'Product retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Get product by ID error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
        error: 'Product ID must be a valid MongoDB ObjectId'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', [auth, admin], async (req, res) => {
  try {
    console.log('📦 Received product creation request:', req.body);
    console.log('👤 User:', req.user);

    // Comprehensive validation
    const validationErrors = [];

    // Required fields validation
    if (!req.body.name || !req.body.name.trim()) {
      validationErrors.push('Product name is required');
    }
    if (!req.body.price || req.body.price <= 0) {
      validationErrors.push('Valid product price is required');
    }
    if (!req.body.category) {
      validationErrors.push('Product category is required');
    }
    if (!req.body.section) {
      validationErrors.push('Product section (men/women) is required');
    }
    if (!req.body.sku || !req.body.sku.trim()) {
      validationErrors.push('Product SKU is required');
    }

    // Images validation
    if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
      validationErrors.push('At least one product image is required');
    } else {
      const validImages = req.body.images.filter(img => img && img.url && img.url.trim());
      if (validImages.length === 0) {
        validationErrors.push('At least one valid image URL is required');
      }
    }

    // Sizes validation
    if (!req.body.sizes || !Array.isArray(req.body.sizes) || req.body.sizes.length === 0) {
      validationErrors.push('At least one size with stock is required');
    } else {
      const validSizes = req.body.sizes.filter(size => size.size && size.size.trim() && size.stock >= 0);
      if (validSizes.length === 0) {
        validationErrors.push('At least one valid size with stock is required');
      }
    }

    // Colors validation
    if (!req.body.colors || !Array.isArray(req.body.colors) || req.body.colors.length === 0) {
      validationErrors.push('At least one color is required');
    } else {
      const validColors = req.body.colors.filter(color =>
        color.name && color.name.trim() &&
        color.hex && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hex)
      );
      if (validColors.length === 0) {
        validationErrors.push('At least one valid color with name and hex code is required');
      }
    }

    // Check for validation errors
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: req.body.sku.trim() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists',
        errors: ['SKU must be unique']
      });
    }

    // Prepare clean product data
    const productData = {
      name: req.body.name.trim(),
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : parseFloat(req.body.price),
      category: req.body.category,
      section: req.body.section.toLowerCase(),
      sku: req.body.sku.trim(),
      description: req.body.description ? req.body.description.trim() : '',
      brand: req.body.brand ? req.body.brand.trim() : '',
      material: req.body.material ? req.body.material.trim() : '',

      // Clean and validate images
      images: req.body.images
        .filter(img => img && img.url && img.url.trim())
        .map((img, index) => ({
          url: img.url.trim(),
          alt: img.alt || req.body.name.trim(),
          isPrimary: index === 0 // First image is primary
        })),

      // Clean and validate sizes
      sizes: req.body.sizes
        .filter(size => size.size && size.size.trim() && size.stock >= 0)
        .map(size => ({
          size: size.size.trim(),
          stock: parseInt(size.stock) || 0
        })),

      // Clean and validate colors
      colors: req.body.colors
        .filter(color =>
          color.name && color.name.trim() &&
          color.hex && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hex)
        )
        .map(color => ({
          name: color.name.trim(),
          hex: color.hex,
          image: color.image || ''
        })),

      // Clean arrays
      features: req.body.features ? req.body.features.filter(f => f && f.trim()).map(f => f.trim()) : [],
      care: req.body.care ? req.body.care.filter(c => c && c.trim()).map(c => c.trim()) : [],
      tags: req.body.tags ? req.body.tags.filter(t => t && t.trim()).map(t => t.trim()) : [],

      // Flags
      isNewArrival: Boolean(req.body.isNewArrival),
      isFeatured: Boolean(req.body.isFeatured),
      isActive: true
    };

    console.log('📦 Creating product with cleaned data:', productData);

    // Create and save product
    const product = new Product(productData);
    await product.save();

    console.log('✅ Product created successfully:', product._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('❌ Create product error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('📋 Mongoose validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Product validation failed',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.error('📋 Duplicate key error:', error.keyValue);
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`,
        errors: [`${field} must be unique`]
      });
    }

    // Handle cast errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        errors: [`Invalid ${error.path}: ${error.value}`]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      errors: ['Internal server error']
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

module.exports = router;