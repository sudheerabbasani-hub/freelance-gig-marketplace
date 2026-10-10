import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Server, 
  Shield, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  KeyRound, 
  Code2, 
  FileCode2 
} from 'lucide-react';

interface BackendDocsModalProps {
  onClose: () => void;
}

export const BackendDocsModal: React.FC<BackendDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schemas' | 'api' | 'setup'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const schemaExampleCode = `// backend/models/Proposal.js
const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
    index: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  freelancerName: { type: String, required: true },
  freelancerAvatar: { type: String, default: '' },
  freelancerTitle: { type: String, default: '' },
  freelancerRating: { type: Number, default: 5.0 },
  coverLetter: { type: String, required: true, minlength: 20 },
  proposedPrice: { type: Number, required: true, min: 5 },
  deliveryDays: { type: Number, required: true, min: 1, max: 365 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    index: true
  }
}, { timestamps: true });

// CRITICAL UNIQUE COMPOUND INDEX:
// Prevents duplicate proposals from the same freelancer for the same gig:
proposalSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);`;

  const acceptWorkflowCode = `// backend/routes/proposals.js -> PATCH /:id/accept
router.patch('/:id/accept', protect, async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);
  const gig = await Gig.findById(proposal.gigId);

  // Validate only the client owner can accept
  if (gig.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  // 1. Mark accepted proposal
  proposal.status = 'accepted';
  await proposal.save();

  // 2. Automatically mark other proposals for this gig as rejected
  await Proposal.updateMany(
    { gigId: gig._id, _id: { $ne: proposal._id } },
    { $set: { status: 'rejected' } }
  );

  // 3. Update gig status to in_progress
  gig.status = 'in_progress';
  gig.acceptedProposalId = proposal._id;
  gig.assignedFreelancerId = proposal.freelancerId;
  gig.assignedFreelancerName = proposal.freelancerName;
  await gig.save();

  res.json({ success: true, message: 'Accepted and assigned' });
});`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Node.js + Express + MongoDB Architecture</h2>
              <p className="text-xs text-slate-300">Hackathon Technical Deliverable & DB Specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('schemas')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'schemas'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Mongoose Schemas</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>REST API Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'setup'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Local Setup Guide</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 space-y-1">
                <h4 className="font-bold text-sm">Full-Stack Hackathon Project Layout</h4>
                <p className="leading-relaxed">
                  The project is structured with a decoupled frontend (React + Tailwind CSS) and a production-grade Node.js/Express backend running Mongoose with role-based access control.
                </p>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                <pre>{`gigconnect/
├── backend/                  # Node.js & Express REST Backend
│   ├── models/
│   │   ├── User.js          # Password hashing, roles (client, freelancer, admin)
│   │   ├── Gig.js           # Category enums, min/max budgets, text search index
│   │   ├── Proposal.js      # UNIQUE COMPOUND INDEX: { gigId: 1, freelancerId: 1 }
│   │   └── Review.js        # 1-5 star ratings, feedback, client verification
│   ├── middleware/
│   │   └── auth.js          # JWT Bearer token authentication & RBAC check
│   ├── routes/
│   │   ├── auth.js          # Register, Login (bcrypt), Me profile
│   │   ├── gigs.js          # CRUD, keyword search, deliver, complete
│   │   ├── proposals.js     # Submit, list, atomic accept (rejects others)
│   │   ├── reviews.js       # Verified review creation and rating calculation
│   │   └── admin.js         # Platform moderation, user block/unblock, metrics
│   ├── .env.example         # MongoDB URI and JWT Secret
│   ├── package.json         # express, mongoose, bcryptjs, jsonwebtoken, cors
│   ├── server.js            # Express server entry point & MongoDB connection
│   └── README.md            # Technical documentation and curl examples
├── src/                      # React 19 Frontend SPA
│   ├── components/          # Reusable UI components (Zero-pill design)
│   ├── context/             # AppContext (LocalStorage sync & reactive state)
│   ├── types/               # TypeScript models
│   └── data/                # Realistic seed datasets
└── package.json             # Root application setup`}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: MONGOOSE SCHEMAS */}
          {activeTab === 'schemas' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-sm">
                    1. Proposal Schema with Compound Unique Index
                  </h4>
                  <button
                    onClick={() => copyToClipboard(schemaExampleCode, 'schema')}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800"
                  >
                    {copiedCode === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'schema' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <pre>{schemaExampleCode}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-sm">
                    2. Atomic Acceptance Workflow & Status Transition
                  </h4>
                  <button
                    onClick={() => copyToClipboard(acceptWorkflowCode, 'workflow')}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800"
                  >
                    {copiedCode === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'workflow' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <pre>{acceptWorkflowCode}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REST API ENDPOINTS */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">GigConnect REST API Specification</h4>
              
              <div className="space-y-2">
                {[
                  { method: 'POST', path: '/api/auth/register', auth: 'Public', desc: 'Register as Client or Freelancer' },
                  { method: 'POST', path: '/api/auth/login', auth: 'Public', desc: 'Login with email/password, returns JWT token' },
                  { method: 'GET', path: '/api/auth/me', auth: 'Bearer JWT', desc: 'Get current user profile and session' },
                  { method: 'GET', path: '/api/gigs', auth: 'Public', desc: 'Search & filter gigs by keyword, category, status, budget' },
                  { method: 'POST', path: '/api/gigs', auth: 'Client', desc: 'Create a new freelance gig with budget and deadline' },
                  { method: 'POST', path: '/api/proposals', auth: 'Freelancer', desc: 'Submit a proposal (Protected by compound unique index)' },
                  { method: 'GET', path: '/api/proposals/gig/:id', auth: 'Client Owner', desc: 'List bids received for the client\'s gig' },
                  { method: 'PATCH', path: '/api/proposals/:id/accept', auth: 'Client Owner', desc: 'Accept proposal, reject rivals, set In Progress' },
                  { method: 'PATCH', path: '/api/gigs/:id/deliver', auth: 'Freelancer', desc: 'Assigned freelancer submits deliverable notes' },
                  { method: 'PATCH', path: '/api/gigs/:id/complete', auth: 'Client Owner', desc: 'Client marks project Completed' },
                  { method: 'POST', path: '/api/reviews', auth: 'Client Owner', desc: 'Rate (1-5) and review freelancer on completed gig' },
                  { method: 'GET', path: '/api/admin/stats', auth: 'Admin', desc: 'Platform health and activity metrics' },
                  { method: 'PATCH', path: '/api/admin/users/:id/toggle-block', auth: 'Admin', desc: 'Block or unblock user account' },
                ].map((ep, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                        ep.method === 'POST'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ep.method === 'PATCH'
                          ? 'bg-amber-100 text-amber-800'
                          : ep.method === 'DELETE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="font-mono text-slate-800 font-semibold">{ep.path}</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 hidden sm:inline">{ep.desc}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {ep.auth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETUP GUIDE */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Step-by-Step Local Run Instructions</h4>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="font-semibold text-slate-900">1. Install Backend Dependencies:</p>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
                  cd backend && npm install
                </div>

                <p className="font-semibold text-slate-900 mt-3">2. Configure Environment Variables:</p>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
                  cp .env.example .env
                </div>
                <p className="text-slate-500 text-[11px]">
                  Ensure MongoDB is running locally (e.g. <code>mongodb://localhost:27017/gigconnect</code>) or paste your MongoDB Atlas connection string into <code>MONGO_URI</code>.
                </p>

                <p className="font-semibold text-slate-900 mt-3">3. Start the Express Backend:</p>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
                  npm start  # Runs server on http://localhost:5000
                </div>

                <p className="font-semibold text-slate-900 mt-3">4. Connect Frontend to API:</p>
                <p className="text-slate-600 text-[11px]">
                  In your React application, set <code>VITE_API_BASE_URL=http://localhost:5000/api</code> and pass the JWT token in standard <code>Authorization: Bearer &lt;token&gt;</code> headers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Source files created inside <code>/backend</code> directory
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
