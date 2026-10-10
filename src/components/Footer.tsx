import React from 'react';
import { Briefcase, Code2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBackendDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBackendDocs }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">GigConnect</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Freelance Gig Marketplace Platform</span>
          </div>

          <div className="flex items-center gap-6 text-slate-300">
            <button
              onClick={onOpenBackendDocs}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full-Stack Architecture & Schemas</span>
            </button>
            <span>College Hackathon Edition</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} GigConnect. Built with React, Node.js, Express, and MongoDB.
          </p>
          <p className="flex items-center gap-1">
            Protected by compound unique index & role-based access control.
          </p>
        </div>
      </div>
    </footer>
  );
};
