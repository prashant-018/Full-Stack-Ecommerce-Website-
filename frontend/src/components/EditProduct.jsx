import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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
    images: [''],
    totalStock: 0,
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');

    if (userRole !== 'admin' || !authToken) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchProduct();
    }
  }, [navigate, id]);

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

  const fetchProduct = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      // Get API URL from environment or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const apiBase = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/api`;
      
      const response = await fetch(`${apiBase}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const product = data.data?.product || data.product;

        if (product) {
          // Map product data to form structure
          setFormData({
            name: product.name || '',
            price: product.price?.toString() || '',
            originalPrice: product.originalPrice?.toString() || '',
            category: product.category || '',
            section: product.section || '',
            description: product.description || '',
            brand: product.brand || '',
            material: product.material || '',
            sku: product.sku || '',
            images: product.images?.map(img => img.url || img) || [''],
            totalStock: product.totalStock || 0,
            isActive: product.isActive !== undefined ? product.isActive : true
          });
        }
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else {
        alert('Product not found');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error loading product. Please try again.');
      navigate('/admin/products');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.images[0]) newErrors.images = 'At least one image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        alert('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }

      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        totalStock: parseInt(formData.totalStock) || 0,
        images: formData.images.filter(img => img.trim()).map(url => ({ url, alt: formData.name }))
      };

      console.log('Updating product:', productData);

      // Get API URL from environment or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const apiBase = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/api`;
      
      const response = await fetch(`${apiBase}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Product updated successfully!');
        console.log('Product updated:', result);
        navigate('/admin/products');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);

        if (response.status === 401) {
          alert('Authentication failed. Please login again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          navigate('/login');
        } else {
          alert(`Error: ${errorData.message || 'Failed to update product'}`);
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
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
                  placeholder="Enter SKU"
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
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="totalStock"
                  value={formData.totalStock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="0"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Enter image URL"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Image URL
            </button>
            {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images}</p>}
          </div>

          {/* Product Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Product is Active</span>
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
              {isLoading ? 'Updating Product...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;