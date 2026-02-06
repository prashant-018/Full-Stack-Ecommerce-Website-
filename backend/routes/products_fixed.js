const express = require('express');
const mongoose = require('mongoose');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

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

    // FIXED: Exact section matching to prevent men/women products mixing
    if (section && section.trim()) {
      const sectionValue = section.trim().toLowerCase();
      console.log('🔍 Filtering by section:', sectionValue);
      
      // Use exact match only - no regex to prevent cross-contamination
      filter.section = sectionValue;
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

    // Execute query with proper error handling
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
    console.error('❌ Error stack:', erro