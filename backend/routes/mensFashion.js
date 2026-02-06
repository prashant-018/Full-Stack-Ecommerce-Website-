const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  createMensProduct,
  getMensProducts,
  getMensProductById
} = require('../controllers/mensFashionController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for creating men's products
const validateMensProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),

  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),

  body('originalPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Original price must be a positive number'),

  body('category')
    .isIn([
      "Men's Shirts", "Men's Pants", "Men's Jeans", "Men's T-Shirts",
      "Men's Jackets", "Men's Sweaters", "Men's Suits", "Men's Shorts",
      "Shoes", "Accessories", "Men's Underwear", "Men's Activewear"
    ])
    .withMessage('Invalid category for men\'s fashion'),

  body('sizes')
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),

  body('sizes.*.size')
    .notEmpty()
    .withMessage('Size name is required'),

  body('sizes.*.stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('colors')
    .isArray({ min: 1 })
    .withMessage('At least one color is required'),

  body('colors.*.name')
    .notEmpty()
    .withMessage('Color name is required'),

  body('colors.*.hex')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color hex must be a valid hex color code'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),

  body('images.*.url')
    .isURL()
    .withMessage('Image URL must be valid'),

  body('sku')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3 and 50 characters'),

  handleValidationErrors
];

// Query validation for getting products
const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be non-negative'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be non-negative'),

  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'createdAt', 'rating.average'])
    .withMessage('Sort by must be name, price, createdAt, or rating.average'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  handleValidationErrors
];

// @desc    Create new men's fashion product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', auth, adminAuth, validateMensProduct, createMensProduct);

// @desc    Get men's fashion products with filters and pagination
// @route   GET /api/products?section=Men
// @access  Public
router.get('/', validateProductQuery, getMensProducts);

// @desc    Get single men's fashion product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', getMensProductById);

module.exports = router;