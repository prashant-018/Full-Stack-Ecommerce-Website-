import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsBySection } from '../services/api';
import { useFilteredProducts, filterProductsBySection } from '../utils/productFilters';
import ProductCard from './ProductCard';

const Men = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    color: [],
    size: []
  });

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetchProductsBySection('men', {
          page: 1,
          limit: 100 // Get more products to ensure we have enough men's products
        });

        // Extract products from the API response structure
        const apiProducts =
          response?.data?.products ||
          response?.products ||
          (Array.isArray(response) ? response : []);

        const normalized = apiProducts.map((p) => {
          // Get primary image or first available image
          const primaryImg = p.images?.find(img => img.isPrimary);
          const imageUrl = primaryImg?.url ||
            p.images?.[0]?.url ||
            (typeof p.images?.[0] === 'string' ? p.images[0] : null) ||
            p.image ||
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center';

          return {
            id: p._id || p.id,
            name: p.name,
            price: p.originalPrice || p.price || 0,
            salePrice: p.price < p.originalPrice ? p.price : null,
            colors: (p.colors || []).map((c) =>
              typeof c === 'string' ? c : (c.value || c.name || '').toLowerCase()
            ),
            image: imageUrl,
            isNew: p.isNew || p.isNewArrival || false,
            sizes: (p.sizes || []).map((s) =>
              typeof s === 'string' ? s : s.name || s.size || ''
            ),
            category: p.category,
            section: p.section, // Ensure section is included for filtering
            discountPercentage: p.discountPercentage || 0
          };
        });

        // Apply strict filtering to ensure only men's products are shown
        const menProducts = filterProductsBySection(normalized, 'men');

        if (isMounted) {
          setAllProducts(normalized);
          setProducts(menProducts);
          console.log(`Loaded ${menProducts.length} men's products out of ${normalized.length} total products`);
        }
      } catch (err) {
        console.error('Failed to load men products', err);
        if (isMounted) {
          setError('Failed to load products. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "Men's Sweaters & Cardigans",
    "Men's Shirts & Polos",
    "Men's Pants & Jeans",
    "Men's Blazers & Suits",
    "Men's Outerwear & Jackets",
    "Men's Shoes & Boots",
    "Men's Accessories & Belts",
    "Men's Activewear & Swim",
    "Men's Underwear & Loungewear"
  ];

  const colors = [
    { name: 'White', value: 'white', hex: '#ffffff' },
    { name: 'Cream', value: 'cream', hex: '#f5f5dc' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Navy', value: 'navy', hex: '#1e3a8a' },
    { name: 'Brown', value: 'brown', hex: '#92400e' },
    { name: 'Gray', value: 'gray', hex: '#6b7280' },
    { name: 'Charcoal', value: 'charcoal', hex: '#374151' },
    { name: 'Olive', value: 'olive', hex: '#65a30d' },
    { name: 'Khaki', value: 'khaki', hex: '#c3b091' },
    { name: 'Indigo', value: 'indigo', hex: '#4f46e5' },
    { name: 'Tan', value: 'tan', hex: '#d2b48c' }
  ];

  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const pantSizes = ['28', '30', '32', '34', '36', '38', '40'];
  const shoeSizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  // Apply additional filtering based on selected filters
  const filteredProducts = useFilteredProducts(products, {
    section: 'men',
    categories: selectedFilters.category,
    colors: selectedFilters.color,
    sizes: selectedFilters.size
  });

  const ColorDot = ({ color, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-black' : 'border-gray-300'
        } hover:border-black transition-colors ${color.value === 'white' ? 'border-gray-400' : ''
        }`}
      style={{ backgroundColor: color.hex }}
      title={color.name}
    />
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black cursor-pointer">Home</Link>
          <span>/</span>
          <span className="text-black">Men</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:border-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters & Sort
            {(selectedFilters.category.length + selectedFilters.color.length + selectedFilters.size.length) > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full">
                {selectedFilters.category.length + selectedFilters.color.length + selectedFilters.size.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, shown as overlay when toggled */}
          <div className={`
            fixed lg:static inset-0 z-50 lg:z-auto
            ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}
          `}>
            {/* Mobile Overlay Background */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Filter Sidebar */}
            <div className={`
              fixed lg:static top-0 left-0 h-full lg:h-auto
              w-80 lg:w-64 flex-shrink-0
              bg-white lg:bg-transparent
              overflow-y-auto lg:overflow-visible
              transform lg:transform-none transition-transform duration-300
              ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              {/* Mobile Filter Header */}
              <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 lg:p-0 space-y-6 sm:space-y-8">
                {/* Results Count */}
                <div>
                  <p className="text-sm text-gray-600">
                    {loading
                      ? 'Loading products...'
                      : `${filteredProducts.length || 0} Products`}
                  </p>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{category}</span>
                      </label>
                    ))}
                    <button className="text-sm text-gray-500 hover:text-black transition-colors">
                      Show More ↓
                    </button>
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Color</h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {colors.map((color) => (
                      <div key={color.value} className="flex flex-col items-center">
                        <ColorDot
                          color={color}
                          isSelected={selectedFilters.color.includes(color.value)}
                          onClick={() => {
                            // Handle color selection
                          }}
                        />
                        <span className="text-xs text-gray-600 mt-1">{color.name}</span>
                      </div>
                    ))}
                  </div>
                  <button className="text-sm text-gray-500 hover:text-black mt-3 transition-colors">
                    Show More ↓
                  </button>
                </div>

                {/* Clothing Size Filter */}
                <div>
                  <h3 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Clothing</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {clothingSizes.map((size) => (
                      <button
                        key={size}
                        className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm hover:border-black transition-colors rounded-sm"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pants Size Filter */}
                <div>
                  <h3 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Pants</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {pantSizes.map((size) => (
                      <button
                        key={size}
                        className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm hover:border-black transition-colors rounded-sm"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shoes Size Filter */}
                <div>
                  <h3 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Shoes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {shoeSizes.map((size) => (
                      <button
                        key={size}
                        className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm hover:border-black transition-colors rounded-sm"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Apply Button */}
                <div className="lg:hidden sticky bottom-0 bg-white border-t border-gray-200 pt-4 pb-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full bg-gray-900 text-white py-3 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-medium text-black mb-2">
                Men's Fashion & Clothing - New Arrivals
              </h1>
              <p className="text-sm text-gray-600">
                {loading
                  ? 'Loading...'
                  : `${filteredProducts.length || 0} PRODUCTS`}
              </p>
            </div>

            {/* Product Grid - Responsive: 1 col mobile, 2 col sm, 3 col lg, 4 col xl */}
            {error && !loading && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-sm text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-gray-600 mb-2">No products found.</p>
                <p className="text-xs text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Men;