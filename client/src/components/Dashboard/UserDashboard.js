import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Header from '../Layout/Header';
import ComplaintForm from './ComplaintForm';
import ComplaintCard from './ComplaintCard';
import { complaintsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [complaints, setComplaints] = useState({
    active: {},
    resolved: {}
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const [activeResponse, resolvedResponse] = await Promise.all([
        complaintsAPI.getMyComplaints('active'),
        complaintsAPI.getMyComplaints('resolved')
      ]);

      const activeComplaints = activeResponse.data.complaints;
      const resolvedComplaints = resolvedResponse.data.complaints;

      setComplaints({
        active: activeComplaints,
        resolved: resolvedComplaints
      });

      // Calculate stats
      const activeCount = Object.values(activeComplaints).flat().length;
      const resolvedCount = Object.values(resolvedComplaints).flat().length;
      
      setStats({
        total: activeCount + resolvedCount,
        active: activeCount,
        resolved: resolvedCount
      });

    } catch (error) {
      toast.error('Failed to load complaints');
      console.error('Load complaints error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintCreated = () => {
    toast.success('Complaint submitted successfully!');
    loadComplaints();
    setActiveSection('active');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Complaints</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <AlertCircle className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Active Complaints</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Resolved Complaints</p>
              <p className="text-3xl font-bold">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveSection('raise')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-primary-600 mr-2" />
            <span className="text-primary-600 font-medium">Raise New Complaint</span>
          </button>
          
          <button
            onClick={() => setActiveSection('active')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-yellow-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
          >
            <Clock className="h-6 w-6 text-yellow-600 mr-2" />
            <span className="text-yellow-600 font-medium">View Active Complaints</span>
          </button>
          
          <button
            onClick={() => setActiveSection('past')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">View Past Complaints</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {stats.active > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {Object.values(complaints.active).flat().slice(0, 3).map((complaint) => (
              <div key={complaint._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{complaint.title}</p>
                  <p className="text-sm text-gray-500">{complaint.category} - {complaint.subcategory}</p>
                </div>
                <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderComplaintsList = (complaintsData, title, emptyMessage) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {Object.values(complaintsData).flat().length} complaints
        </span>
      </div>

      {Object.keys(complaintsData).length === 0 ? (
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        Object.entries(complaintsData).map(([category, categoryComplaints]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              {category} ({categoryComplaints.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onUpdate={loadComplaints}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('raise')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'raise'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Raise Complaint
            </button>
            <button
              onClick={() => setActiveSection('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'active'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Complaints ({stats.active})
            </button>
            <button
              onClick={() => setActiveSection('past')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'past'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Complaints ({stats.resolved})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'raise' && (
          <ComplaintForm onComplaintCreated={handleComplaintCreated} />
        )}
        {activeSection === 'active' && renderComplaintsList(
          complaints.active,
          'Active Complaints',
          'No active complaints. All your issues have been resolved!'
        )}
        {activeSection === 'past' && renderComplaintsList(
          complaints.resolved,
          'Past Complaints',
          'No past complaints yet.'
        )}
      </div>
    </div>
  );
};

export default UserDashboard;