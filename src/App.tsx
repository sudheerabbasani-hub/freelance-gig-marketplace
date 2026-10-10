import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrowseGigs } from './components/BrowseGigs';
import { ClientDashboard } from './components/ClientDashboard';
import { FreelancerDashboard } from './components/FreelancerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { GigCard } from './components/GigCard';
import { GigDetailModal } from './components/GigDetailModal';
import { PostGigModal } from './components/PostGigModal';
import { SubmitProposalModal } from './components/SubmitProposalModal';
import { ReviewModal } from './components/ReviewModal';
import { BackendDocsModal } from './components/BackendDocsModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { Gig } from './types';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Briefcase, 
  Zap, 
  Layers 
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    gigs,
    activeView,
    setActiveView,
    selectedGigId,
    setSelectedGigId,
    setSelectedCategory,
  } = useApp();

  const [isPostGigOpen, setIsPostGigOpen] = useState(false);
  const [isBackendDocsOpen, setIsBackendDocsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [proposalGig, setProposalGig] = useState<Gig | null>(null);
  const [reviewGig, setReviewGig] = useState<Gig | null>(null);

  const selectedGig = gigs.find((g) => g.id === selectedGigId) || null;

  const handleSelectGig = (gig: Gig) => {
    setSelectedGigId(gig.id);
  };

  const handleOpenSubmitProposal = (gig: Gig) => {
    setProposalGig(gig);
  };

  const handleOpenReview = (gig: Gig) => {
    setReviewGig(gig);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        onOpenPostGig={() => setIsPostGigOpen(true)}
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <Hero
              onOpenPostGig={() => setIsPostGigOpen(true)}
              onExploreClick={() => {
                const element = document.getElementById('featured-gigs-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Featured Gigs Section */}
            <section id="featured-gigs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Market Feed</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Featured Opportunities
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Handpicked high-intent client gigs ready for competitive proposals.
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('browse')}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Explore All {gigs.length} Gigs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid of featured gigs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.slice(0, 6).map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onSelect={handleSelectGig}
                    onApply={handleOpenSubmitProposal}
                  />
                ))}
              </div>
            </section>

            {/* Popular Categories Bento Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-10 bg-slate-900 rounded-3xl text-white border border-slate-800 shadow-xl space-y-8">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Specialized Verticals
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Hire by Technical Domain
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Browse top developers, system architects, and designers vetted for rapid execution.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Web Development', count: 'React, Next.js, Node', jobs: '24 Openings' },
                    { title: 'AI & Machine Learning', count: 'LLMs, PyTorch, RAG', jobs: '18 Openings' },
                    { title: 'UI/UX Design', count: 'Figma, Design Systems', jobs: '15 Openings' },
                    { title: 'DevOps & Cloud', count: 'Kubernetes, AWS, CI/CD', jobs: '12 Openings' },
                  ].map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat.title);
                        setActiveView('browse');
                      }}
                      className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer transition-all hover:-translate-y-1 group"
                    >
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {cat.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{cat.count}</p>
                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                        <span>{cat.jobs}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Platform Integrity & Workflow Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Compound Index Protection</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero duplicate proposals per freelancer/gig enforced directly at the MongoDB database level with compound index <code className="font-mono text-indigo-700 bg-slate-100 px-1 py-0.5 rounded">{`{ gigId, freelancerId }`}</code>.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Atomic Acceptance Workflow</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When a client accepts one proposal, all competing bids are atomically marked rejected and the gig transitions immediately into In Progress status.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Verified Milestone Ratings</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Clients can only rate and review freelancers once deliverables are approved and marked completed, ensuring 100% authentic social proof.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === 'browse' && (
          <BrowseGigs
            onSelectGig={handleSelectGig}
            onOpenSubmitProposal={handleOpenSubmitProposal}
          />
        )}

        {activeView === 'client-dashboard' && (
          <ClientDashboard
            onOpenPostGig={() => setIsPostGigOpen(true)}
            onSelectGig={handleSelectGig}
            onOpenReview={handleOpenReview}
          />
        )}

        {activeView === 'freelancer-dashboard' && (
          <FreelancerDashboard
            onSelectGig={handleSelectGig}
          />
        )}

        {activeView === 'admin-panel' && (
          <AdminPanel
            onSelectGig={handleSelectGig}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenBackendDocs={() => setIsBackendDocsOpen(true)} />

      {/* Modals */}
      {selectedGig && (
        <GigDetailModal
          gig={selectedGig}
          onClose={() => setSelectedGigId(null)}
          onOpenSubmitProposal={(g) => {
            setSelectedGigId(null);
            setProposalGig(g);
          }}
          onOpenReview={(g) => {
            setSelectedGigId(null);
            setReviewGig(g);
          }}
        />
      )}

      {isPostGigOpen && (
        <PostGigModal onClose={() => setIsPostGigOpen(false)} />
      )}

      {proposalGig && (
        <SubmitProposalModal
          gig={proposalGig}
          onClose={() => setProposalGig(null)}
        />
      )}

      {reviewGig && (
        <ReviewModal
          gig={reviewGig}
          onClose={() => setReviewGig(null)}
        />
      )}

      {isBackendDocsOpen && (
        <BackendDocsModal onClose={() => setIsBackendDocsOpen(false)} />
      )}

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}

      {/* Toast feedback notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
