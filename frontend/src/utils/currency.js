// Currency conversion utility
const USD_TO_INR_RATE = 83;

/**
 * Convert USD price to INR
 * @param {number} usdPrice - Price in USD
 * @returns {number} - Price in INR
 */
export const convertUSDToINR = (usdPrice) => {
  if (!usdPrice || isNaN(usdPrice)) return 0;
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

/**
 * Format price in Indian Rupees with proper formatting
 * @param {number} price - Price in INR
 * @returns {string} - Formatted price string (₹9,876)
 */
export const formatINRPrice = (price) => {
  if (!price || isNaN(price)) return '₹0';

  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Format with Indian number system (lakhs, crores)
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Convert USD to INR and format
 * @param {number} usdPrice - Price in USD
 * @returns {string} - Formatted INR price string
 */
export const convertAndFormatPrice = (usdPrice) => {
  const inrPrice = convertUSDToINR(usdPrice);
  return formatINRPrice(inrPrice);
};

/**
 * Convert INR back to USD (for API calls if needed)
 * @param {number} inrPrice - Price in INR
 * @returns {number} - Price in USD
 */
export const convertINRToUSD = (inrPrice) => {
  if (!inrPrice || isNaN(inrPrice)) return 0;
  return Math.round((inrPrice / USD_TO_INR_RATE) * 100) / 100; // Round to 2 decimal places
};

/**
 * Backward compatibility - alias for convertAndFormatPrice
 * @param {number} usdPrice - Price in USD
 * @returns {string} - Formatted INR price string
 */
export const formatPrice = convertAndFormatPrice;