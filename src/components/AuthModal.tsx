import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, LogIn, UserPlus, Shield, User, Briefcase, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { loginUser, registerUser, users, switchUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      registerUser({
        name,
        email,
        role,
        title: title || (role === 'client' ? 'Client' : 'Freelancer'),
      });
      onClose();
    } else {
      const ok = loginUser(email, 'client');
      if (ok) {
        onClose();
      } else {
        setError('Login failed. Please check credentials or switch to a demo account.');
      }
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              {mode === 'login' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {mode === 'login' ? 'Sign in to GigConnect' : 'Create GigConnect Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 mx-6 mt-5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Account Role *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      role === 'client'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Client</p>
                      <p className="text-[10px] text-slate-500">Post jobs & hire</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('freelancer')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      role === 'freelancer'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Freelancer</p>
                      <p className="text-[10px] text-slate-500">Bid & deliver work</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional Title / Tagline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={role === 'client' ? 'e.g. Founder @ FinTech' : 'e.g. Full-Stack React Engineer'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Quick Demo Switcher Strip for Demo Evaluators */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Or quick login with demo role:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {users.slice(0, 3).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u.id)}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors"
              >
                <p className="text-[11px] font-bold text-slate-900 truncate">{u.name.split(' ')[0]}</p>
                <p className="text-[9px] font-semibold uppercase text-indigo-600">{u.role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
