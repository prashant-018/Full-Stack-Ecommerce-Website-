import { useState, useEffect, useCallback } from 'react';
import { fetchMensProducts } from '../services/api';

/**
 * Custom hook for infinite scrolling product loading
 * @param {Object} initialFilters - Initial filter parameters
 * @param {number} pageSize - Number of products to load per page
 * @returns {Object} Hook state and methods
 */
export const useInfiniteScroll = (initialFilters = {}, pageSize = 12) => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    priceRange: { minPrice: 0, maxPrice: 1000 },
    sizes: [],
    colors: []
  });

  /**
   * Load products from API
   * @param {number} pageNum - Page number to load
   * @param {Object} currentFilters - Current filter state
   * @param {boolean} reset - Whether to reset the product list
   */
  const loadProducts = useCallback(async (pageNum, currentFilters, reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pageNum,
        limit: pageSize,
        ...currentFilters,
      };

      const response = await fetchMensProducts(params);

      if (response.success) {
        const { products: newProducts, pagination, filters: apiFilters } = response.data;

        setProducts(prevProducts =>
          reset ? newProducts : [...prevProducts, ...newProducts]
        );

        setHasMore(pagination.hasNextPage);
        setTotalProducts(pagination.totalProducts);

        // Update filter options from API response
        if (apiFilters) {
          setFilterOptions(apiFilters);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [loading, pageSize]);

  /**
   * Load more products (for infinite scroll)
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, filters, false);
    }
  }, [hasMore, loading, page, filters, loadProducts]);

  /**
   * Apply new filters and reset product list
   * @param {Object} newFilters - New filter parameters
   */
  const applyFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadProducts(1, updatedFilters, true);
  }, [filters, loadProducts]);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadProducts(1, initialFilters, true);
  }, [initialFilters, loadProducts]);

  /**
   * Refresh products (reload current page)
   */
  const refresh = useCallback(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    loadProducts(1, filters, true);
  }, [filters, loadProducts]);

  // Initial load
  useEffect(() => {
    loadProducts(1, filters, true);
  }, []); // Only run on mount

  return {
    // Data
    products,
    totalProducts,
    filterOptions,

    // State
    loading,
    error,
    hasMore,
    page,
    filters,

    // Actions
    loadMore,
    applyFilters,
    resetFilters,
    refresh,
  };
};