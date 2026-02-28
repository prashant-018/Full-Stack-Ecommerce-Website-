// Currency helpers for displaying prices in INR
const USD_TO_INR_RATE = 83;

/**
 * Convert USD price to INR.
 * Only use this if you explicitly have a USD value.
 * Most of the app should pass INR amounts directly to
 * the formatting helpers below.
 */
export const convertUSDToINR = (usdPrice) => {
  if (usdPrice == null || isNaN(usdPrice)) return 0;
  return Math.round(Number(usdPrice) * USD_TO_INR_RATE);
};

/**
 * Format price in Indian Rupees with proper formatting.
 * Expects `price` to already be in INR.
 * @param {number|string} price - Price in INR
 * @returns {string} - Formatted price string (₹9,876)
 */
export const formatINRPrice = (price) => {
  if (price == null || price === '' || isNaN(Number(price))) return '₹0';

  const numPrice = typeof price === 'string' ? Number(price) : price;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
};

/**
 * Backwards‑compatible helper used across the app.
 * Historically this expected a USD value and converted it.
 * Now it simply treats the input as INR and formats it, so
 * existing call sites that pass stored prices will render
 * correct INR amounts without double conversion.
 *
 * @param {number|string} priceInINR - Price in INR
 * @returns {string} - Formatted INR price string
 */
export const convertAndFormatPrice = (priceInINR) => {
  return formatINRPrice(priceInINR);
};

/**
 * Convert INR back to USD (for API calls if needed).
 * Rarely needed now that prices are stored in INR.
 * @param {number} inrPrice - Price in INR
 * @returns {number} - Price in USD
 */
export const convertINRToUSD = (inrPrice) => {
  if (inrPrice == null || isNaN(Number(inrPrice))) return 0;
  return Math.round((Number(inrPrice) / USD_TO_INR_RATE) * 100) / 100; // Round to 2 decimal places
};

/**
 * Backward compatibility - alias for convertAndFormatPrice.
 * Use this when you just need a generic "format price" helper.
 * @param {number|string} priceInINR - Price in INR
 * @returns {string} - Formatted INR price string
 */
export const formatPrice = convertAndFormatPrice;