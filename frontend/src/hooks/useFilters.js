import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing filter state
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    category: [],
    color: [],
    size: [],
    priceRange: { min: 0, max: 1000 },
    fit: [],
    ...initialFilters
  });

  // Toggle category filter
  const toggleCategory = useCallback((category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  }, []);

  // Toggle color filter
  const toggleColor = useCallback((color) => {
    setFilters(prev => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter(c => c !== color)
        : [...prev.color, color]
    }));
  }, []);

  // Toggle size filter
  const toggleSize = useCallback((size) => {
    setFilters(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  }, []);

  // Update price range
  const updatePriceRange = useCallback((min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  }, []);

  // Toggle fit filter
  const toggleFit = useCallback((fit) => {
    setFilters(prev => ({
      ...prev,
      fit: prev.fit.includes(fit)
        ? prev.fit.filter(f => f !== fit)
        : [...prev.fit, fit]
    }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      category: [],
      color: [],
      size: [],
      priceRange: { min: 0, max: 1000 },
      fit: []
    });
  }, []);

  // Remove specific filter
  const removeFilter = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  }, []);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return (
      filters.category.length +
      filters.color.length +
      filters.size.length +
      filters.fit.length +
      (filters.priceRange.min > 0 || filters.priceRange.max < 1000 ? 1 : 0)
    );
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    toggleCategory,
    toggleColor,
    toggleSize,
    updatePriceRange,
    toggleFit,
    clearAllFilters,
    removeFilter,
    activeFiltersCount,
    hasActiveFilters
  };
};

