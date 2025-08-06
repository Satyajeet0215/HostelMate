import React, { useState, useEffect } from 'react';
import { Search, Filter, BarChart3, Users, Clock, CheckCircle } from 'lucide-react';
import Header from '../Layout/Header';
import ComplaintTable from './ComplaintTable';
import StatsCards from './StatsCards';
import { complaintsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    page: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    categoryStats: []
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    loadComplaints();
    loadStats();
  }, [filters]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getAllComplaints(filters);
      setComplaints(response.data.complaints);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      toast.error('Failed to load complaints');
      console.error('Load complaints error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await complaintsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleStatusUpdate = async (complaintId, statusData) => {
    try {
      await complaintsAPI.updateComplaintStatus(complaintId, statusData);
      toast.success('Complaint status updated successfully!');
      loadComplaints();
      loadStats();
    } catch (error) {
      toast.error('Failed to update complaint status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage maintenance tickets and monitor system performance</p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 form-input"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input min-w-40"
              >
                <option value="all">All Categories</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Security">Security</option>
                <option value="Appliances">Appliances</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Medical">Medical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Community">Community</option>
                <option value="Laundry">Laundry</option>
                <option value="Repairs & Maintenance">Repairs & Maintenance</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Internet & Connection">Internet & Connection</option>
                <option value="Others">Others</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-input min-w-40"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{pagination.total} complaints found</span>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <ComplaintTable
          complaints={complaints}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Category Statistics */}
        {stats.categoryStats.length > 0 && (
          <div className="card mt-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Category Statistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.categoryStats.map((category) => (
                <div key={category._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{category._id}</h4>
                    <span className="text-2xl font-bold text-primary-600">{category.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Resolved: {category.resolved}</span>
                    <span className="text-green-600">
                      {category.count > 0 ? Math.round((category.resolved / category.count) * 100) : 0}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${category.count > 0 ? (category.resolved / category.count) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;