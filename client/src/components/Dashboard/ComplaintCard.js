import React, { useState } from 'react';
import { Calendar, MapPin, User, Star, MessageSquare } from 'lucide-react';
import { complaintsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const ComplaintCard = ({ complaint, onUpdate }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    setSubmittingFeedback(true);
    try {
      await complaintsAPI.addFeedback(complaint._id, { rating, feedback });
      toast.success('Feedback submitted successfully!');
      setShowFeedbackForm(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {complaint.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {complaint.subcategory}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`status-badge ${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`status-badge ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {complaint.description}
        </p>

        {/* Meta Information */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Raised: {formatDate(complaint.createdAt)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Room: {complaint.roomNumber}</span>
          </div>

          {complaint.assignedAdmin && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Assigned to: {complaint.assignedAdmin.name}</span>
            </div>
          )}

          {complaint.resolverName && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Resolver: {complaint.resolverName}</span>
            </div>
          )}

          {complaint.resolvedAt && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Resolved: {formatDate(complaint.resolvedAt)}</span>
            </div>
          )}
        </div>

        {/* Admin Notes */}
        {complaint.adminNotes && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Admin Note:</strong> {complaint.adminNotes}
            </p>
          </div>
        )}

        {/* Feedback Section */}
        {complaint.status === 'Resolved' && (
          <div className="border-t pt-4">
            {complaint.rating ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Your Rating:</span>
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
                  <p className="text-sm text-gray-600 italic">
                    "{complaint.feedback}"
                  </p>
                )}
              </div>
            ) : (
              <div>
                {showFeedbackForm ? (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Rate your experience:
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`h-6 w-6 ${
                              star <= rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          >
                            <Star className="h-full w-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your feedback (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        rows="2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={submittingFeedback || rating === 0}
                        className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 disabled:opacity-50"
                      >
                        {submittingFeedback ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFeedbackForm(false)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Rate & Give Feedback
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;