import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig } from '../types';
import { X, Send, AlertCircle, DollarSign, Clock, ShieldCheck } from 'lucide-react';

interface SubmitProposalModalProps {
  gig: Gig;
  onClose: () => void;
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({ gig, onClose }) => {
  const { currentUser, switchUser, users, submitProposal } = useApp();

  const [coverLetter, setCoverLetter] = useState(
    `Hi ${gig.clientName},\n\nI reviewed your requirements for "${gig.title}" and have the exact experience needed. I specialize in ${gig.requiredSkills.slice(0, 3).join(', ')} and have delivered similar projects ahead of schedule. Let's discuss details and start building.`
  );
  const [proposedPrice, setProposedPrice] = useState(String(Math.round((gig.minBudget + gig.maxBudget) / 2)));
  const [deliveryDays, setDeliveryDays] = useState('7');
  const [error, setError] = useState<string | null>(null);

  const freelancerUser = users.find((u) => u.role === 'freelancer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!coverLetter.trim() || coverLetter.length < 20) {
      setError('Cover letter must be at least 20 characters long.');
      return;
    }

    const price = Number(proposedPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please provide a valid bid price.');
      return;
    }

    const days = Number(deliveryDays);
    if (isNaN(days) || days < 1) {
      setError('Delivery time must be at least 1 day.');
      return;
    }

    const res = submitProposal({
      gigId: gig.id,
      coverLetter,
      proposedPrice: price,
      deliveryDays: days,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to submit proposal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Submit Proposal</h2>
            <p className="text-xs text-slate-500 truncate max-w-md">For: {gig.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Guard */}
        {currentUser?.role !== 'freelancer' && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You are logged in as <strong>{currentUser?.role || 'Guest'}</strong>. Only Freelancers can submit proposals.
              </span>
            </div>
            {freelancerUser && (
              <button
                type="button"
                onClick={() => switchUser(freelancerUser.id)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] whitespace-nowrap"
              >
                Switch to {freelancerUser.name}
              </button>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Budget hint from client */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Client's Target Budget:</span>
            <span className="font-mono font-bold text-slate-900">
              ${gig.minBudget.toLocaleString()} – ${gig.maxBudget.toLocaleString()} USD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Proposed Price (USD $) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  min="5"
                  required
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-7 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Delivery Estimated (Days) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cover Letter & Approach *
            </label>
            <textarea
              required
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce your relevant experience, technical approach, and how you will solve the client's problem..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Mention previous projects and specific frameworks like {gig.requiredSkills.join(', ')}.
            </p>
          </div>

          {/* Database rule callout */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/70 text-xs flex items-center gap-2 text-indigo-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-[11px]">
              Guaranteed duplicate protection via compound index: <code className="font-mono text-indigo-700">{`{ gigId, freelancerId }`}</code>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={currentUser?.role !== 'freelancer'}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
