import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GigCategory } from '../types';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface PostGigModalProps {
  onClose: () => void;
}

export const PostGigModal: React.FC<PostGigModalProps> = ({ onClose }) => {
  const { currentUser, switchUser, users, postGig } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GigCategory>('Web Development');
  const [minBudget, setMinBudget] = useState('800');
  const [maxBudget, setMaxBudget] = useState('1500');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Tailwind CSS');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [error, setError] = useState<string | null>(null);

  const categories: GigCategory[] = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'AI & Machine Learning',
    'DevOps & Cloud',
    'Content & Copywriting',
    'Data Analytics',
  ];

  // Helper: auto-switch to demo client if current user is not a client
  const clientUser = users.find((u) => u.role === 'client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || title.length < 5) {
      setError('Job title must be at least 5 characters long.');
      return;
    }

    if (!description.trim() || description.length < 20) {
      setError('Description must be at least 20 characters long.');
      return;
    }

    const min = Number(minBudget);
    const max = Number(maxBudget);

    if (isNaN(min) || isNaN(max) || min <= 0) {
      setError('Budgets must be valid positive numbers.');
      return;
    }

    if (max < min) {
      setError('Maximum budget cannot be less than minimum budget.');
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setError('Please provide at least one required skill tag.');
      return;
    }

    const res = postGig({
      title,
      description,
      category,
      minBudget: min,
      maxBudget: max,
      requiredSkills: skills,
      deadline,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to post gig.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Post a New Freelance Gig</h2>
            <p className="text-xs text-slate-500">Provide job details, budget range, and required skills</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Role Guard Notice */}
        {currentUser?.role !== 'client' && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You are currently logged in as a <strong>{currentUser?.role || 'Guest'}</strong>. Only Clients can publish gigs.
              </span>
            </div>
            {clientUser && (
              <button
                type="button"
                onClick={() => switchUser(clientUser.id)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] whitespace-nowrap"
              >
                Switch to {clientUser.name} (Client)
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Interactive Next.js Financial Analytics Dashboard"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GigCategory)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Completion Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minimum Budget (USD $) *
              </label>
              <input
                type="number"
                min="5"
                required
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="500"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Maximum Budget (USD $) *
              </label>
              <input
                type="number"
                min="5"
                required
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="1200"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Skills (Comma separated) *
            </label>
            <input
              type="text"
              required
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, API Integration"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Scope & Deliverables *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe requirements, milestone expectations, technical architecture, and acceptance criteria in detail..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
              disabled={currentUser?.role !== 'client'}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Gig</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
