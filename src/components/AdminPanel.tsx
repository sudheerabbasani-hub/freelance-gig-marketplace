import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gig, User } from '../types';
import { 
  ShieldCheck, 
  Trash2, 
  UserX, 
  UserCheck, 
  AlertCircle, 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Search,
  ExternalLink
} from 'lucide-react';

interface AdminPanelProps {
  onSelectGig: (gig: Gig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSelectGig }) => {
  const {
    currentUser,
    users,
    gigs,
    proposals,
    reviews,
    switchUser,
    deleteGig,
    toggleBlockUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'gigs' | 'users'>('gigs');
  const [searchTerm, setSearchTerm] = useState('');

  const adminUser = users.find((u) => u.role === 'admin');

  // Filtered gigs for admin table
  const filteredGigs = gigs.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered users for admin table
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Notice if not Admin */}
      {currentUser?.role !== 'admin' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              You are currently viewing as <strong>{currentUser?.name || 'Guest'}</strong> ({currentUser?.role}). Moderate gigs and manage platform accounts using the Admin role.
            </span>
          </div>
          {adminUser && (
            <button
              onClick={() => switchUser(adminUser.id)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch to Admin Moderator</span>
            </button>
          )}
        </div>
      )}

      {/* Header and Platform KPIs */}
      <div>
        <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Governance & Trust</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Administrator Command Center</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Moderate inappropriate gig listings, enforce safety standards, and block fraudulent user accounts.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Registered Accounts</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {users.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Gig Postings</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {gigs.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Submitted Proposals</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {proposals.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Suspended Accounts</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {users.filter((u) => u.isBlocked).length}
          </p>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'gigs'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manage Gigs ({gigs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Moderate Users ({users.length})</span>
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tab 1: Gigs Management */}
      {activeTab === 'gigs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Gig Title & Category</th>
                  <th className="px-4 py-3.5">Posted By</th>
                  <th className="px-4 py-3.5">Budget</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Proposals</th>
                  <th className="px-4 py-3.5 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredGigs.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p
                        onClick={() => onSelectGig(g)}
                        className="font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1 max-w-md"
                      >
                        {g.title}
                      </p>
                      <p className="text-[11px] text-indigo-600 font-medium">{g.category}</p>
                    </td>

                    <td className="px-4 py-3.5 text-slate-800 font-medium">
                      {g.clientName}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-900 font-semibold tabular-nums">
                      ${g.minBudget} – ${g.maxBudget}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {g.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-600 tabular-nums">
                      {g.proposalsCount}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => deleteGig(g.id)}
                        className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded transition-colors inline-flex items-center gap-1"
                        title="Remove inappropriate gig"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">User Profile</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Rating / Activity</th>
                  <th className="px-4 py-3.5">Account Status</th>
                  <th className="px-4 py-3.5 text-right">Safety Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => {
                  const isBlocked = !!u.isBlocked;
                  const isSelf = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.title || 'Marketplace Member'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600">
                        {u.email}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'client'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600 tabular-nums">
                        {u.rating ? `${u.rating.toFixed(1)} ★` : '—'}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                          isBlocked
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {u.role === 'admin' ? (
                          <span className="text-[11px] text-slate-400 font-mono">Protected</span>
                        ) : (
                          <button
                            onClick={() => toggleBlockUser(u.id)}
                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors inline-flex items-center gap-1 ${
                              isBlocked
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Block User</span>
                              </>
                            )}
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
  );
};
