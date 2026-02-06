import { useMemo } from 'react';

/**
 * Filter products by section (men/women)
 * @param {Array} products - Array of products
 * @param {string} section - Section to filter by ('men' or 'women')
 * @returns {Array} Filtered products
 */
export const filterProductsBySection = (products, section) => {
  if (!products || !Array.isArray(products)) return [];

  return products.filter(product => {
    // Check both section and category fields for flexibility
    const productSection = product.section?.toLowerCase();
    const productCategory = product.category?.toLowerCase();
    const targetSection = section.toLowerCase();

    // Direct section match
    if (productSection === targetSection) return true;

    // Category-based filtering as fallback
    if (targetSection === 'men') {
      return productCategory?.includes('men') ||
        productCategory?.includes('male') ||
        productSection === 'men';
    }

    if (targetSection === 'women') {
      return productCategory?.includes('women') ||
        productCategory?.includes('female') ||
        productSection === 'women';
    }

    return false;
  });
};

/**
 * Filter products by category
 * @param {Array} products - Array of products
 * @param {Array} categories - Array of categories to filter by
 * @returns {Array} Filtered products
 */
export const filterProductsByCategory = (products, categories) => {
  if (!products || !Array.isArray(products)) return [];
  if (!categories || categories.length === 0) return products;

  return products.filter(product =>
    categories.some(category =>
      product.category?.toLowerCase().includes(category.toLowerCase())
    )
  );
};

/**
 * Filter products by color
 * @param {Array} products - Array of products
 * @param {Array} colors - Array of colors to filter by
 * @returns {Array} Filtered products
 */
export const filterProductsByColor = (products, colors) => {
  if (!products || !Array.isArray(products)) return [];
  if (!colors || colors.length === 0) return products;

  return products.filter(product => {
    if (!product.colors || !Array.isArray(product.colors)) return false;

    return colors.some(color =>
      product.colors.some(productColor =>
        productColor.toLowerCase().includes(color.toLowerCase())
      )
    );
  });
};

/**
 * Filter products by size
 * @param {Array} products - Array of products
 * @param {Array} sizes - Array of sizes to filter by
 * @returns {Array} Filtered products
 */
export const filterProductsBySize = (products, sizes) => {
  if (!products || !Array.isArray(products)) return [];
  if (!sizes || sizes.length === 0) return products;

  return products.filter(product => {
    if (!product.sizes || !Array.isArray(product.sizes)) return false;

    return sizes.some(size =>
      product.sizes.some(productSize =>
        productSize.toLowerCase() === size.toLowerCase()
      )
    );
  });
};

/**
 * Filter products by price range
 * @param {Array} products - Array of products
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Filtered products
 */
export const filterProductsByPriceRange = (products, minPrice, maxPrice) => {
  if (!products || !Array.isArray(products)) return [];

  return products.filter(product => {
    const price = product.salePrice || product.price || 0;
    return price >= (minPrice || 0) && price <= (maxPrice || Infinity);
  });
};

/**
 * Apply multiple filters to products
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter object
 * @param {string} filters.section - Section filter
 * @param {Array} filters.categories - Category filters
 * @param {Array} filters.colors - Color filters
 * @param {Array} filters.sizes - Size filters
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @returns {Array} Filtered products
 */
export const applyProductFilters = (products, filters = {}) => {
  if (!products || !Array.isArray(products)) return [];

  let filteredProducts = [...products];

  // Apply section filter first (most important)
  if (filters.section) {
    filteredProducts = filterProductsBySection(filteredProducts, filters.section);
  }

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filterProductsByCategory(filteredProducts, filters.categories);
  }

  // Apply color filter
  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filterProductsByColor(filteredProducts, filters.colors);
  }

  // Apply size filter
  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filterProductsBySize(filteredProducts, filters.sizes);
  }

  // Apply price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filteredProducts = filterProductsByPriceRange(
      filteredProducts,
      filters.minPrice,
      filters.maxPrice
    );
  }

  return filteredProducts;
};

/**
 * React hook for filtering products with memoization
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter object
 * @returns {Array} Memoized filtered products
 */
export const useFilteredProducts = (products, filters) => {
  return useMemo(() => {
    return applyProductFilters(products, filters);
  }, [products, filters]);
};

/**
 * Get unique categories from products for a specific section
 * @param {Array} products - Array of products
 * @param {string} section - Section to get categories for
 * @returns {Array} Unique categories
 */
export const getCategoriesForSection = (products, section) => {
  if (!products || !Array.isArray(products)) return [];

  const sectionProducts = filterProductsBySection(products, section);
  const categories = sectionProducts
    .map(product => product.category)
    .filter(Boolean)
    .filter((category, index, arr) => arr.indexOf(category) === index)
    .sort();

  return categories;
};

/**
 * Get unique colors from products for a specific section
 * @param {Array} products - Array of products
 * @param {string} section - Section to get colors for
 * @returns {Array} Unique colors
 */
export const getColorsForSection = (products, section) => {
  if (!products || !Array.isArray(products)) return [];

  const sectionProducts = filterProductsBySection(products, section);
  const colors = sectionProducts
    .flatMap(product => product.colors || [])
    .filter(Boolean)
    .filter((color, index, arr) => arr.indexOf(color) === index)
    .sort();

  return colors;
};

/**
 * Get unique sizes from products for a specific section
 * @param {Array} products - Array of products
 * @param {string} section - Section to get sizes for
 * @returns {Array} Unique sizes
 */
export const getSizesForSection = (products, section) => {
  if (!products || !Array.isArray(products)) return [];

  const sectionProducts = filterProductsBySection(products, section);
  const sizes = sectionProducts
    .flatMap(product => product.sizes || [])
    .filter(Boolean)
    .filter((size, index, arr) => arr.indexOf(size) === index)
    .sort();

  return sizes;
};