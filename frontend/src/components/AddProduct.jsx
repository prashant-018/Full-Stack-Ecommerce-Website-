import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, AlertCircle } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    section: '',
    description: '',
    brand: '',
    material: '',
    sku: '',
    images: [{ url: '', alt: '' }],
    sizes: [{ size: '', stock: 0 }],
    colors: [{ name: '', hex: '#000000' }],
    features: [''],
    care: [''],
    isNewArrival: false,
    isFeatured: false
  });
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const categories = {
    men: [
      "Men's Shirts",
      "Men's Pants",
      "Men's Jeans",
      "Men's T-Shirts",
      "Men's Jackets",
      "Men's Sweaters",
      "Men's Suits",
      "Men's Shorts",
      "Men's Underwear",
      "Men's Activewear"
    ],
    women: [
      "Women's Sweaters",
      "Women's Tops",
      "Women's Dresses",
      "Women's Pants",
      "Women's Jeans",
      "Women's Skirts",
      "Women's Jackets",
      "Women's Shoes",
      "Women's Accessories",
      "Women's Underwear"
    ]
  };

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverErrors.length > 0) {
      setServerErrors([]);
    }
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));

    // Clear related errors
    if (errors[arrayName]) {
      setErrors(prev => ({ ...prev, [arrayName]: '' }));
    }
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem]
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleStringArrayChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.section) {
      newErrors.section = 'Section is required';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    // Images validation
    const validImages = formData.images.filter(img => img.url && img.url.trim());
    if (validImages.length === 0) {
      newErrors.images = 'At least one image URL is required';
    }

    // Sizes validation
    const validSizes = formData.sizes.filter(size => size.size && size.size.trim() && size.stock >= 0);
    if (validSizes.length === 0) {
      newErrors.sizes = 'At least one size with stock is required';
    }

    // Colors validation
    const validColors = formData.colors.filter(color =>
      color.name && color.name.trim() &&
      color.hex && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hex)
    );
    if (validColors.length === 0) {
      newErrors.colors = 'At least one valid color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors([]);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        alert('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }

      // Prepare clean data for API
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        category: formData.category,
        section: formData.section,
        sku: formData.sku.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        material: formData.material.trim(),

        // Clean images - filter out empty URLs
        images: formData.images
          .filter(img => img.url && img.url.trim())
          .map(img => ({
            url: img.url.trim(),
            alt: img.alt || formData.name.trim()
          })),

        // Clean sizes - filter out invalid entries
        sizes: formData.sizes
          .filter(size => size.size && size.size.trim() && size.stock >= 0)
          .map(size => ({
            size: size.size.trim(),
            stock: parseInt(size.stock) || 0
          })),

        // Clean colors - filter out invalid entries
        colors: formData.colors
          .filter(color =>
            color.name && color.name.trim() &&
            color.hex && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hex)
          )
          .map(color => ({
            name: color.name.trim(),
            hex: color.hex
          })),

        // Clean string arrays
        features: formData.features.filter(f => f && f.trim()).map(f => f.trim()),
        care: formData.care.filter(c => c && c.trim()).map(c => c.trim()),

        isNewArrival: formData.isNewArrival,
        isFeatured: formData.isFeatured
      };

      console.log('Submitting product:', productData);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        console.log('Product created:', result);
        navigate('/admin/products');
      } else {
        console.error('API Error:', result);

        if (response.status === 401) {
          alert('Authentication failed. Please login again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          navigate('/login');
        } else if (response.status === 400) {
          // Handle validation errors
          if (result.errors && Array.isArray(result.errors)) {
            setServerErrors(result.errors);
          } else {
            setServerErrors([result.message || 'Validation failed']);
          }
        } else {
          alert(`Error: ${result.message || 'Failed to add product'}`);
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product listing for your store</p>
      </div>

      {/* Server Errors Display */}
      {serverErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {serverErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.sku ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter unique SKU"
                />
                {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="0.00 (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.section ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select Section</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
                {errors.section && <p className="text-red-600 text-sm mt-1">{errors.section}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  disabled={!formData.section}
                >
                  <option value="">Select Category</option>
                  {formData.section && categories[formData.section]?.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="e.g., 100% Cotton"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images *</h2>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) => handleArrayChange(index, 'url', e.target.value, 'images')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Enter image URL"
                />
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleArrayChange(index, 'alt', e.target.value, 'images')}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Alt text"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'images')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('images', { url: '', alt: '' })}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Image URL
            </button>
            {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images}</p>}
          </div>

          {/* Sizes and Stock */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sizes & Stock *</h2>
            {formData.sizes.map((sizeItem, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <select
                  value={sizeItem.size}
                  onChange={(e) => handleArrayChange(index, 'size', e.target.value, 'sizes')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={sizeItem.stock}
                  onChange={(e) => handleArrayChange(index, 'stock', parseInt(e.target.value) || 0, 'sizes')}
                  min="0"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Stock"
                />
                {formData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'sizes')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('sizes', { size: '', stock: 0 })}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Size
            </button>
            {errors.sizes && <p className="text-red-600 text-sm mt-1">{errors.sizes}</p>}
          </div>

          {/* Colors */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Colors *</h2>
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'colors')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Color name"
                />
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleArrayChange(index, 'hex', e.target.value, 'colors')}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'colors')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('colors', { name: '', hex: '#000000' })}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Color
            </button>
            {errors.colors && <p className="text-red-600 text-sm mt-1">{errors.colors}</p>}
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleStringArrayChange(index, e.target.value, 'features')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Enter feature"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'features')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features', '')}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Feature
            </button>
          </div>

          {/* Care Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Care Instructions</h2>
            {formData.care.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => handleStringArrayChange(index, e.target.value, 'care')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Enter care instruction"
                />
                {formData.care.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'care')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('care', '')}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Care Instruction
            </button>
          </div>

          {/* Product Flags */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mark as New Arrival</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mark as Featured Product</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              {isLoading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;