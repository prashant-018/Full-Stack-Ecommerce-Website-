const Product = require('../models/Product');
const productService = require('../services/productService');

// @desc    Create a new men's fashion product
// @route   POST /api/products
// @access  Private/Admin
const createMensProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      sizes,
      colors,
      images,
      rating,
      isNewArrival,
      description,
      brand,
      material,
      care,
      features,
      sku
    } = req.body;

    // Validation
    if (!name || !price || !originalPrice || !category || !sizes || !colors || !images) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, price, originalPrice, category, sizes, colors, images'
      });
    }

    // Validate category for men's section
    const validCategories = [
      "Men's Shirts", "Men's Pants", "Men's Jeans", "Men's T-Shirts",
      "Men's Jackets", "Men's Sweaters", "Men's Suits", "Men's Shorts",
      "Shoes", "Accessories", "Men's Underwear", "Men's Activewear"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category for men\'s fashion',
        validCategories
      });
    }

    // Generate SKU if not provided
    let productSku = sku;
    if (!productSku) {
      const categoryCode = category.replace(/[^A-Z]/g, '').substring(0, 3);
      const timestamp = Date.now().toString().slice(-6);
      productSku = `MEN-${categoryCode}-${timestamp}`;
    }

    // Ensure at least one image is marked as primary
    if (images && images.length > 0) {
      const hasPrimary = images.some(img => img.isPrimary);
      if (!hasPrimary) {
        images[0].isPrimary = true;
      }
    }

    // Create product
    const product = new Product({
      name,
      price,
      originalPrice,
      category,
      section: "men",
      sizes,
      colors,
      images,
      rating: rating || { average: 0, count: 0 },
      isNewArrival: isNewArrival || false,
      description,
      brand,
      material,
      care,
      features,
      sku: productSku
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Men\'s fashion product created successfully',
      data: {
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discountPercentage: product.discountPercentage,
          category: product.category,
          section: product.section,
          primaryImage: product.primaryImage,
          rating: product.rating,
          isNewArrival: product.isNewArrival,
          totalStock: product.totalStock,
          availableSizes: product.availableSizes,
          sku: product.sku
        }
      }
    });

  } catch (error) {
    console.error('Create men\'s product error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

// @desc    Get men's fashion products with pagination
// @route   GET /api/products?section=Men
// @access  Public
const getMensProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      section = 'men', // Default to 'men' if not provided
      minPrice,
      maxPrice,
      sizes,
      colors,
      isNewArrival,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const sectionFilter = section.toLowerCase(); // 'men' or 'women'

    // Reuse unified product listing logic with section-aware behavior
    const { products, pagination } = await productService.listProducts({
      page,
      limit,
      category,
      section: sectionFilter,
      minPrice,
      maxPrice,
      sizes,
      colors,
      search,
      sortBy,
      sortOrder,
      isNew: isNewArrival,
      isFeatured,
    });

    // Format products for grid layout
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      category: product.category,
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '',
      rating: {
        average: product.rating?.average,
        count: product.rating?.count
      },
      isNewArrival: product.isNewArrival,
      brand: product.brand,
      sku: product.sku,
      hasDiscount: product.discountPercentage > 0
    }));

    // Get filter options for frontend from shared service
    const filterOptions = await productService.getSectionFilterOptions(sectionFilter);

    res.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalProducts: pagination.totalProducts,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          limit: parseInt(limit, 10)
        },
        filters: filterOptions
      }
    });

  } catch (error) {
    console.error('Get men\'s products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching men\'s products'
    });
  }
};

// @desc    Get single men's product by ID
// @route   GET /api/products/:id
// @access  Public
const getMensProductById = async (req, res) => {
  try {
    // Allow both men and women sections
    const product = await Product.findOne({
      _id: req.params.id,
      section: { $in: ['men', 'women'] },
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Men\'s product not found'
      });
    }

    // Get related products from same category and section
    const relatedProducts = await Product.find({
      category: product.category,
      section: product.section, // Use the same section as the product
      _id: { $ne: product._id },
      isActive: true
    })
      .select('name price originalPrice discountPercentage images rating')
      .limit(4)
      .lean();

    const formattedRelated = relatedProducts.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercentage: p.discountPercentage,
      primaryImage: p.images.find(img => img.isPrimary)?.url || p.images[0]?.url || '',
      rating: p.rating
    }));

    res.json({
      success: true,
      data: {
        product,
        relatedProducts: formattedRelated
      }
    });

  } catch (error) {
    console.error('Get men\'s product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// Helper function to get filter options
const getFilterOptions = async (section = 'men') => {
  try {
    const sectionFilter = section.toLowerCase(); // Ensure lowercase
    const [categories, priceRange, sizes, colors] = await Promise.all([
      // Get available categories
      Product.distinct('category', { section: sectionFilter, isActive: true }),

      // Get price range
      Product.aggregate([
        { $match: { section: sectionFilter, isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]),

      // Get available sizes
      Product.aggregate([
        { $match: { section: sectionFilter, isActive: true } },
        { $unwind: '$sizes' },
        { $group: { _id: '$sizes.size' } },
        { $sort: { _id: 1 } }
      ]),

      // Get available colors
      Product.aggregate([
        { $match: { section: sectionFilter, isActive: true } },
        { $unwind: '$colors' },
        { $group: { _id: { name: '$colors.name', hex: '$colors.hex' } } },
        { $sort: { '_id.name': 1 } }
      ])
    ]);

    return {
      categories: categories.sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
      sizes: sizes.map(s => s._id),
      colors: colors.map(c => ({ name: c._id.name, hex: c._id.hex }))
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {
      categories: [],
      priceRange: { minPrice: 0, maxPrice: 1000 },
      sizes: [],
      colors: []
    };
  }
};

module.exports = {
  createMensProduct,
  getMensProducts,
  getMensProductById
};