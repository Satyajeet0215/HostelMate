import React, { useState } from 'react';
import { X, User, Calendar, MapPin, Phone, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ComplaintModal = ({ complaint, onClose, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: complaint.status,
      resolverName: complaint.resolverName || '',
      adminNotes: complaint.adminNotes || ''
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
      default:
        return 'status-open';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'priority-low';
      case 'Medium':
        return 'priority-medium';
      case 'High':
        return 'priority-high';
      case 'Urgent':
        return 'priority-urgent';
      default:
        return 'priority-medium';
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onStatusUpdate(complaint._id, data);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Complaint Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Complaint Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Complaint Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Complaint Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <p className="text-gray-900 mt-1">{complaint.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{complaint.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900 mt-1">{complaint.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subcategory</label>
                      <p className="text-gray-900 mt-1">{complaint.subcategory}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Status</label>
                      <span className={`status-badge ${getStatusColor(complaint.status)} mt-1 inline-block`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <span className={`status-badge ${getPriorityColor(complaint.priority)} mt-1 inline-block`}>
                        {complaint.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Created: {formatDate(complaint.createdAt)}</span>
                  </div>
                  {complaint.resolvedAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-green-400 mr-2" />
                      <span>Resolved: {formatDate(complaint.resolvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - User Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{complaint.user.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{complaint.user.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Room {complaint.roomNumber}</span>
                  </div>
                  
                  {complaint.user.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{complaint.user.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment Info */}
              {complaint.assignedAdmin && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Assignment Details</h4>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Assigned Admin:</span>
                      <p className="font-medium">{complaint.assignedAdmin.name}</p>
                    </div>
                    {complaint.resolverName && (
                      <div>
                        <span className="text-sm text-gray-600">Resolver:</span>
                        <p className="font-medium">{complaint.resolverName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {complaint.rating && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">User Feedback</h4>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= complaint.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {complaint.feedback && (
                      <div>
                        <span className="text-sm text-gray-600">Feedback:</span>
                        <p className="italic">"{complaint.feedback}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Form */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Status *</label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="form-input"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Resolver Name</label>
                  <input
                    {...register('resolverName')}
                    type="text"
                    className="form-input"
                    placeholder="Name of person resolving the issue"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Admin Notes</label>
                <textarea
                  {...register('adminNotes')}
                  rows="3"
                  className="form-input"
                  placeholder="Add any notes or updates about this complaint..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;