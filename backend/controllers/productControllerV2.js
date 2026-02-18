const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * GET /api/v2/products?section=men|women
 * Public listing endpoint for the new v2 product API.
 * Strictly separates men/women via the section field and
 * returns a frontend-friendly, stable response shape.
 */
const getProductsV2 = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      section,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    if (!section || !['men', 'women'].includes(section.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'section' is required and must be 'men' or 'women'",
      });
    }

    const filter = {
      isActive: true,
      section: section.toLowerCase(),
    };

    if (category && category.trim()) {
      filter.category = { $regex: new RegExp(category.trim(), 'i') };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 0;

    return res.status(200).json({
      success: true,
      data: {
        products: products || [],
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get products v2 error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      data: {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    });
  }
};

/**
 * GET /api/v2/products/slug/:slug
 * Public detail endpoint for v2 using slug.
 * Ensures product is active and returns related products from same section/category.
 */
const getProductBySlugV2 = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product slug is required',
      });
    }

    const product = await Product.findOne({
      slug: slug.trim(),
      isActive: true,
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      section: product.section,
      category: product.category,
    })
      .select('name price originalPrice discountPercentage images rating slug section')
      .limit(4)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    console.error('Get product by slug v2 error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

module.exports = {
  getProductsV2,
  getProductBySlugV2,
};


