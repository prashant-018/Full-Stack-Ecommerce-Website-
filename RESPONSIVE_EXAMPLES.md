# Responsive Layout Examples

## Complete Responsive Component Examples

### 1. Responsive Product Grid

```jsx
import React from 'react';
import ProductCard from './ProductCard';

const ResponsiveProductGrid = ({ products }) => {
  return (
    <div className="w-full">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">
            New Arrivals
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {products.length} Products
          </p>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button className="px-6 sm:px-8 py-2 sm:py-3 bg-black text-white text-sm sm:text-base hover:bg-gray-800 transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveProductGrid;
```

### 2. Responsive Sidebar Layout (Product Listing with Filters)

```jsx
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

const ResponsiveProductListing = ({ products }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Sidebar - Drawer */}
          {mobileFiltersOpen && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
              
              {/* Drawer */}
              <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto lg:hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Filter sections */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
        {/* Filter options */}
      </div>
    </div>
  );
};

export default ResponsiveProductListing;
```

### 3. Responsive Card Component

```jsx
const ResponsiveCard = ({ image, title, description, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image Container with Aspect Ratio */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content with Responsive Padding */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            {price}
          </span>
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white text-xs sm:text-sm rounded hover:bg-gray-800 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 4. Responsive Hero Banner

```jsx
const ResponsiveHeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Summer Collection 2024
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                Discover the latest trends in sustainable fashion
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="px-6 sm:px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors">
                  Shop Women
                </button>
                <button className="px-6 sm:px-8 py-3 bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-colors">
                  Shop Men
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

### 5. Responsive Form Layout

```jsx
const ResponsiveCheckoutForm = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">
        Checkout
      </h2>

      <form className="space-y-6 sm:space-y-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Email - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue to Shipping
          </button>
        </div>
      </form>
    </div>
  );
};
```

### 6. Responsive Image Gallery

```jsx
const ResponsiveImageGallery = ({ images }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="break-inside-avoid group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 7. Responsive Stats Section

```jsx
const ResponsiveStats = () => {
  const stats = [
    { label: 'Products', value: '1,200+' },
    { label: 'Customers', value: '50K+' },
    { label: 'Countries', value: '25+' },
    { label: 'Reviews', value: '4.8/5' }
  ];

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 8. Responsive Navigation Tabs

```jsx
const ResponsiveTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
          className="w-full px-4 py-3 border-0 focus:ring-2 focus:ring-black"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Horizontal Tabs */}
      <div className="hidden sm:flex space-x-8 px-4 sm:px-6 lg:px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Key Takeaways

1. **Always use responsive padding**: `px-4 sm:px-6 lg:px-8`
2. **Scale typography**: `text-2xl sm:text-3xl lg:text-4xl`
3. **Responsive grids**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
4. **Mobile-first approach**: Start with mobile, add larger breakpoints
5. **Touch-friendly**: Minimum 44x44px touch targets on mobile
6. **Flexible images**: Use `w-full h-auto` or aspect ratio containers
7. **Hide/show strategically**: Use `hidden md:block` and `block md:hidden`
8. **Test on real devices**: Emulators don't catch everything
