import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig, GigCategory } from '../types';
import { GigCard } from './GigCard';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Briefcase, 
  DollarSign, 
  Layers,
  CheckCircle2
} from 'lucide-react';

interface BrowseGigsProps {
  onSelectGig: (gig: Gig) => void;
  onOpenSubmitProposal: (gig: Gig) => void;
}

export const BrowseGigs: React.FC<BrowseGigsProps> = ({
  onSelectGig,
  onOpenSubmitProposal,
}) => {
  const {
    gigs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    budgetFilter,
    setBudgetFilter,
  } = useApp();

  const [onlyOpen, setOnlyOpen] = useState(false);
  const [minBudgetInput, setMinBudgetInput] = useState(String(budgetFilter.min));
  const [maxBudgetInput, setMaxBudgetInput] = useState(String(budgetFilter.max));

  const categories: (string | GigCategory)[] = [
    'All',
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'AI & Machine Learning',
    'DevOps & Cloud',
    'Content & Copywriting',
    'Data Analytics',
  ];

  // Filtering logic
  const filteredGigs = gigs.filter((gig) => {
    // Keyword filter (title, description, required skills, clientName)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = gig.title.toLowerCase().includes(q);
      const matchDesc = gig.description.toLowerCase().includes(q);
      const matchClient = gig.clientName.toLowerCase().includes(q);
      const matchSkills = gig.requiredSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchClient && !matchSkills) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && gig.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (onlyOpen && gig.status !== 'open') {
      return false;
    }

    if (statusFilter !== 'all' && gig.status !== statusFilter) {
      return false;
    }

    // Budget range filter
    const minB = Number(minBudgetInput) || 0;
    const maxB = Number(maxBudgetInput) || 99999;
    if (gig.maxBudget < minB) return false;
    if (gig.minBudget > maxB) return false;

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStatusFilter('all');
    setOnlyOpen(false);
    setMinBudgetInput('0');
    setMaxBudgetInput('5000');
    setBudgetFilter({ min: 0, max: 5000 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Browse Freelance Gigs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified jobs across web development, mobile apps, UI/UX design, and AI.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={(e) => setOnlyOpen(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Open Gigs Only</span>
          </label>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by keyword, framework, or skill (e.g. Next.js, Figma, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range Inputs */}
          <div className="md:col-span-3 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-[10px] text-slate-400">$</span>
              <input
                type="number"
                placeholder="Min"
                value={minBudgetInput}
                onChange={(e) => setMinBudgetInput(e.target.value)}
                className="w-full text-xs pl-5 pr-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <span className="text-slate-400 text-xs">–</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-[10px] text-slate-400">$</span>
              <input
                type="number"
                placeholder="Max"
                value={maxBudgetInput}
                onChange={(e) => setMaxBudgetInput(e.target.value)}
                className="w-full text-xs pl-5 pr-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <button
              onClick={handleResetFilters}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="font-mono text-slate-800 tabular-nums">{filteredGigs.length}</strong> available gig{filteredGigs.length === 1 ? '' : 's'}
        </span>
        {searchQuery && (
          <span>Filtered by "{searchQuery}"</span>
        )}
      </div>

      {/* Gigs Grid */}
      {filteredGigs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching gigs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, budget limits, or category selection to find available jobs.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onSelect={onSelectGig}
              onApply={onOpenSubmitProposal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
