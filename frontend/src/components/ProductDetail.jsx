import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductReviews from './ProductReviews';
import StarRating from './StarRating';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    // Validate ObjectId format before making API call
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      setError('Invalid product ID format');
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching product with ID:', id);

      const response = await fetch(`/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else if (response.status === 400) {
          setError('Invalid product ID');
        } else {
          setError(data.message || 'Failed to load product');
        }
        return;
      }

      if (data.success && data.product) {
        const productData = data.product;
        setProduct(productData);

        // Set default selections with proper validation
        if (productData.sizes?.length > 0) {
          const firstAvailableSize = productData.sizes.find(s => {
            const stock = typeof s === 'object' ? s.stock : 0;
            return stock > 0;
          }) || productData.sizes[0];

          const sizeValue = typeof firstAvailableSize === 'string'
            ? firstAvailableSize
            : firstAvailableSize.size;
          setSelectedSize(sizeValue);
        }

        if (productData.colors?.length > 0) {
          const firstColor = productData.colors[0];
          const colorValue = typeof firstColor === 'string'
            ? firstColor
            : firstColor.name;
          setSelectedColor(colorValue);
        }
      } else {
        setError('Product data not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-black mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error === 'Invalid product ID format'
              ? 'The product link appears to be invalid.'
              : error === 'Product not found'
                ? 'This product may have been removed or is no longer available.'
                : error || 'The product you\'re looking for doesn\'t exist.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-black text-white py-3 px-6 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="block w-full border border-gray-300 text-black py-3 px-6 text-sm font-medium hover:border-black transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get primary image
  const primaryImage = product.images?.find(img => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black cursor-pointer">Home</Link>
          <span>/</span>
          <Link
            to={`/${product.section || 'products'}`}
            className="hover:text-black cursor-pointer"
          >
            {product.section ? product.section.charAt(0).toUpperCase() + product.section.slice(1) : 'Products'}
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';
                }}
              />
            </div>

            {/* Thumbnail images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 overflow-hidden rounded">
                    <img
                      src={typeof image === 'string' ? image : image.url}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-medium text-black mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-600 mb-2">by {product.brand}</p>
              )}
              <div className="flex items-center space-x-4">
                <StarRating
                  rating={product.rating?.average || 0}
                  showCount={true}
                  reviewCount={product.rating?.count || 0}
                />
                {product.sku && (
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-medium text-black">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-medium rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black mb-3">
                  Color: {selectedColor}
                </h3>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color, index) => {
                    const colorName = typeof color === 'string' ? color : color.name;
                    const colorHex = typeof color === 'string' ? '#000000' : color.hex || '#000000';

                    return (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === colorName ? 'border-black' : 'border-gray-300'
                          } hover:border-black transition-colors`}
                        style={{ backgroundColor: colorHex }}
                        onClick={() => setSelectedColor(colorName)}
                        title={colorName}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black mb-3">
                  Size: {selectedSize}
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size, index) => {
                    const sizeValue = typeof size === 'string' ? size : size.size;
                    const sizeStock = typeof size === 'object' ? size.stock : 1;
                    const isOutOfStock = sizeStock === 0;
                    const isSelected = selectedSize === sizeValue;

                    return (
                      <button
                        key={index}
                        onClick={() => !isOutOfStock && setSelectedSize(sizeValue)}
                        disabled={isOutOfStock}
                        className={`py-3 text-sm border transition-colors ${isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isSelected
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 hover:border-black'
                          }`}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-3">
              <button className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors">
                ADD TO CART
              </button>
              <button className="w-full border border-gray-300 text-black py-4 text-sm font-medium hover:border-black transition-colors">
                ADD TO WISHLIST
              </button>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              {product.description && (
                <div>
                  <h4 className="font-medium text-black mb-2">Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.material && (
                  <div>
                    <span className="font-medium text-black">Material:</span>
                    <span className="text-gray-700 ml-2">{product.material}</span>
                  </div>
                )}
                {product.fit && (
                  <div>
                    <span className="font-medium text-black">Fit:</span>
                    <span className="text-gray-700 ml-2">{product.fit}</span>
                  </div>
                )}
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-black mb-2">Features</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.care && product.care.length > 0 && (
                <div>
                  <h4 className="font-medium text-black mb-2">Care Instructions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.care.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-black mr-2">•</span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <ProductReviews
            productId={product._id}
            productName={product.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;