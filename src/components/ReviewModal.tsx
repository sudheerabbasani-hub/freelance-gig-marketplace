import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig } from '../types';
import { X, Star, Award, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  gig: Gig;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ gig, onClose }) => {
  const { currentUser, submitReview } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(
    'Fantastic collaboration! Delivered high-quality code with great attention to detail, clean commits, and responsive communication throughout the milestone.'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig.assignedFreelancerId) {
      setError('No freelancer assigned to this gig.');
      return;
    }
    if (!comment.trim() || comment.length < 10) {
      setError('Review comment must be at least 10 characters.');
      return;
    }

    submitReview({
      gigId: gig.id,
      freelancerId: gig.assignedFreelancerId,
      rating,
      comment,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Rate & Review Freelancer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-xs text-slate-600">
            Freelancer: <strong className="text-slate-900">{gig.assignedFreelancerName}</strong> for project <em className="text-slate-800">"{gig.title}"</em>
          </div>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Overall Quality & Communication Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        filled
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="font-mono text-sm font-bold text-slate-800 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Feedback & Review Comments *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience, technical competence, delivery speed, and code quality..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Submit Verified Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
