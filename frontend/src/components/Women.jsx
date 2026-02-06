import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsBySection } from '../services/api';
import { useFilteredProducts, filterProductsBySection } from '../utils/productFilters';
import ProductCard from './ProductCard';

const Women = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    color: [],
    size: []
  });

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetchProductsBySection('women', {
          page: 1,
          limit: 100 // Get more products to ensure we have enough women's products
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

        // Apply strict filtering to ensure only women's products are shown
        const womenProducts = filterProductsBySection(normalized, 'women');

        if (isMounted) {
          setAllProducts(normalized);
          setProducts(womenProducts);
          console.log(`Loaded ${womenProducts.length} women's products out of ${normalized.length} total products`);
        }
      } catch (err) {
        console.error('Failed to load women products', err);
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
    "Women's Sweaters & Cardigans",
    "Women's Dresses & Jumpsuits",
    "Women's Tops & Blouses",
    "Women's Pants & Jeans",
    "Women's Skirts & Shorts",
    "Women's Outerwear & Jackets",
    "Women's Shoes & Boots",
    "Women's Bags & Accessories",
    "Women's Underwear & Loungewear"
  ];

  const colors = [
    { name: 'White', value: 'white', hex: '#ffffff' },
    { name: 'Cream', value: 'cream', hex: '#f5f5dc' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Navy', value: 'navy', hex: '#1e3a8a' },
    { name: 'Brown', value: 'brown', hex: '#92400e' },
    { name: 'Gray', value: 'gray', hex: '#6b7280' },
    { name: 'Olive', value: 'olive', hex: '#65a30d' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
    { name: 'Indigo', value: 'indigo', hex: '#4f46e5' }
  ];

  const clothingSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const pantSizes = ['00', '0', '2', '4', '6', '8', '10', '12', '14', '16'];
  const jeanSizes = ['24', '25', '26', '27', '28', '29', '30', '31', '32'];

  // Apply additional filtering based on selected filters
  const filteredProducts = useFilteredProducts(products, {
    section: 'women',
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
      <div className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black cursor-pointer">Home</Link>
          <span>/</span>
          <span className="text-black">Women</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-8">
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
                <h3 className="font-medium text-black mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                  <button className="text-sm text-gray-500 hover:text-black">
                    Show More ↓
                  </button>
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h3 className="font-medium text-black mb-4">Color</h3>
                <div className="grid grid-cols-3 gap-3">
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
                <button className="text-sm text-gray-500 hover:text-black mt-3">
                  Show More ↓
                </button>
              </div>

              {/* Clothing Size Filter */}
              <div>
                <h3 className="font-medium text-black mb-4">Clothing</h3>
                <div className="grid grid-cols-4 gap-2">
                  {clothingSizes.map((size) => (
                    <button
                      key={size}
                      className="border border-gray-300 px-3 py-2 text-sm hover:border-black transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pants Size Filter */}
              <div>
                <h3 className="font-medium text-black mb-4">Pants</h3>
                <div className="grid grid-cols-4 gap-2">
                  {pantSizes.map((size) => (
                    <button
                      key={size}
                      className="border border-gray-300 px-3 py-2 text-sm hover:border-black transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jeans Size Filter */}
              <div>
                <h3 className="font-medium text-black mb-4">Jeans</h3>
                <div className="grid grid-cols-4 gap-2">
                  {jeanSizes.map((size) => (
                    <button
                      key={size}
                      className="border border-gray-300 px-3 py-2 text-sm hover:border-black transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-black mb-2">
                Women's Fashion & Clothing - New Arrivals
              </h1>
              <p className="text-sm text-gray-600">
                {loading
                  ? 'Loading...'
                  : `${filteredProducts.length || 0} PRODUCTS`}
              </p>
            </div>

            {/* Product Grid */}
            {error && !loading && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}
            {loading ? (
              <p className="text-sm text-gray-600">Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-sm text-gray-600">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default Women;