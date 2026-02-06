import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, UserX, Mail, Calendar } from 'lucide-react';
import { usersApi } from '../utils/api';
import { convertAndFormatPrice } from '../utils/currency';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check admin access
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetchUsers();
    fetchStats();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersApi.getAll(navigate);
      if (response.success) {
        setUsers(response.data || []);
      } else {
        console.error('Error fetching users:', response.message);
        alert('Error fetching users: ' + response.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await usersApi.getStats(navigate);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await usersApi.updateStatus(userId, newStatus, navigate);
      
      if (response.success) {
        // Update local state
        setUsers(users.map(user =>
          user._id === userId ? { ...user, isActive: newStatus } : user
        ));
        
        // Refresh stats
        await fetchStats();
        
        alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        alert('Error updating user status: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage customer accounts and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-xl font-bold">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-xl font-bold">{stats.inactiveUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-xl font-bold">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Spent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {((user.firstName || '')[0] || '').toUpperCase()}{((user.lastName || '')[0] || '').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName || ''} {user.lastName || ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{user.totalOrders}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {convertAndFormatPrice(user.totalSpent || 0)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`px-3 py-1 text-xs rounded ${user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                            } transition-colors`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                      <button
                        onClick={() => alert(`User Details:\n${JSON.stringify(user, null, 2)}`)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <UserCheck className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No users registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;