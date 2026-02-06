const Product = require('../models/Product');

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      gender,
      section,
      minPrice,
      maxPrice,
      sizes,
      colors,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isNew,
      isFeatured,
      onSale
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Category filters
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (subcategory) {
      filter.subcategory = { $regex: subcategory, $options: 'i' };
    }

    if (gender) {
      filter.gender = gender;
    }

    // Men / Women section filter
    if (section) {
      filter.section = section;
    }

    // Price filters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Size filter
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',');
      filter['sizes.name'] = { $in: sizeArray };
    }

    // Color filter
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : colors.split(',');
      filter['colors.name'] = { $in: colorArray };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    // Boolean filters
    if (isNew === 'true') filter.isNew = true;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (onSale === 'true') filter.salePrice = { $exists: true, $ne: null };

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Calculate price range for filters
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        filters: {
          priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 }
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .select('name price images originalPrice')
      .lean();

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      section,
      images,
      colors,
      sizes,
      material,
      care,
      features,
      sku,
      isNewArrival,
      isFeatured
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category'
      });
    }

    // Validate required fields
    if (!sku) {
      return res.status(400).json({
        success: false,
        message: 'SKU is required'
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      category,
      section,
      images,
      colors,
      sizes,
      material,
      care,
      features,
      sku,
      isNewArrival,
      isFeatured
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Create product error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key errors
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

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    // Recalculate stock if sizes updated
    if (req.body.sizes) {
      product.stock = req.body.sizes.reduce((total, size) => total + (size.stock || 0), 0);
    }

    await product.save();
    await product.populate('category', 'name');

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
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete - set isActive to false
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
};

// @desc    Get product analytics
// @route   GET /api/products/analytics
// @access  Private/Admin
const getProductAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' },
          lowStockProducts: {
            $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryInfo' } },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: analytics[0] || {},
        categoryStats
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const {
      q: query,
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sortBy = 'relevance'
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search filter
    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { subcategory: { $regex: query, $options: 'i' } },
        { features: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    // Additional filters
    if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: 'i' }
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
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
      case 'rating':
        sortOptions = { averageRating: -1 };
        break;
      default:
        // Relevance - prioritize name matches over description matches
        sortOptions = { score: { $meta: 'textScore' } };
        filter.$text = { $search: query };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

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
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .populate('category', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

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
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isNew: true
    })
      .populate('category', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

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
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductAnalytics,
  searchProducts,
  getFeaturedProducts,
  getNewArrivals
};