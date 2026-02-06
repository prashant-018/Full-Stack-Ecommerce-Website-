import React from 'react';
import { X } from 'lucide-react';
import { convertAndFormatPrice } from '../utils/currency';

/**
 * Component to display active filters as removable chips
 */
const FilterChips = ({ filters, onRemove, onClearAll }) => {
  const chips = [];

  // Category chips
  filters.category.forEach(category => {
    chips.push({ type: 'category', value: category, label: category });
  });

  // Color chips
  filters.color.forEach(color => {
    chips.push({ type: 'color', value: color, label: color });
  });

  // Size chips
  filters.size.forEach(size => {
    chips.push({ type: 'size', value: size, label: size });
  });

  // Fit chips
  filters.fit.forEach(fit => {
    chips.push({ type: 'fit', value: fit, label: fit });
  });

  // Price range chip
  if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
    chips.push({
      type: 'priceRange',
      value: 'priceRange',
      label: `${convertAndFormatPrice(filters.priceRange.min)} - ${convertAndFormatPrice(filters.priceRange.max)}`
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-gray-600 font-medium">Active Filters:</span>
      {chips.map((chip, index) => (
        <button
          key={`${chip.type}-${chip.value}-${index}`}
          onClick={() => onRemove(chip.type, chip.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
          aria-label={`Remove ${chip.label} filter`}
        >
          <span>{chip.label}</span>
          <X className="w-3 h-3" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-600 hover:text-black font-medium underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 rounded-sm"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterChips;

