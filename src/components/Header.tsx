import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import { 
  Briefcase, 
  ChevronDown, 
  Plus, 
  UserCheck, 
  RotateCcw, 
  Code2, 
  ShieldCheck, 
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  onOpenPostGig: () => void;
  onOpenBackendDocs: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPostGig,
  onOpenBackendDocs,
  onOpenAuth,
}) => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logout, 
    activeView, 
    setActiveView, 
    resetDemoData 
  } = useApp();

  const [isSwitchOpen, setIsSwitchOpen] = useState(false);

  const navItems: { label: string; view: ActiveView }[] = [
    { label: 'Browse Gigs', view: 'browse' },
    { label: 'Client Hub', view: 'client-dashboard' },
    { label: 'Freelancer Studio', view: 'freelancer-dashboard' },
    { label: 'Admin Panel', view: 'admin-panel' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-md"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-inner group-hover:bg-indigo-500 transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                GigConnect
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view)}
                  className={`whitespace-nowrap transition-colors py-1 relative ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
            <button
              onClick={onOpenBackendDocs}
              className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 whitespace-nowrap"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Backend & DB Specs</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Account Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser && currentUser.role === 'client' && (
              <button
                onClick={onOpenPostGig}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </button>
            )}

            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSwitchOpen(!isSwitchOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors text-slate-200"
                title="Switch Demo Role for Presentation"
              >
                {currentUser ? (
                  <>
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-slate-600"
                    />
                    <span className="font-semibold text-white max-w-[100px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-700 text-indigo-300">
                      {currentUser.role}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-300">Select Role</span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isSwitchOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsSwitchOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 text-xs">
                    <p className="font-semibold text-slate-900">Switch Demo Role</p>
                    <p className="text-slate-500 text-[11px]">Instant switch for college hackathon demo:</p>
                  </div>

                  <div className="py-1 max-h-60 overflow-y-auto">
                    {users.map((u) => {
                      const isSelected = currentUser?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => switchUser(u.id)}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-indigo-50/70 font-medium' : ''
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-900 truncate">{u.name}</p>
                              <span className="text-[10px] font-semibold uppercase text-slate-500">
                                {u.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{u.title || u.email}</p>
                          </div>
                          {isSelected && <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 p-2 space-y-1">
                    <button
                      onClick={onOpenAuth}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                      <span>Custom Register / Login</span>
                    </button>
                    <button
                      onClick={resetDemoData}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nav Button */}
            <button
              onClick={() => setActiveView(activeView === 'browse' ? 'home' : 'browse')}
              className="md:hidden p-2 text-slate-400 hover:text-white"
              aria-label="Toggle navigation"
            >
              <Briefcase className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
