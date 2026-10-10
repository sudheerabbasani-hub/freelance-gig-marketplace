import React, { useState } from 'react';
import { Gig, Proposal } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Trash2, 
  Award,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface GigDetailModalProps {
  gig: Gig;
  onClose: () => void;
  onOpenSubmitProposal: (gig: Gig) => void;
  onOpenReview: (gig: Gig) => void;
}

export const GigDetailModal: React.FC<GigDetailModalProps> = ({
  gig,
  onClose,
  onOpenSubmitProposal,
  onOpenReview,
}) => {
  const {
    currentUser,
    proposals,
    reviews,
    acceptProposal,
    rejectProposal,
    deliverWork,
    completeWork,
    deleteGig,
  } = useApp();

  const [deliveryNotesInput, setDeliveryNotesInput] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  // Relevant proposals for this gig
  const gigProposals = proposals.filter((p) => p.gigId === gig.id);
  
  // Check if current freelancer submitted a proposal
  const myProposal = currentUser?.role === 'freelancer'
    ? gigProposals.find((p) => p.freelancerId === currentUser.id)
    : null;

  // Check if existing review exists
  const existingReview = reviews.find((r) => r.gigId === gig.id);

  const isOwner = currentUser?.id === gig.clientId;
  const isAssignedFreelancer = currentUser?.id === gig.assignedFreelancerId;
  const isAdmin = currentUser?.role === 'admin';

  const formattedDeadline = new Date(gig.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDeliverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryNotesInput.trim()) return;
    deliverWork(gig.id, deliveryNotesInput);
    setShowDeliveryForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              {gig.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">ID: {gig.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  deleteGig(gig.id);
                  onClose();
                }}
                className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md transition-colors flex items-center gap-1"
                title="Moderate and remove gig"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Gig</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {gig.title}
              </h2>
            </div>

            {/* Client unboxed metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
              <span className="font-semibold text-slate-800">Posted by {gig.clientName}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="tabular-nums font-mono">{gig.clientRating.toFixed(1)} rating</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline: {formattedDeadline}</span>
              </span>
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 font-medium mb-0.5">Budget Range</p>
              <p className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                ${gig.minBudget.toLocaleString()} – ${gig.maxBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-0.5">Marketplace Status</p>
              <p className="font-semibold text-slate-800 capitalize">
                {gig.status.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-0.5">Proposals Received</p>
              <p className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                {gigProposals.length} submissions
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-0.5">Assigned Talent</p>
              <p className="font-semibold text-slate-800 truncate">
                {gig.assignedFreelancerName || 'None assigned yet'}
              </p>
            </div>
          </div>

          {/* Detailed Job Description */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">
              Project Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-lg border border-slate-100">
              {gig.description}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">
              Required Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {gig.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-md border border-slate-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables / Delivery Notes Section (If in progress or delivered) */}
          {gig.deliveryNotes && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Freelancer Deliverables Submitted:</span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed bg-white/80 p-3 rounded-lg border border-indigo-100">
                {gig.deliveryNotes}
              </p>
            </div>
          )}

          {/* Completed Review Banner if exists */}
          {existingReview && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-emerald-900 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Verified Client Review
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-mono tabular-nums">{existingReview.rating} / 5</span>
                </span>
              </div>
              <p className="text-xs text-emerald-950 italic">
                "{existingReview.comment}"
              </p>
            </div>
          )}

          {/* Workflow Interactive Zone based on user role and gig status */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            {/* Freelancer Delivery Form if assigned and in_progress */}
            {isAssignedFreelancer && gig.status === 'in_progress' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">
                  Active Contract: Deliver Completed Work
                </h4>
                <p className="text-xs text-amber-800 mb-3">
                  You are the assigned engineer for this job. When finished, submit your repo link or delivery notes for the client's approval.
                </p>

                {showDeliveryForm ? (
                  <form onSubmit={handleDeliverSubmit} className="space-y-3">
                    <textarea
                      required
                      rows={3}
                      value={deliveryNotesInput}
                      onChange={(e) => setDeliveryNotesInput(e.target.value)}
                      placeholder="Describe what was delivered (e.g., Pull Request link, test results, deployed URL)..."
                      className="w-full text-xs p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        Submit Final Deliverable
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeliveryForm(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowDeliveryForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Mark Work Delivered</span>
                  </button>
                )}
              </div>
            )}

            {/* Client Approval / Completion buttons */}
            {isOwner && gig.status === 'delivered' && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 uppercase">
                    Work Submitted for Review
                  </h4>
                  <p className="text-xs text-indigo-800">
                    The freelancer has submitted deliverables. Inspect the work and approve to mark Completed.
                  </p>
                </div>
                <button
                  onClick={() => completeWork(gig.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Complete Gig</span>
                </button>
              </div>
            )}

            {/* Client Leave Review Button */}
            {isOwner && gig.status === 'completed' && !existingReview && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    Rate Freelancer
                  </h4>
                  <p className="text-xs text-slate-600">
                    Job is complete! Share your feedback and star rating to build marketplace reputation.
                  </p>
                </div>
                <button
                  onClick={() => onOpenReview(gig)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Leave Review</span>
                </button>
              </div>
            )}

            {/* Freelancer Apply Section */}
            {currentUser?.role === 'freelancer' && gig.status === 'open' && (
              <div>
                {myProposal ? (
                  <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Proposal Already Submitted
                      </p>
                      <p className="text-xs text-slate-600">
                        Proposed <span className="font-mono font-semibold">${myProposal.proposedPrice}</span> · Delivery in <span className="font-mono font-semibold">{myProposal.deliveryDays}d</span>
                      </p>
                    </div>
                    <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded ${
                      myProposal.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : myProposal.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {myProposal.status}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => onOpenSubmitProposal(gig)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Proposal for this Gig</span>
                  </button>
                )}
              </div>
            )}

            {/* Received Proposals List (visible to Client owner or Admin) */}
            {(isOwner || isAdmin) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Received Proposals ({gigProposals.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Accepting one proposal automatically rejects others
                  </span>
                </div>

                {gigProposals.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs font-medium text-slate-600">No proposals received yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Freelancers will appear here once they bid.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gigProposals.map((proposal) => {
                      const isAccepted = proposal.status === 'accepted';
                      const isRejected = proposal.status === 'rejected';

                      return (
                        <div
                          key={proposal.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isAccepted
                              ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                              : isRejected
                              ? 'bg-slate-50/50 border-slate-200 opacity-70'
                              : 'bg-white border-slate-200 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={proposal.freelancerAvatar}
                                alt={proposal.freelancerName}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">
                                  {proposal.freelancerName}
                                </h4>
                                <p className="text-[11px] text-slate-500">{proposal.freelancerTitle}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                                ${proposal.proposedPrice.toLocaleString()}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                in {proposal.deliveryDays} days
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3 leading-relaxed">
                            {proposal.coverLetter}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-slate-500">Status:</span>
                              <span className={`font-semibold capitalize text-xs ${
                                isAccepted
                                  ? 'text-emerald-700'
                                  : isRejected
                                  ? 'text-rose-600'
                                  : 'text-amber-600'
                              }`}>
                                {proposal.status}
                              </span>
                            </div>

                            {/* Accept / Reject controls for Client */}
                            {isOwner && gig.status === 'open' && proposal.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => rejectProposal(proposal.id)}
                                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => acceptProposal(proposal.id, gig.id)}
                                  className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-sm transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Accept Proposal</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
