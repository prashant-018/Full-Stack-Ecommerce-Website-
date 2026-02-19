import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, Plus, X, AlertTriangle, Package } from 'lucide-react';
import { convertAndFormatPrice } from '../utils/currency';
import { productsApi } from '../utils/api';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingProducts, setDeletingProducts] = useState(new Set());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');

    if (userRole !== 'admin' || !authToken) {
      navigate('/login');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      const data = await productsApi.getAll(navigate);
      console.log('Products fetched:', data);
      setProducts(data.data?.products || data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data as fallback
      setProducts(getMockProducts());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockProducts = () => [
    {
      _id: '1',
      name: 'Classic White Shirt',
      price: 89.99,
      category: "Men's Shirts",
      section: 'men',
      sku: 'CWS-001',
      totalStock: 45,
      isActive: true,
      images: [{ url: 'https://via.placeholder.com/100x120', alt: 'Classic White Shirt' }],
      description: 'A timeless white shirt perfect for any occasion.',
      brand: 'Everlane',
      material: '100% Cotton'
    },
    {
      _id: '2',
      name: 'Denim Jeans',
      price: 129.99,
      category: "Men's Jeans",
      section: 'men',
      sku: 'DJ-002',
      totalStock: 32,
      isActive: true,
      images: [{ url: 'https://via.placeholder.com/100x120', alt: 'Denim Jeans' }],
      description: 'Premium denim jeans with a perfect fit.',
      brand: 'Everlane',
      material: '98% Cotton, 2% Elastane'
    },
    {
      _id: '3',
      name: 'Cotton Dress',
      price: 159.99,
      category: "Women's Dresses",
      section: 'women',
      sku: 'CD-003',
      totalStock: 28,
      isActive: true,
      images: [{ url: 'https://via.placeholder.com/100x120', alt: 'Cotton Dress' }],
      description: 'Elegant cotton dress for everyday wear.',
      brand: 'Everlane',
      material: '100% Organic Cotton'
    }
  ];

  // Toast notification system
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (product) => {
    const productId = product._id;

    // Add product to deleting set to show loading state
    setDeletingProducts(prev => new Set([...prev, productId]));

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      await productsApi.delete(productId, navigate);
      setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
      showToast(`"${product.name}" deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast(error.message || 'Server error while deleting product', 'error');
    } finally {
      // Remove product from deleting set
      setDeletingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5002/api/products/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        // Remove product from UI
        setProducts(products.filter(p => p._id !== selectedProduct._id));
        alert('Product deleted successfully!');
      } else if (response.status === 401) {
        alert('Authentication failed. Please login again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to delete product'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-600 mt-2">View and manage your product inventory</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-product')}
          className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-12 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/100x120'}
                          alt={product.images?.[0]?.alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{product.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{product.section}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{product.sku}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{convertAndFormatPrice(product.price)}</td>
                  <td className="py-4 px-4">
                    <span className={`text-sm ${product.totalStock > 10 ? 'text-green-600' :
                      product.totalStock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {product.totalStock || 0}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(product)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingProducts.has(product._id)}
                        className={`p-1 rounded transition-colors ${deletingProducts.has(product._id)
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                          }`}
                        title={deletingProducts.has(product._id) ? 'Deleting...' : 'Delete Product'}
                      >
                        {deletingProducts.has(product._id) ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
            </p>
            <button
              onClick={() => navigate('/admin/add-product')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 ${toast.type === 'success'
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-red-50 border-red-400 text-red-800'
            }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setToast(null)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <img
                    src={selectedProduct.images?.[0]?.url || 'https://via.placeholder.com/300x400'}
                    alt={selectedProduct.images?.[0]?.alt || selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg bg-gray-100"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{selectedProduct.name}</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{convertAndFormatPrice(selectedProduct.price)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">SKU:</span>
                      <p className="text-gray-600">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-600">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Section:</span>
                      <p className="text-gray-600 capitalize">{selectedProduct.section}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <p className={`font-medium ${selectedProduct.totalStock > 10 ? 'text-green-600' :
                        selectedProduct.totalStock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {selectedProduct.totalStock || 0} units
                      </p>
                    </div>
                    {selectedProduct.brand && (
                      <div>
                        <span className="font-medium text-gray-700">Brand:</span>
                        <p className="text-gray-600">{selectedProduct.brand}</p>
                      </div>
                    )}
                    {selectedProduct.material && (
                      <div>
                        <span className="font-medium text-gray-700">Material:</span>
                        <p className="text-gray-600">{selectedProduct.material}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedProduct.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedProduct._id);
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;