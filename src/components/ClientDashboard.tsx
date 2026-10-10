import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig, Proposal } from '../types';
import { 
  Plus, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Users, 
  FileText, 
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface ClientDashboardProps {
  onOpenPostGig: () => void;
  onSelectGig: (gig: Gig) => void;
  onOpenReview: (gig: Gig) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onOpenPostGig,
  onSelectGig,
  onOpenReview,
}) => {
  const {
    currentUser,
    users,
    switchUser,
    gigs,
    proposals,
    reviews,
    acceptProposal,
    rejectProposal,
    completeWork,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in_progress' | 'delivered' | 'completed'>('all');
  const [expandedGigId, setExpandedGigId] = useState<string | null>(null);

  // Filter client's posted gigs
  const clientGigs = gigs.filter((g) => g.clientId === currentUser?.id);

  const filteredGigs = clientGigs.filter((g) => {
    if (activeTab === 'all') return true;
    return g.status === activeTab;
  });

  const totalProposalsReceived = proposals.filter((p) =>
    clientGigs.some((g) => g.id === p.gigId)
  ).length;

  const activeContractsCount = clientGigs.filter((g) => g.status === 'in_progress' || g.status === 'delivered').length;
  const completedJobsCount = clientGigs.filter((g) => g.status === 'completed').length;

  const clientUser = users.find((u) => u.role === 'client');

  const toggleExpand = (gigId: string) => {
    setExpandedGigId(expandedGigId === gigId ? null : gigId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Role Notice if not Client */}
      {currentUser?.role !== 'client' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              You are currently viewing as <strong>{currentUser?.name || 'Guest'}</strong> ({currentUser?.role}). Switch to Client to manage gigs and accept bids.
            </span>
          </div>
          {clientUser && (
            <button
              onClick={() => switchUser(clientUser.id)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors shrink-0"
            >
              Switch to {clientUser.name} (Client)
            </button>
          )}
        </div>
      )}

      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Hub & Gig Manager</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your job postings, evaluate freelancer bids, and manage contract approvals.
          </p>
        </div>

        {currentUser?.role === 'client' && (
          <button
            onClick={onOpenPostGig}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post a New Gig</span>
          </button>
        )}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Gigs Posted</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {clientGigs.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Bids & Proposals Received</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {totalProposalsReceived}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active In-Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {activeContractsCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {completedJobsCount}
          </p>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
        {(['all', 'open', 'in_progress', 'delivered', 'completed'] as const).map((tab) => {
          const count = tab === 'all'
            ? clientGigs.length
            : clientGigs.filter((g) => g.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="capitalize">{tab.replace('_', ' ')}</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posted Gigs List */}
      {filteredGigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No gigs in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any jobs matching the "{activeTab}" filter.
          </p>
          {currentUser?.role === 'client' && (
            <button
              onClick={onOpenPostGig}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Your First Job</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGigs.map((gig) => {
            const gigProps = proposals.filter((p) => p.gigId === gig.id);
            const isExpanded = expandedGigId === gig.id;
            const existingRev = reviews.find((r) => r.gigId === gig.id);

            return (
              <div
                key={gig.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
              >
                {/* Gig Row Summary */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase">
                        {gig.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        Deadline: {new Date(gig.deadline).toLocaleDateString()}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                        gig.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700'
                          : gig.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700'
                          : gig.status === 'delivered'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {gig.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectGig(gig)}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                    >
                      {gig.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>
                        Budget: <strong className="font-mono text-slate-800">${gig.minBudget} – ${gig.maxBudget}</strong>
                      </span>
                      {gig.assignedFreelancerName && (
                        <span>
                          Assigned: <strong className="text-indigo-600">{gig.assignedFreelancerName}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions on this gig */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* If delivered, show Complete button */}
                    {gig.status === 'delivered' && (
                      <button
                        onClick={() => completeWork(gig.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Work</span>
                      </button>
                    )}

                    {/* If completed, show review button */}
                    {gig.status === 'completed' && !existingRev && (
                      <button
                        onClick={() => onOpenReview(gig)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Rate Freelancer</span>
                      </button>
                    )}

                    {/* View Proposals Toggle */}
                    <button
                      onClick={() => toggleExpand(gig.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                        isExpanded
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Bids ({gigProps.length})</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Proposals Drawer */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold text-slate-800">
                        Proposals for this Gig ({gigProps.length})
                      </h4>
                      <span className="text-slate-500 text-[11px]">
                        Review pricing & estimated days
                      </span>
                    </div>

                    {gigProps.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No proposals have been submitted for this gig yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {gigProps.map((p) => {
                          const isAccepted = p.status === 'accepted';
                          const isRejected = p.status === 'rejected';

                          return (
                            <div
                              key={p.id}
                              className={`p-3.5 rounded-lg border bg-white ${
                                isAccepted
                                  ? 'border-emerald-400 bg-emerald-50/40'
                                  : isRejected
                                  ? 'border-slate-200 opacity-60'
                                  : 'border-slate-200 shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={p.freelancerAvatar}
                                    alt={p.freelancerName}
                                    referrerPolicy="no-referrer"
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{p.freelancerName}</p>
                                    <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{p.freelancerTitle}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                                    ${p.proposedPrice}
                                  </p>
                                  <p className="text-[10px] text-slate-500">{p.deliveryDays} days</p>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2 rounded border border-slate-100 mb-2">
                                {p.coverLetter}
                              </p>

                              <div className="flex items-center justify-between pt-1">
                                <span className={`text-[10px] font-bold uppercase ${
                                  isAccepted
                                    ? 'text-emerald-700'
                                    : isRejected
                                    ? 'text-rose-600'
                                    : 'text-amber-600'
                                }`}>
                                  Status: {p.status}
                                </span>

                                {gig.status === 'open' && p.status === 'pending' && (
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => rejectProposal(p.id)}
                                      className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      onClick={() => acceptProposal(p.id, gig.id)}
                                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 shadow-sm"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Accept Bid</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};
