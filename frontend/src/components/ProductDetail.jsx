import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Heart, Share2, ChevronDown, ChevronUp, Shield, Truck } from 'lucide-react';
import ProductReviews from './ProductReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [expandedSection, setExpandedSection] = useState('description');

  useEffect(() => {
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

      const response = await fetch(`/api/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) setError('Product not found');
        else if (response.status === 400) setError('Invalid product ID');
        else setError(data.message || 'Failed to load product');
        return;
      }

      if (data.success && data.product) {
        const productData = data.product;
        setProduct(productData);

        if (productData.sizes?.length > 0) {
          const firstAvailableSize = productData.sizes.find(s => {
            const stock = typeof s === 'object' ? s.stock : 0;
            return stock > 0;
          }) || productData.sizes[0];
          const sizeValue = typeof firstAvailableSize === 'string' ? firstAvailableSize : firstAvailableSize.size;
          setSelectedSize(sizeValue);
        }

        if (productData.colors?.length > 0) {
          const firstColor = productData.colors[0];
          const colorValue = typeof firstColor === 'string' ? firstColor : firstColor.name;
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <button onClick={() => navigate(-1)} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop'];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to={`/${product.section || 'products'}`} className="hover:text-blue-600">
              {product.section ? product.section.charAt(0).toUpperCase() + product.section.slice(1) : 'Products'}
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Flipkart Style: 2 Column on Desktop, Stacked on Mobile */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
        <div className="lg:flex lg:gap-6">

          {/* LEFT: Image Gallery (40% on desktop) */}
          <div className="lg:w-[40%] mb-4 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm p-4 lg:sticky lg:top-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop';
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Action Buttons - Desktop Only */}
              <div className="hidden lg:flex gap-3 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-semibold">WISHLIST</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">SHARE</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details (60% on desktop) */}
          <div className="lg:w-[60%] space-y-4">

            {/* Product Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
              {/* Badges */}
              {(product.isNewArrival || product.isBestSeller) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.isBestSeller && (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">BESTSELLER</span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">NEW ARRIVAL</span>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-600 mb-3">Brand: <span className="text-blue-600 font-medium">{product.brand}</span></p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white rounded text-sm font-semibold">
                  <span>{product.rating?.average || 4.5}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating?.count || 0} ratings
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="text-lg font-semibold text-green-600">{discount}% off</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-600">+ ₹50 Delivery Charges</p>
              </div>

              {/* Offers */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Available Offers</p>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Bank Offer: 10% instant discount on HDFC Bank Cards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Special Price: Get extra 5% off</span>
                  </li>
                </ul>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Color</h3>
                    <span className="text-sm text-gray-600 capitalize">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => {
                      const colorName = typeof color === 'string' ? color : color.name;
                      const colorHex = typeof color === 'string' ? '#000000' : color.hex || '#000000';
                      const isSelected = selectedColor === colorName;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(colorName)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${isSelected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          style={{ backgroundColor: colorHex }}
                          title={colorName}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Size</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                          className={`min-w-[60px] px-4 py-3 text-sm font-semibold border-2 rounded-lg transition-all ${isOutOfStock
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                              : isSelected
                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                : 'border-gray-300 hover:border-blue-600'
                            }`}
                        >
                          {sizeValue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Desktop Buttons */}
              <div className="hidden lg:flex gap-3 pt-4">
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-lg transition-colors shadow-sm">
                  ADD TO CART
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors shadow-sm">
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Delivery Check */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery</h3>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={6}
                  />
                </div>
                <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Check
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span>Delivery by <span className="font-semibold">Tomorrow</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span>7 days replacement policy</span>
                </div>
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Description */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'description' ? '' : 'description')}
                  className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">Product Description</span>
                  {expandedSection === 'description' ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {expandedSection === 'description' && (
                  <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.description || 'Premium quality product designed for comfort and style.'}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'specifications' ? '' : 'specifications')}
                  className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">Specifications</span>
                  {expandedSection === 'specifications' ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {expandedSection === 'specifications' && (
                  <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {product.material && (
                        <>
                          <span className="text-gray-600">Material:</span>
                          <span className="text-gray-900 font-medium">{product.material}</span>
                        </>
                      )}
                      {product.fit && (
                        <>
                          <span className="text-gray-600">Fit:</span>
                          <span className="text-gray-900 font-medium">{product.fit}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <ProductReviews productId={product._id} productName={product.name} />
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <div className="flex gap-3">
          <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-lg transition-colors">
            ADD TO CART
          </button>
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg transition-colors">
            BUY NOW
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default ProductDetail;
