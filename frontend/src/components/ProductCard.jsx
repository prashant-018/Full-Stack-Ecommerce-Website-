import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Prefer slug for SEO-friendly URLs, fall back to MongoDB ObjectId
  const productSlug = product.slug;
  const productId = product._id || product.id;
  const productKey = productSlug || productId;

  if (!productKey) {
    console.error('ProductCard: Missing product identifier', {
      productId,
      productSlug,
      productName: product.name
    });
    return null;
  }

  // Get primary image with proper fallback
  const getProductImage = () => {
    // Try primary image first
    const primaryImg = product.images?.find(img => img.isPrimary);
    if (primaryImg?.url) return primaryImg.url;

    // Try first image
    if (product.images?.[0]) {
      return typeof product.images[0] === 'string'
        ? product.images[0]
        : product.images[0].url;
    }

    // Fallback to product.image property
    if (product.image) return product.image;

    // Default placeholder
    return 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';
  };

  const imageUrl = getProductImage();

  // Calculate discount percentage safely
  const discountPercentage = product.originalPrice && product.price &&
    product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link
      to={`/product/${productKey}`}
      className="group cursor-pointer block"
      data-product-id={productId} // For debugging
      data-product-slug={productSlug} // For debugging
      data-product-section={product.section} // For debugging
    >
      {/* Product Image */}
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 sm:mb-4 relative rounded-sm">
        {discountPercentage > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium z-10 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        {product.isNewArrival && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 py-1 text-xs font-medium z-10 rounded">
            NEW
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.name || 'Product Image'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';
          }}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-1.5">
        <h3 className="text-sm font-medium text-black group-hover:text-gray-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <span className="text-sm font-medium text-red-500">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-black">
              {formatPrice(product.price || product.originalPrice || 0)}
            </span>
          )}
        </div>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 4).map((color, index) => {
              const colorName = typeof color === 'string' ? color : color.name;
              const colorHex = typeof color === 'string' ? '#000000' : color.hex || '#000000';

              return (
                <div
                  key={`${productId}-color-${index}-${colorName}`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border ${colorName?.toLowerCase() === 'white' ? 'border-gray-400' : 'border-gray-300'
                    }`}
                  style={{ backgroundColor: colorHex }}
                  title={colorName}
                />
              );
            })}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Size Options */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="text-xs text-gray-500">
            {product.sizes.slice(0, 4).map(size =>
              typeof size === 'string' ? size : size.size || size.name
            ).join(' • ')}
            {product.sizes.length > 4 && ' • +more'}
          </div>
        )}

        {/* Category/Brand */}
        {product.brand && (
          <div className="text-xs text-gray-400">
            {product.brand}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;