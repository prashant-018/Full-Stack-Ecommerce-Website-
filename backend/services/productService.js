const Product = require('../models/Product');

/**
 * Core product business logic:
 * - All database operations and filtering for products
 * - No Express req/res handling in this layer
 *
 * Controllers should call these functions and handle HTTP concerns only.
 */

// List products with filters and pagination
async function listProducts(options) {
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
    onSale,
  } = options || {};

  // Build filter object
  const filter = { isActive: true };

  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  if (subcategory) {
    filter.subcategory = { $regex: subcategory, $options: 'i' };
  }

  if (gender) {
    filter.gender = gender;
  }

  // Section-aware handling with backward compatibility for legacy products
  if (section) {
    const sectionValue = String(section).toLowerCase();

    if (sectionValue === 'men') {
      filter.$or = [
        { section: 'men' },
        // Fallback: old products without section but men's categories
        { section: { $exists: false }, category: /^Men's/ },
      ];
    } else if (sectionValue === 'women') {
      filter.$or = [
        { section: 'women' },
        // Fallback: old products without section but women's categories
        { section: { $exists: false }, category: /^Women's/ },
      ];
    } else {
      filter.section = sectionValue;
    }
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (sizes) {
    const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(',');
    filter['sizes.name'] = { $in: sizeArray };
  }

  if (colors) {
    const colorArray = Array.isArray(colors) ? colors : colors.split(',');
    filter['colors.name'] = { $in: colorArray };
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { subcategory: { $regex: search, $options: 'i' } },
    ];
  }

  if (isNew === 'true') filter.isNew = true;
  if (isFeatured === 'true') filter.isFeatured = true;
  if (onSale === 'true') filter.salePrice = { $exists: true, $ne: null };

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limitNum);

  const priceRangeAgg = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  return {
    products,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalProducts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
    filters: {
      priceRange: priceRangeAgg[0] || { minPrice: 0, maxPrice: 1000 },
    },
  };
}

// Get single product and related products
async function getProductWithRelated(productId) {
  const product = await Product.findById(productId).lean();

  if (!product || !product.isActive) {
    return null;
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select('name price images originalPrice')
    .lean();

  return {
    product,
    relatedProducts,
  };
}

// Create product
async function createProduct(data) {
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
    isFeatured,
  } = data || {};

  // Basic validation that mirrors existing controller
  if (!name || !description || !price || !category) {
    const error = new Error(
      'Please provide all required fields: name, description, price, category'
    );
    error.statusCode = 400;
    throw error;
  }

  if (!sku) {
    const error = new Error('SKU is required');
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    const error = new Error('Product with this SKU already exists');
    error.statusCode = 400;
    error.code = 'DUPLICATE_SKU';
    throw error;
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
    isFeatured,
  });

  await product.save();
  return product;
}

// Update product
async function updateProductById(productId, updates) {
  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      product[key] = updates[key];
    }
  });

  if (updates.sizes) {
    product.stock = updates.sizes.reduce(
      (total, size) => total + (size.stock || 0),
      0
    );
  }

  await product.save();
  await product.populate('category', 'name');
  return product;
}

// Soft delete product
async function softDeleteProduct(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  product.isActive = false;
  await product.save();
  return product;
}

// Analytics
async function getProductAnalyticsData() {
  const analytics = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        avgPrice: { $avg: '$price' },
        lowStockProducts: {
          $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] },
        },
      },
    },
  ]);

  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$categoryInfo.name',
        count: { $sum: 1 },
        totalStock: { $sum: '$stock' },
      },
    },
  ]);

  return {
    overview: analytics[0] || {},
    categoryStats,
  };
}

// Search
async function searchProductsData(options) {
  const {
    query,
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
    CategoryModel,
  } = options || {};

  if (!query) {
    const error = new Error('Search query is required');
    error.statusCode = 400;
    throw error;
  }

  const filter = {
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { subcategory: { $regex: query, $options: 'i' } },
      { features: { $in: [new RegExp(query, 'i')] } },
    ],
  };

  if (category && CategoryModel) {
    const categoryDoc = await CategoryModel.findOne({
      name: { $regex: category, $options: 'i' },
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
      sortOptions = { score: { $meta: 'textScore' } };
      filter.$text = { $search: query };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limitNum);

  return {
    products,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalProducts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
}

// Featured
async function getFeaturedProductsData(limit = 8) {
  const products = await Product.find({
    isActive: true,
    isFeatured: true,
  })
    .populate('category', 'name')
    .limit(parseInt(limit, 10))
    .sort({ createdAt: -1 })
    .lean();

  return products;
}

// New arrivals
async function getNewArrivalsData(limit = 8) {
  const products = await Product.find({
    isActive: true,
    isNew: true,
  })
    .populate('category', 'name')
    .limit(parseInt(limit, 10))
    .sort({ createdAt: -1 })
    .lean();

  return products;
}

// Section-based filter options for frontend facets (men/women pages, etc.)
async function getSectionFilterOptions(section = 'men') {
  const sectionFilter = String(section).toLowerCase();

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
          maxPrice: { $max: '$price' },
        },
      },
    ]),

    // Get available sizes
    Product.aggregate([
      { $match: { section: sectionFilter, isActive: true } },
      { $unwind: '$sizes' },
      { $group: { _id: '$sizes.size' } },
      { $sort: { _id: 1 } },
    ]),

    // Get available colors
    Product.aggregate([
      { $match: { section: sectionFilter, isActive: true } },
      { $unwind: '$colors' },
      { $group: { _id: { name: '$colors.name', hex: '$colors.hex' } } },
      { $sort: { '_id.name': 1 } },
    ]),
  ]);

  return {
    categories: categories.sort(),
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
    sizes: sizes.map((s) => s._id),
    colors: colors.map((c) => ({ name: c._id.name, hex: c._id.hex })),
  };
}

module.exports = {
  listProducts,
  getProductWithRelated,
  createProduct,
  updateProductById,
  softDeleteProduct,
  getProductAnalyticsData,
  searchProductsData,
  getFeaturedProductsData,
  getNewArrivalsData,
  getSectionFilterOptions,
};


