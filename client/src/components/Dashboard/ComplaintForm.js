import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, AlertTriangle } from 'lucide-react';
import { complaintsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const ComplaintForm = ({ onComplaintCreated }) => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const selectedCategory = watch('category');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await complaintsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await complaintsAPI.createComplaint(data);
      reset();
      onComplaintCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Raise a Complaint</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="form-label">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="form-input"
              >
                <option value="">Select a category</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <label className="form-label">Subcategory *</label>
              <select
                {...register('subcategory', { required: 'Subcategory is required' })}
                className="form-input"
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {selectedCategory && categories[selectedCategory]?.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="form-label">Priority Level</label>
            <select
              {...register('priority')}
              className="form-input"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="form-label">Title *</label>
            <input
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters'
                }
              })}
              type="text"
              className="form-input"
              placeholder="Brief description of the issue"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description *</label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
              rows="4"
              className="form-input"
              placeholder="Provide detailed information about the issue, including location, time occurred, and any other relevant details..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Complaint Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Provide clear and detailed information about the issue</li>
          <li>• Include the exact location where the problem occurred</li>
          <li>• Mention the time when you first noticed the issue</li>
          <li>• For urgent matters (safety/security), contact the front desk immediately</li>
          <li>• You will receive updates on your complaint status via the dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default ComplaintForm;