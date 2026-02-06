import React, { useState } from 'react';

const ProductListing = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    color: true,
    size: true
  });

  // Sample product data matching the reference exactly
  const products = [
    {
      id: 1,
      name: "The Cloud Relaxed Cardigan",
      price: 132,
      originalPrice: 189,
      discount: "30% off",
      color: "Black",
      colors: ["Black", "Brown", "Tan", "Navy"],
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
      category: "Hoodies & Sweatshirts",
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "The Organic Cotton Long-Sleeve Turtleneck",
      price: 35,
      originalPrice: 50,
      discount: "30% off",
      color: "Black",
      colors: ["Black", "Grey", "Brown"],
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
      category: "Dress Shirts & Button Downs",
      badge: "ORGANIC COTTON",
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "The Wool Flannel Pant",
      price: 97,
      originalPrice: 139,
      discount: "30% off",
      color: "Heather Charcoal",
      colors: ["Heather Charcoal", "Black"],
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
      category: "Pants",
      badges: ["RENEWED MATERIALS", "CLEANER CHEMISTRY"],
      sizes: ["28", "30", "32", "34", "36", "38"]
    },
    {
      id: 4,
      name: "The Straight Jean",
      price: 68,
      originalPrice: 98,
      discount: "30% off",
      color: "Black",
      colors: ["Black", "Blue", "Grey"],
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
      category: "Jeans",
      sizes: ["28", "30", "32", "34", "36", "38"]
    },
    {
      id: 5,
      name: "The Organic Cotton Hoodie",
      price: 78,
      originalPrice: 112,
      discount: "30% off",
      color: "Olive",
      colors: ["Olive", "Black", "Grey"],
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
      category: "Hoodies & Sweatshirts",
      badge: "ORGANIC COTTON",
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 6,
      name: "The Flannel Shirt",
      price: 88,
      originalPrice: 126,
      discount: "30% off",
      color: "Forest Check",
      colors: ["Forest Check", "Navy Check", "Grey Check"],
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
      category: "Dress Shirts & Button Downs",
      sizes: ["XS", "S", "M", "L", "XL"]
    }
  ];

  const categories = [
    "Everyone - All Gender Collection",
    "Accessories & Gift Cards",
    "Backpacks, Weekenders & Duffle Bags",
    "Dress Shirts & Button Downs",
    "Hoodies & Sweatshirts",
    "Jeans",
    "Pants"
  ];

  const colors = [
    { name: "Black", color: "#000000" },
    { name: "Blue", color: "#1e40af" },
    { name: "Brown", color: "#8b4513" },
    { name: "Green", color: "#22c55e" },
    { name: "Grey", color: "#6b7280" },
    { name: "Orange", color: "#ea580c" },
    { name: "Pink", color: "#ec4899" },
    { name: "Red", color: "#dc2626" },
    { name: "Tan", color: "#d2b48c" }
  ];

  const waistSizes = ["36", "38", "40", "42", "44", "46", "48", "50"];
  const clothingSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const colorMatch = selectedColors.length === 0 || product.colors.some(color => selectedColors.includes(color));
    const sizeMatch = selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.includes(size));

    return categoryMatch && colorMatch && sizeMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span className="hover:underline cursor-pointer">Home</span>
          <span className="mx-1">/</span>
          <span className="hover:underline cursor-pointer">Men</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-8">
              {/* Product Count */}
              <div className="text-sm font-medium text-gray-900">
                {filteredProducts.length} Products
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-200 pb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-4"
                >
                  Category
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.category && (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category} className="flex items-start text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="mt-0.5 mr-3 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                        />
                        <span className="text-gray-700 leading-5">{category}</span>
                      </label>
                    ))}
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                      View More +
                    </button>
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="border-b border-gray-200 pb-6">
                <button
                  onClick={() => toggleSection('color')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-4"
                >
                  Color
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.color ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.color && (
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {colors.map((colorOption) => (
                        <div key={colorOption.name} className="text-center">
                          <button
                            onClick={() => handleColorChange(colorOption.name)}
                            className={`w-8 h-8 rounded-full border-2 mx-auto mb-2 transition-all ${selectedColors.includes(colorOption.name)
                              ? 'border-gray-900 ring-2 ring-gray-300'
                              : 'border-gray-300 hover:border-gray-400'
                              }`}
                            style={{ backgroundColor: colorOption.color }}
                          />
                          <div className="text-xs text-gray-600">{colorOption.name}</div>
                        </div>
                      ))}
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                      View More +
                    </button>
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200 pb-6">
                <button
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-4"
                >
                  Size
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.size ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.size && (
                  <div className="space-y-6">
                    {/* Waist Sizes */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-3">Waist</div>
                      <div className="grid grid-cols-4 gap-2">
                        {waistSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            className={`py-2 px-3 text-sm border rounded transition-all ${selectedSizes.includes(size)
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clothing Sizes */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-3">Clothing</div>
                      <div className="grid grid-cols-4 gap-2">
                        {clothingSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            className={`py-2 px-3 text-sm border rounded transition-all ${selectedSizes.includes(size)
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Men's Clothing & Apparel - New Arrivals
              </h1>
              <div className="text-sm text-gray-600">Featured</div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {product.discount}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                      <span className="text-sm font-medium text-gray-900">${product.price}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm text-gray-900 font-medium leading-tight">{product.name}</h3>

                    {/* Color */}
                    <p className="text-sm text-gray-600">{product.color}</p>

                    {/* Color Options */}
                    <div className="flex space-x-1 mt-2">
                      {product.colors.slice(0, 4).map((colorName, index) => {
                        const colorObj = colors.find(c => c.name === colorName);
                        return (
                          <div
                            key={`${product.id}-color-${index}`}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: colorObj?.color || '#gray'
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Badges */}
                    {(product.badge || product.badges) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.badge && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-medium">
                            {product.badge}
                          </span>
                        )}
                        {product.badges && product.badges.map((badge, index) => (
                          <span key={`${product.id}-badge-${index}`} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-medium">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;