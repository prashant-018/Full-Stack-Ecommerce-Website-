const Product = require('../models/Product');

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

    // Build base filter
    // NOTE: Many older/seeded products might not have the `section` field set.
    // To keep backward compatibility we:
    // - Prefer products with correct `section`
    // - Also include products without `section` but with a matching category prefix
    const sectionFilter = section.toLowerCase(); // 'men' or 'women'

    const filter = {
      isActive: true
    };

    // Backward‑compatible section handling
    if (sectionFilter === 'men') {
      filter.$or = [
        { section: 'men' },
        // Fallback: old products without section but men's categories
        { section: { $exists: false }, category: /^Men's/ }
      ];
    } else if (sectionFilter === 'women') {
      filter.$or = [
        { section: 'women' },
        // Fallback: old products without section but women's categories
        { section: { $exists: false }, category: /^Women's/ }
      ];
    } else {
      // If some other section is passed, still enforce isActive only
      // (caller can further filter by category etc.)
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Size filter
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',');
      filter['sizes.size'] = { $in: sizeArray };
    }

    // Color filter
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : colors.split(',');
      filter['colors.name'] = { $in: colorArray };
    }

    // Boolean filters
    if (isNewArrival === 'true') filter.isNewArrival = true;
    if (isFeatured === 'true') filter.isFeatured = true;

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with optimized fields for grid layout
    const products = await Product.find(filter)
      .select('name price originalPrice discountPercentage category images rating isNewArrival brand sku createdAt')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

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
        average: product.rating.average,
        count: product.rating.count
      },
      isNewArrival: product.isNewArrival,
      brand: product.brand,
      sku: product.sku,
      hasDiscount: product.discountPercentage > 0
    }));

    // Get filter options for frontend
    const filterOptions = await getFilterOptions(sectionFilter);

    res.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          limit: limitNum
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