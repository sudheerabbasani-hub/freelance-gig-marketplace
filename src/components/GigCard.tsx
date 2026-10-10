import React from 'react';
import { Gig } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, DollarSign, Star, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
  onSelect: (gig: Gig) => void;
  onApply?: (gig: Gig) => void;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onSelect, onApply }) => {
  const { currentUser } = useApp();

  const isOwner = currentUser?.id === gig.clientId;
  const isAssigned = currentUser?.id === gig.assignedFreelancerId;

  // Format date helper
  const formattedDeadline = new Date(gig.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Status visual indicator helper
  const getStatusBadge = () => {
    switch (gig.status) {
      case 'open':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
            Open for Bids
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
            In Progress
          </span>
        );
      case 'delivered':
        return (
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded">
            Delivered
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar of card: Category and Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            {gig.category}
          </span>
          {getStatusBadge()}
        </div>

        {/* Gig Title */}
        <h3
          onClick={() => onSelect(gig)}
          className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 mb-2 leading-snug"
        >
          {gig.title}
        </h3>

        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mb-3">
          <span className="font-medium text-slate-700">{gig.clientName}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-mono">{gig.clientRating.toFixed(1)}</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Due {formattedDeadline}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {gig.description}
        </p>

        {/* Required Skills tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {gig.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer Section: Budget, Proposal count, Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Budget Range</p>
          <p className="font-mono text-base font-bold text-slate-900 tabular-nums">
            ${gig.minBudget.toLocaleString()} – ${gig.maxBudget.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <button
              onClick={() => onSelect(gig)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Proposals ({gig.proposalsCount})</span>
            </button>
          ) : isAssigned ? (
            <button
              onClick={() => onSelect(gig)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assigned to You</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(gig)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
