import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig, Proposal } from '../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Send, 
  Star, 
  AlertCircle, 
  DollarSign, 
  Briefcase,
  ArrowUpRight
} from 'lucide-react';

interface FreelancerDashboardProps {
  onSelectGig: (gig: Gig) => void;
}

export const FreelancerDashboard: React.FC<FreelancerDashboardProps> = ({ onSelectGig }) => {
  const {
    currentUser,
    users,
    switchUser,
    proposals,
    gigs,
    reviews,
    deliverWork,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'proposals' | 'active_jobs' | 'reviews'>('proposals');
  const [deliverNotes, setDeliverNotes] = useState<{ [gigId: string]: string }>({});

  const freelancerUser = users.find((u) => u.role === 'freelancer');

  // Filter proposals submitted by current user
  const myProposals = proposals.filter((p) => p.freelancerId === currentUser?.id);

  // Filter gigs assigned to current user
  const myActiveGigs = gigs.filter((g) => g.assignedFreelancerId === currentUser?.id);

  // Filter reviews received by current user
  const myReviews = reviews.filter((r) => r.freelancerId === currentUser?.id);

  const pendingCount = myProposals.filter((p) => p.status === 'pending').length;
  const acceptedCount = myProposals.filter((p) => p.status === 'accepted').length;

  const handleDeliver = (gigId: string) => {
    const notes = deliverNotes[gigId] || 'Deliverables and repository ready for client inspection.';
    deliverWork(gigId, notes);
    setDeliverNotes((prev) => ({ ...prev, [gigId]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Notice if not Freelancer */}
      {currentUser?.role !== 'freelancer' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              You are currently viewing as <strong>{currentUser?.name || 'Guest'}</strong> ({currentUser?.role}). Switch to a Freelancer profile to view your submitted bids and work deliverables.
            </span>
          </div>
          {freelancerUser && (
            <button
              onClick={() => switchUser(freelancerUser.id)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors shrink-0"
            >
              Switch to {freelancerUser.name} (Freelancer)
            </button>
          )}
        </div>
      )}

      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Freelancer Studio</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor proposal statuses, submit milestone deliverables, and inspect your client ratings.
          </p>
        </div>

        {currentUser?.role === 'freelancer' && (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
            <span className="text-slate-500">Reputation Rating:</span>
            <span className="flex items-center gap-1 font-bold text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-mono tabular-nums">{currentUser.rating?.toFixed(2) || '5.0'}</span>
            </span>
            <span className="text-slate-400">({currentUser.reviewsCount || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Submitted Proposals</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {myProposals.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Accepted Bids</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {acceptedCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Contracts</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {myActiveGigs.filter((g) => g.status === 'in_progress').length}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'proposals'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>My Proposals</span>
          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
            {myProposals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('active_jobs')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'active_jobs'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active Contracts & Delivery</span>
          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
            {myActiveGigs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Client Reviews & Ratings</span>
          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
            {myReviews.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Proposals View */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {myProposals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No proposals submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore open gigs in the marketplace and submit your proposals with competitive pricing.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">Gig Title</th>
                      <th className="px-4 py-3.5">Proposed Price</th>
                      <th className="px-4 py-3.5">Delivery Time</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myProposals.map((p) => {
                      const gig = gigs.find((g) => g.id === p.gigId);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-slate-900 line-clamp-1 max-w-sm">
                              {p.gigTitle || gig?.title || `Gig #${p.gigId}`}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {p.coverLetter}
                            </p>
                          </td>

                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                            ${p.proposedPrice.toLocaleString()}
                          </td>

                          <td className="px-4 py-3.5 font-mono text-slate-600 tabular-nums">
                            {p.deliveryDays} days
                          </td>

                          <td className="px-4 py-3.5 text-slate-500">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                              p.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {p.status}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            {gig && (
                              <button
                                onClick={() => onSelectGig(gig)}
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors inline-flex items-center gap-1"
                              >
                                <span>Details</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Contracts */}
      {activeTab === 'active_jobs' && (
        <div className="space-y-4">
          {myActiveGigs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No active client contracts</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once a client accepts your bid, the contract will appear here for you to work on and deliver.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myActiveGigs.map((g) => {
                const isDelivered = g.status === 'delivered';
                const isCompleted = g.status === 'completed';

                return (
                  <div
                    key={g.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-indigo-600 uppercase">
                            {g.category}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">Client: {g.clientName}</span>
                        </div>
                        <h3
                          onClick={() => onSelectGig(g)}
                          className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer mt-1"
                        >
                          {g.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded ${
                          g.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : g.status === 'delivered'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {g.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {g.description}
                    </p>

                    {/* Delivery Form for In Progress state */}
                    {g.status === 'in_progress' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-800">
                          Submit Work Deliverables to Client:
                        </label>
                        <textarea
                          rows={2}
                          value={deliverNotes[g.id] || ''}
                          onChange={(e) =>
                            setDeliverNotes({ ...deliverNotes, [g.id]: e.target.value })
                          }
                          placeholder="Include repository link, deployed preview URL, or deliverables summary..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                        <button
                          onClick={() => handleDeliver(g.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Mark Work Delivered</span>
                        </button>
                      </div>
                    )}

                    {isDelivered && (
                      <div className="p-3 bg-indigo-50 text-indigo-900 text-xs rounded-lg border border-indigo-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Deliverables submitted! Waiting for client inspection and completion approval.</span>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Project completed and approved by client! Payment settled.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Client Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {myReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Star className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No client reviews yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Completed gigs with verified clients will generate reviews and build your credibility.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.clientAvatar}
                        alt={rev.clientName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rev.clientName}</p>
                        <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-100 text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium truncate">
                    Project: "{rev.gigTitle}"
                  </p>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
