import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/hero_freelance_collaboration_1791609719824.jpg';

interface HeroProps {
  onOpenPostGig: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPostGig, onExploreClick }) => {
  const { searchQuery, setSearchQuery, setSelectedCategory, setActiveView, currentUser } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const popularCategories = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'AI & Machine Learning',
    'DevOps & Cloud',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setActiveView('browse');
    onExploreClick();
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('browse');
    onExploreClick();
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-900 to-slate-900 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Description, Search & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen College Hackathon Freelance Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              Where ambitious clients hire verified technical freelancers.
            </h1>

            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Post freelance jobs with clear budgets and deadlines. Review competitive proposals, hire verified talent, and manage milestone delivery seamlessly.
            </p>

            {/* Functional Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 p-1.5 bg-slate-800/90 rounded-xl border border-slate-700 shadow-xl max-w-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search gigs by skill, keyword, or role (e.g. Next.js, Figma, PyTorch)..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Popular Category Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Popular:</span>
              {popularCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="px-2.5 py-1 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-md transition-colors whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveView('browse');
                  onExploreClick();
                }}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-semibold shadow-md transition-colors flex items-center gap-2"
              >
                <span>Browse Open Gigs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onOpenPostGig}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {currentUser?.role === 'client' ? 'Post a New Gig' : 'Post as Client'}
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset with styled fallback */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 aspect-[16/10] group">
              <img
                src={heroImage}
                alt="Freelance workspace collaboration dashboard"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback container if local asset failed to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              
              {/* Overlay highlight badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Unique Compound Index Protection</p>
                    <p className="text-[11px] text-slate-400">Zero duplicate proposals · Atomic accept workflow</p>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums text-xs">
                  100% Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-10 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-white tabular-nums">{"< 4 Hours"}</p>
              <p className="text-xs text-slate-400">Median Proposal Response Time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-white tabular-nums">100% Escrow</p>
              <p className="text-xs text-slate-400">Guaranteed Milestones & Reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-white tabular-nums">4.92 / 5.0</p>
              <p className="text-xs text-slate-400">Average Freelancer Delivery Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
