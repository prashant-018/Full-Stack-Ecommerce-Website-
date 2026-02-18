// Simple, reusable slug generator for product names or other strings.
// Example: "Premium Shift Dress" -> "premium-shift-dress"
// Keeps only lowercase letters, numbers and single hyphens.

function slugify(text) {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace non-alphanumeric characters with spaces
    .replace(/[^a-z0-9\s-]/g, '')
    // Collapse multiple spaces into one
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-');
}

module.exports = slugify;


