const { body, query, validationResult } = require('express-validator');

// Handle validation errors
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

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),

  body('salePrice')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Sale price must be a positive number'),

  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),

  body('subcategory')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Subcategory must be between 2 and 50 characters'),

  body('gender')
    .isIn(['men', 'women', 'unisex'])
    .withMessage('Gender must be men, women, or unisex'),

  body('sizes')
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),

  body('sizes.*.name')
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
    .matches(/^#[0-9A-F]{6}$/i)
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

// User registration validation
const validateRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),

  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Cart item validation
const validateCartItem = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),

  body('size')
    .notEmpty()
    .withMessage('Size is required'),

  body('color')
    .notEmpty()
    .withMessage('Color is required'),

  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),

  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),

  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),

  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),

  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe'])
    .withMessage('Valid payment method is required'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),

  handleValidationErrors
];

// Query validation for products
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
    .isIn(['name', 'price', 'createdAt', 'rating'])
    .withMessage('Sort by must be name, price, createdAt, or rating'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateProduct,
  validateRegistration,
  validateLogin,
  validateCartItem,
  validateOrder,
  validateProductQuery
};