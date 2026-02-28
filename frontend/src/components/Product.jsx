import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { convertAndFormatPrice } from '../utils/currency';
import api, { fetchProductReviews, addProductReview, deleteProductReview } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Product = ({ onAddToCart }) => {
  // This param can be either a slug or a MongoDB ObjectId
  const { id: slugOrId } = useParams();
  const { user, isAdmin } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    sizeFit: 'True to Size',
  });

  // Use ref to prevent multiple API calls
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple calls in React StrictMode
    if (hasFetched.current || !slugOrId) return;

    const fetchProduct = async () => {
      try {
        hasFetched.current = true;
        setLoading(true);
        setError('');

        console.log('Fetching product with identifier:', slugOrId);

        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
        let productData = null;

        // 1) Try slug-based endpoint first (works for both slug and ID-looking slugs)
        try {
          const slugResponse = await api.get(`/products/slug/${slugOrId}`);
          console.log('Slug API Response:', slugResponse.data);

          if (slugResponse.data?.success && slugResponse.data.product) {
            productData = slugResponse.data.product;
          }
        } catch (slugError) {
          console.warn('Slug fetch failed, will consider ID fallback if applicable:', slugError);
        }

        // 2) If slug lookup failed and this looks like an ObjectId, try ID endpoint
        if (!productData && isObjectId) {
          const idResponse = await api.get(`/products/${slugOrId}`);
          console.log('ID API Response:', idResponse.data);

          if (!idResponse.data.success) {
            setError(idResponse.data.message || 'Product not found');
            setLoading(false);
            return;
          }

          // Support both { success, product } and { success, data: { product } } shapes
          productData =
            idResponse.data.product ||
            idResponse.data.data?.product ||
            idResponse.data.data ||
            null;
        }

        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        console.log('Product data:', productData);
        setProduct(productData);

        // Set default selections - choose first available size with stock
        if (productData.sizes && productData.sizes.length > 0) {
          // Find first size with stock > 0, or just first size
          const firstAvailableSize = productData.sizes.find(s => {
            if (typeof s === 'string') return true;
            return (s.stock || 0) > 0;
          }) || productData.sizes[0];
          
          const sizeValue = typeof firstAvailableSize === 'string'
            ? firstAvailableSize
            : firstAvailableSize.size || firstAvailableSize.name || firstAvailableSize;
          setSelectedSize(String(sizeValue));
        } else {
          // If no sizes, set default to 'One Size'
          setSelectedSize('One Size');
        }

        if (productData.colors && productData.colors.length > 0) {
          const firstColor = productData.colors[0];
          const colorValue = typeof firstColor === 'string'
            ? firstColor
            : firstColor.name || firstColor;
          setSelectedColor(colorValue);
        }

        // Fetch recommended products (don't fail if this fails)
        try {
          const recommendedResponse = await api.get('/products', {
            params: {
              limit: 4,
              section: productData.section,
              category: productData.category
            }
          });

          const recommendedData = recommendedResponse.data.success
            ? (recommendedResponse.data.data?.products || recommendedResponse.data.data || [])
            : (recommendedResponse.data.data?.products || recommendedResponse.data.products || []);

          setRecommendedProducts(
            (recommendedData || []).filter(p => (p._id || p.id) !== (productData._id || productData.id)).slice(0, 4)
          );
        } catch (recError) {
          console.error('Error fetching recommended products:', recError);
          // Don't fail the whole page if recommended products fail
        }

      } catch (err) {
        console.error('Error fetching product:', err);

        if (err.response?.status === 404) {
          setError('Product not found');
        } else if (err.response?.status === 400) {
          setError('Invalid product ID');
        } else if (err.response?.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to load product. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Cleanup function to reset hasFetched when component unmounts or id changes
    return () => {
      hasFetched.current = false;
    };
  }, [slugOrId]);

  // Load reviews once product is loaded
  useEffect(() => {
    if (!product?._id) return;

    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewError('');
        const data = await fetchProductReviews(product._id, {
          page: 1,
          limit: 10,
          sortBy: 'newest',
        });
        if (data.success) {
          setReviews(data.reviews || []);
          setReviewStats({
            ratingStats: data.ratingStats,
            sizeFitStats: data.sizeFitStats,
            totalReviews: data.pagination?.totalReviews || 0,
          });
        } else {
          setReviewError(data.message || 'Failed to load reviews');
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
        setReviewError('Failed to load reviews. Please try again.');
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [product?._id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product?._id) return;

    try {
      setReviewsLoading(true);
      setReviewError('');
      const payload = {
        productId: product._id,
        rating: Number(newReview.rating),
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        sizeFit: newReview.sizeFit,
      };
      const res = await addProductReview(payload);
      if (res.success) {
        // Optimistically prepend new review
        setReviews((prev) => [res.review, ...prev]);
        // Refresh stats from server
        const statsData = await fetchProductReviews(product._id, {
          page: 1,
          limit: 10,
          sortBy: 'newest',
        });
        if (statsData.success) {
          setReviews(statsData.reviews || []);
          setReviewStats({
            ratingStats: statsData.ratingStats,
            sizeFitStats: statsData.sizeFitStats,
            totalReviews: statsData.pagination?.totalReviews || 0,
          });
        }
        setNewReview({
          rating: 5,
          title: '',
          comment: '',
          sizeFit: 'True to Size',
        });
      } else {
        setReviewError(res.message || 'Failed to add review');
      }
    } catch (err) {
      console.error('Error adding review:', err);
      const message =
        err.response?.data?.message ||
        (err.response?.status === 400
          ? 'You may have already reviewed this product.'
          : 'Failed to add review. Please try again.');
      setReviewError(message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!product?._id || !reviewId) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    try {
      setReviewsLoading(true);
      setReviewError('');
      const res = await deleteProductReview(reviewId);
      if (res.success) {
        // Refresh reviews and stats after delete
        const data = await fetchProductReviews(product._id, {
          page: 1,
          limit: 10,
          sortBy: 'newest',
        });
        if (data.success) {
          setReviews(data.reviews || []);
          setReviewStats({
            ratingStats: data.ratingStats,
            sizeFitStats: data.sizeFitStats,
            totalReviews: data.pagination?.totalReviews || 0,
          });
        }
      } else {
        setReviewError(res.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      const message =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? 'You are not allowed to delete this review.'
          : 'Failed to delete review. Please try again.');
      setReviewError(message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const canDeleteReview = (review) => {
    if (!user) return false;
    if (isAdmin && typeof isAdmin === 'function' && isAdmin()) return true;

    const reviewUserId =
      review.userId?._id || review.userId?.id || review.userId || review.userId?._id?.toString();

    if (!reviewUserId || !user._id) return false;

    return String(reviewUserId) === String(user._id);
  };

  const handleAddToCart = () => {
    // Validate size selection
    if (availableSizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    // Validate selected size exists and has stock
    if (availableSizes.length > 0 && selectedSize) {
      const selectedSizeObj = availableSizes.find(s => s.size === selectedSize);
      
      if (!selectedSizeObj) {
        alert('Selected size is not available');
        return;
      }

      if (!selectedSizeObj.isAvailable || selectedSizeObj.stock <= 0) {
        alert(`Size ${selectedSize} is out of stock`);
        return;
      }
    }

    // If no sizes in product, use a default
    const sizeToUse = selectedSize || (availableSizes.length > 0 ? availableSizes[0].size : 'One Size');
    const colorToUse = selectedColor || (product.colors?.[0]?.name || product.colors?.[0] || 'Default');

    onAddToCart({
      ...product,
      selectedSize: sizeToUse,
      selectedColor: colorToUse
    });
  };

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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link to="/" className="text-black underline hover:text-gray-600">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get primary image or first image
  const primaryImage = product.images?.find(img => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';

  // Prepare images array for display
  const displayImages = product.images?.length > 0
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : [primaryImage, primaryImage, primaryImage, primaryImage, primaryImage, primaryImage];

  // Ensure we have 6 images for the grid
  while (displayImages.length < 6) {
    displayImages.push(displayImages[0]);
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discountPercentage || 0;

  // Get available sizes with stock information
  const availableSizes = product.sizes?.map(sizeObj => {
    if (typeof sizeObj === 'string') {
      return { size: sizeObj, stock: 0, isAvailable: true };
    }
    const size = sizeObj.size || sizeObj.name || sizeObj;
    const stock = sizeObj.stock || 0;
    return {
      size: size,
      stock: stock,
      isAvailable: stock > 0
    };
  }).filter(Boolean) || [];

  // Extract just size strings for display
  const sizeStrings = availableSizes.map(s => s.size);

  // Get available colors
  const availableColors = product.colors?.map(color => ({
    name: typeof color === 'string' ? color : color.name,
    hex: typeof color === 'string' ? '#000000' : color.hex || '#000000',
    value: typeof color === 'string' ? color.toLowerCase() : color.name?.toLowerCase() || 'default'
  })) || [{ name: 'Default', hex: '#000000', value: 'default' }];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black cursor-pointer">Home</Link>
          <span>/</span>
          <Link to={`/${product.section || 'products'}`} className="hover:text-black cursor-pointer">
            {product.section ? product.section.charAt(0).toUpperCase() + product.section.slice(1) : 'Products'}
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Side - Image Grid (2x3) */}
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="grid grid-cols-2 gap-2">
              {displayImages.slice(0, 6).map((image, index) => (
                <div key={`image-${index}-${image}`} className="relative bg-gray-50">
                  {/* Sale badge on first image */}
                  {index === 0 && discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium z-10">
                      {discountPercentage}% OFF
                    </div>
                  )}
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="w-full lg:w-72 lg:flex-shrink-0 lg:pl-4">
            {/* Best Seller Badge */}
            <div className="text-xs text-gray-500 mb-1 tracking-wide">
              {product.isFeatured ? 'BEST SELLER • ' : ''}
              {product.isNewArrival ? 'NEW ARRIVAL' : 'FINAL SALE'}
            </div>

            {/* Product Title */}
            <h1 className="text-xl font-normal text-black mb-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex text-sm text-black mr-2">
                {'★'.repeat(Math.floor(product.rating?.average || 4.5))}
                {'☆'.repeat(5 - Math.floor(product.rating?.average || 4.5))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating?.count || 0} Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2 mb-6">
              {product.originalPrice && product.originalPrice !== product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {convertAndFormatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-2xl font-normal text-black">
                {convertAndFormatPrice(product.price || product.originalPrice || 0)}
              </span>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-black">Color</span>
                  <span className="text-sm text-gray-500">{selectedColor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {availableColors.map((color, index) => (
                    <button
                      key={`color-${color.value || color.name || index}`}
                      className={`w-6 h-6 rounded-full border-2 ${selectedColor === color.name ? 'border-black' : 'border-gray-300'
                        } hover:border-black transition-colors`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-black">Size</span>
                  <button className="text-sm text-gray-500 underline hover:text-black">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1">
                  {availableSizes.map((sizeObj) => {
                    const size = sizeObj.size;
                    const isOutOfStock = !sizeObj.isAvailable || sizeObj.stock <= 0;
                    const isSelected = selectedSize === size;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(size);
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`py-2 text-sm border transition-colors ${
                          isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                        title={isOutOfStock ? 'Out of stock' : `${sizeObj.stock} available`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 text-sm font-medium mb-6 hover:bg-gray-800 transition-colors"
            >
              ADD TO BAG
            </button>

            {/* Shipping & Services Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">Free Shipping</div>
                  <div className="text-xs text-gray-500">On all orders over ₹8,300 <span className="underline cursor-pointer">Learn More</span></div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">Easy Returns</div>
                  <div className="text-xs text-gray-500">Free returns through January 31 <span className="underline cursor-pointer">Returns Terms</span></div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 mt-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">Send It As A Gift</div>
                  <div className="text-xs text-gray-500">Add a free personalized note during checkout</div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-black mb-2">
                {product.brand ? `${product.brand} - ` : ''}{product.category}
              </h3>
              <div className="text-xs text-gray-700 leading-relaxed">
                <p className="mb-2">
                  {product.description || 'Premium quality product crafted with attention to detail and comfort.'}
                </p>
                {product.material && (
                  <p className="mb-2">
                    <span className="font-medium">Material:</span> {product.material}
                  </p>
                )}
                {product.features && product.features.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium">Features:</span>
                    <ul className="list-disc list-inside ml-2">
                      {product.features.map((feature, index) => (
                        <li key={`feature-${index}-${feature}`}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.care && product.care.length > 0 && (
                  <div>
                    <span className="font-medium">Care Instructions:</span>
                    <ul className="list-disc list-inside ml-2">
                      {product.care.map((instruction, index) => (
                        <li key={`care-${index}-${instruction}`}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Model & Fit Info */}
            <div className="space-y-2 mb-6 text-xs">
              <div className="flex">
                <span className="font-medium text-black w-12 flex-shrink-0">Model</span>
                <span className="text-gray-600">Model is 6'2", wearing a size M</span>
              </div>
              <div className="flex">
                <span className="font-medium text-black w-12 flex-shrink-0">Fit</span>
                <div className="text-gray-600">
                  Questions about fit?
                  <span className="underline cursor-pointer hover:text-black ml-1">Contact Us</span>
                  <span className="underline cursor-pointer hover:text-black ml-2">Size Guide</span>
                </div>
              </div>
            </div>

            {/* Sustainability */}
            <div>
              <div className="text-sm font-medium text-black mb-3">Sustainability</div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">RECYCLED MATERIALS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">CLEANER CHEMISTRY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-medium text-black mb-6">Recommended Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recProduct) => (
                <Link
                      key={recProduct._id || recProduct.id || recProduct.slug || `rec-${recProduct.name}`}
                      to={`/product/${recProduct.slug || recProduct._id || recProduct.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-3">
                    <img
                      src={recProduct.images?.[0]?.url || recProduct.images?.[0] || primaryImage}
                      alt={recProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = primaryImage;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black mb-1">{recProduct.name}</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      {recProduct.originalPrice && recProduct.originalPrice !== recProduct.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {convertAndFormatPrice(recProduct.originalPrice)}
                        </span>
                      )}
                      <span className="text-sm font-medium text-black">
                        {convertAndFormatPrice(recProduct.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {recProduct.colors?.[0]?.name || recProduct.colors?.[0] || 'Available in multiple colors'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16 pt-8">
          <h2 className="text-2xl font-medium text-center text-gray-700 mb-8">
            Reviews {reviewStats?.totalReviews ? `(${reviewStats.totalReviews})` : ''}
          </h2>

          {/* Reviews Summary Box */}
          <div className="bg-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Overall Rating */}
              <div className="flex-1">
                <div className="text-lg font-medium text-gray-700 mb-2">
                  {reviewStats?.ratingStats
                    ? `${reviewStats.ratingStats.averageRating.toFixed(1)} Overall Rating`
                    : 'No ratings yet'}
                </div>
                <div className="flex items-center text-lg text-black">
                  {'★'.repeat(Math.round(reviewStats?.ratingStats?.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(reviewStats?.ratingStats?.averageRating || 0))}
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 lg:px-8">
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count =
                      reviewStats?.ratingStats?.distribution?.[stars] || 0;
                    const total = reviewStats?.ratingStats?.totalReviews || 0;
                    const percentage = total ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{stars}</span>
                        <span className="text-sm text-gray-600">★</span>
                        <div className="flex-1 bg-gray-300 h-1">
                          <div
                            className="h-1 bg-black"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fit Rating */}
              <div className="flex-1">
                <div className="text-lg font-medium text-gray-700 mb-3">
                  {reviewStats?.sizeFitStats?.recommendation || 'True to Size'}
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Runs small</span>
                    <span>Runs large</span>
                  </div>
                  <div className="w-full bg-gray-300 h-1 relative">
                    <div
                      className="absolute top-0 w-6 h-1 bg-black"
                      style={{
                        left:
                          reviewStats?.sizeFitStats?.recommendation === 'Runs Small'
                            ? '0%'
                            : reviewStats?.sizeFitStats?.recommendation === 'Runs Large'
                            ? 'calc(100% - 1.5rem)'
                            : '50%',
                        transform:
                          reviewStats?.sizeFitStats?.recommendation === 'True to Size'
                            ? 'translateX(-50%)'
                            : 'none',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="mb-10 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Write a review
            </h3>
            {reviewError && (
              <p className="text-sm text-red-600 mb-3">{reviewError}</p>
            )}
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={newReview.rating}
                    onChange={handleReviewChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} - {r === 5 ? 'Excellent' : r === 4 ? 'Good' : r === 3 ? 'Average' : r === 2 ? 'Poor' : 'Terrible'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fit
                  </label>
                  <select
                    name="sizeFit"
                    value={newReview.sizeFit}
                    onChange={handleReviewChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Runs Small">Runs Small</option>
                    <option value="True to Size">True to Size</option>
                    <option value="Runs Large">Runs Large</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newReview.title}
                  onChange={handleReviewChange}
                  placeholder="Summarize your experience"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  placeholder="What did you like or dislike? How does it fit?"
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-y"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={reviewsLoading}
                  className={`px-5 py-2 text-sm font-medium rounded ${
                    reviewsLoading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {reviewsLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>

          {/* Individual Reviews */}
          {reviewsLoading && reviews.length === 0 ? (
            <p className="text-center text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500">
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            <div className="space-y-8">
              {reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className={index === 0 ? '' : 'pt-6 border-t border-gray-200'}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column - User Info */}
                    <div className="w-full md:w-48 md:pr-6 mb-4 md:mb-0">
                      <div className="text-lg font-medium text-black mb-1 flex items-center justify-between">
                        <span>
                          {review.userId?.name ||
                            `${review.userId?.firstName || ''} ${review.userId?.lastName || ''}`.trim() ||
                            review.userName ||
                            'Anonymous'}
                        </span>
                        {canDeleteReview(review) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review._id)}
                            className="ml-3 text-xs text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {review.verifiedBuyer && (
                          <>
                            <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                              <svg
                                className="w-2 h-2 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600">Verified Buyer</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review.timeAgo || ''}
                      </div>
                    </div>

                    {/* Right Column - Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-lg text-black">
                          {'★'.repeat(review.rating || 0)}
                          {'☆'.repeat(5 - (review.rating || 0))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.sizeFit || ''}
                        </div>
                      </div>

                      <h4 className="text-lg font-medium text-black mb-1">
                        {review.title}
                      </h4>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transparent Pricing Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-medium text-gray-700 mb-4">Transparent Pricing</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We publish what it costs us to make every one of our products. There are a lot of costs
              we can't neatly account for - like design, fittings, wear testing, rent on office and retail
              space - but we believe you deserve to know what goes into making the products you love.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-stretch gap-10 lg:gap-16">
            {/* Materials */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.5">
                  <rect x="8" y="12" width="12" height="16" rx="1" />
                  <rect x="12" y="8" width="12" height="16" rx="1" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mb-1">Materials</div>
              <div className="text-lg font-medium text-black">{convertAndFormatPrice(47.96)}</div>
            </div>

            {/* Hardware */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="16" />
                  <circle cx="18" cy="18" r="3" />
                  <circle cx="30" cy="18" r="3" />
                  <circle cx="18" cy="30" r="3" />
                  <circle cx="30" cy="30" r="3" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mb-1">Hardware</div>
              <div className="text-lg font-medium text-black">{convertAndFormatPrice(5.74)}</div>
            </div>

            {/* Labor */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.5">
                  <circle cx="24" cy="12" r="6" />
                  <path d="M12 36v-4c0-4 4-8 12-8s12 4 12 8v4" />
                  <path d="M18 20l6 6 6-6" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mb-1">Labor</div>
              <div className="text-lg font-medium text-black">{convertAndFormatPrice(13.76)}</div>
            </div>

            {/* Duties */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.5">
                  <path d="M8 12h32v24H8z" />
                  <path d="M12 8v8" />
                  <path d="M20 8v8" />
                  <path d="M28 8v8" />
                  <path d="M36 8v8" />
                  <path d="M16 20h16" />
                  <path d="M16 24h12" />
                  <path d="M16 28h8" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mb-1">Duties</div>
              <div className="text-lg font-medium text-black">{convertAndFormatPrice(8.08)}</div>
            </div>

            {/* Transport */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.5">
                  <path d="M8 24l16-8v6h16v4H24v6l-16-8z" />
                  <path d="M32 16l8 4-8 4" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mb-1">Transport</div>
              <div className="text-lg font-medium text-black">{convertAndFormatPrice(1.53)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;