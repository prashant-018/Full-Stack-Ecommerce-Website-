import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Reusable Filter Section Component with Accordion functionality
 */
const FilterSection = ({ 
  title, 
  children, 
  defaultExpanded = true,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border-b border-gray-100 pb-6 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-sm"
        aria-expanded={isExpanded}
        aria-label={`${title} filter section`}
      >
        <h3 className="text-sm font-medium text-black tracking-wide uppercase">
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 transition-transform" />
        )}
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;

