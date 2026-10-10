import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Gig, Proposal, Review, ActiveView, GigCategory, GigStatus } from '../types';
import { INITIAL_USERS, INITIAL_GIGS, INITIAL_PROPOSALS, INITIAL_REVIEWS } from '../data/mockData';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  gigs: Gig[];
  proposals: Proposal[];
  reviews: Review[];
  activeView: ActiveView;
  selectedGigId: string | null;
  toasts: ToastNotification[];
  searchQuery: string;
  selectedCategory: string;
  statusFilter: string;
  budgetFilter: { min: number; max: number };
  
  // Navigation & View Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedGigId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setBudgetFilter: (range: { min: number; max: number }) => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  
  // Auth Actions
  switchUser: (userId: string) => void;
  loginUser: (email: string, role: 'client' | 'freelancer' | 'admin') => boolean;
  registerUser: (data: { name: string; email: string; role: 'client' | 'freelancer'; title?: string }) => User;
  logout: () => void;
  
  // Gig Actions
  postGig: (gigData: {
    title: string;
    description: string;
    category: GigCategory;
    minBudget: number;
    maxBudget: number;
    requiredSkills: string[];
    deadline: string;
  }) => { success: boolean; gigId?: string; error?: string };
  deleteGig: (gigId: string) => void;
  
  // Proposal Actions
  submitProposal: (data: {
    gigId: string;
    coverLetter: string;
    proposedPrice: number;
    deliveryDays: number;
  }) => { success: boolean; error?: string };
  acceptProposal: (proposalId: string, gigId: string) => void;
  rejectProposal: (proposalId: string) => void;
  
  // Workflow Actions
  deliverWork: (gigId: string, notes: string) => void;
  completeWork: (gigId: string) => void;
  
  // Review Actions
  submitReview: (data: {
    gigId: string;
    freelancerId: string;
    rating: number;
    comment: string;
  }) => void;
  
  // Admin Actions
  toggleBlockUser: (userId: string) => void;
  
  // Demo Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'gigconnect_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user`);
    if (saved) return JSON.parse(saved);
    // Default to Sarah Jenkins (client) for initial rich walkthrough
    return INITIAL_USERS[0];
  });

  const [gigs, setGigs] = useState<Gig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}gigs`);
    return saved ? JSON.parse(saved) : INITIAL_GIGS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}proposals`);
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}gigs`, JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}proposals`, JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}reviews`, JSON.stringify(reviews));
  }, [reviews]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      if (found.isBlocked) {
        addToast('error', `Cannot switch to ${found.name}: Account is blocked by Admin.`);
        return;
      }
      setCurrentUser(found);
      addToast('info', `Switched active session to ${found.name} (${found.role.toUpperCase()})`);
    }
  };

  const loginUser = (email: string, role: 'client' | 'freelancer' | 'admin'): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.isBlocked) {
        addToast('error', 'This account has been suspended by the platform administrator.');
        return false;
      }
      setCurrentUser(existing);
      addToast('success', `Welcome back, ${existing.name}!`);
      return true;
    }
    // Auto-create demo user if not found
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast('success', `Account created successfully for ${newUser.name}!`);
    return true;
  };

  const registerUser = (data: { name: string; email: string; role: 'client' | 'freelancer'; title?: string }): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      title: data.title || (data.role === 'client' ? 'Independent Client' : 'Freelance Specialist'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast('success', `Registered successfully as ${data.name} (${data.role})!`);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('info', 'Logged out of session.');
  };

  const postGig = (gigData: {
    title: string;
    description: string;
    category: GigCategory;
    minBudget: number;
    maxBudget: number;
    requiredSkills: string[];
    deadline: string;
  }) => {
    if (!currentUser) {
      addToast('error', 'Please log in to post a job.');
      return { success: false, error: 'User not logged in' };
    }
    if (currentUser.role !== 'client') {
      addToast('error', 'Only Client accounts are authorized to post freelance gigs.');
      return { success: false, error: 'Unauthorized role' };
    }

    const newGig: Gig = {
      id: `gig-${Date.now()}`,
      title: gigData.title.trim(),
      description: gigData.description.trim(),
      category: gigData.category,
      minBudget: Number(gigData.minBudget),
      maxBudget: Number(gigData.maxBudget),
      requiredSkills: gigData.requiredSkills,
      deadline: gigData.deadline,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      clientRating: currentUser.rating || 5.0,
      status: 'open',
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setGigs((prev) => [newGig, ...prev]);
    addToast('success', `Gig "${newGig.title}" published successfully!`);
    return { success: true, gigId: newGig.id };
  };

  const deleteGig = (gigId: string) => {
    const gig = gigs.find((g) => g.id === gigId);
    if (!gig) return;

    // Check authorization: Owner client or Admin
    if (currentUser?.role !== 'admin' && currentUser?.id !== gig.clientId) {
      addToast('error', 'You do not have permission to delete this gig.');
      return;
    }

    setGigs((prev) => prev.filter((g) => g.id !== gigId));
    setProposals((prev) => prev.filter((p) => p.gigId !== gigId));
    if (selectedGigId === gigId) setSelectedGigId(null);
    addToast('info', `Gig "${gig.title}" removed.`);
  };

  const submitProposal = (data: {
    gigId: string;
    coverLetter: string;
    proposedPrice: number;
    deliveryDays: number;
  }) => {
    if (!currentUser) {
      addToast('error', 'Please log in to submit a proposal.');
      return { success: false, error: 'Not authenticated' };
    }
    if (currentUser.role !== 'freelancer') {
      addToast('error', 'Only Freelancers can submit proposals for gigs.');
      return { success: false, error: 'Unauthorized role' };
    }

    const gig = gigs.find((g) => g.id === data.gigId);
    if (!gig) {
      addToast('error', 'Gig not found.');
      return { success: false, error: 'Gig not found' };
    }
    if (gig.status !== 'open') {
      addToast('error', 'This gig is no longer accepting new proposals.');
      return { success: false, error: 'Gig not open' };
    }

    // Compound unique index rule: prevent duplicate proposal by same freelancer on this gig
    const existing = proposals.find(
      (p) => p.gigId === data.gigId && p.freelancerId === currentUser.id
    );
    if (existing) {
      addToast('error', 'You have already submitted a proposal for this gig!');
      return { success: false, error: 'Duplicate proposal rejected by unique index { gigId, freelancerId }' };
    }

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      gigId: data.gigId,
      gigTitle: gig.title,
      freelancerId: currentUser.id,
      freelancerName: currentUser.name,
      freelancerAvatar: currentUser.avatar,
      freelancerTitle: currentUser.title || 'Freelance Specialist',
      freelancerRating: currentUser.rating || 5.0,
      coverLetter: data.coverLetter.trim(),
      proposedPrice: Number(data.proposedPrice),
      deliveryDays: Number(data.deliveryDays),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setProposals((prev) => [newProposal, ...prev]);
    // Increment proposals count on gig
    setGigs((prev) =>
      prev.map((g) => (g.id === data.gigId ? { ...g, proposalsCount: g.proposalsCount + 1 } : g))
    );

    addToast('success', `Proposal submitted successfully ($${newProposal.proposedPrice} in ${newProposal.deliveryDays}d)!`);
    return { success: true };
  };

  const acceptProposal = (proposalId: string, gigId: string) => {
    const gig = gigs.find((g) => g.id === gigId);
    if (!gig) return;

    if (currentUser?.id !== gig.clientId && currentUser?.role !== 'admin') {
      addToast('error', 'Only the client who posted this gig can accept proposals.');
      return;
    }

    const targetProposal = proposals.find((p) => p.id === proposalId);
    if (!targetProposal) return;

    // Workflow rule:
    // 1. Mark accepted proposal as 'accepted'
    // 2. Automatically mark all other proposals for this gig as 'rejected'
    // 3. Change gig status to 'in_progress' and bind assigned freelancer
    setProposals((prev) =>
      prev.map((p) => {
        if (p.gigId === gigId) {
          if (p.id === proposalId) return { ...p, status: 'accepted' };
          return { ...p, status: 'rejected' };
        }
        return p;
      })
    );

    setGigs((prev) =>
      prev.map((g) => {
        if (g.id === gigId) {
          return {
            ...g,
            status: 'in_progress' as GigStatus,
            acceptedProposalId: proposalId,
            assignedFreelancerId: targetProposal.freelancerId,
            assignedFreelancerName: targetProposal.freelancerName,
          };
        }
        return g;
      })
    );

    addToast(
      'success',
      `Proposal accepted! Freelancer ${targetProposal.freelancerName} assigned. Gig is now In Progress.`
    );
  };

  const rejectProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
    );
    addToast('info', 'Proposal marked as rejected.');
  };

  const deliverWork = (gigId: string, notes: string) => {
    const gig = gigs.find((g) => g.id === gigId);
    if (!gig) return;

    if (currentUser?.id !== gig.assignedFreelancerId && currentUser?.role !== 'admin') {
      addToast('error', 'Only the assigned freelancer can submit deliverables for this gig.');
      return;
    }

    setGigs((prev) =>
      prev.map((g) =>
        g.id === gigId
          ? {
              ...g,
              status: 'delivered' as GigStatus,
              deliveryNotes: notes.trim(),
            }
          : g
      )
    );

    addToast('success', 'Work deliverables submitted! Client notified for inspection and completion.');
  };

  const completeWork = (gigId: string) => {
    const gig = gigs.find((g) => g.id === gigId);
    if (!gig) return;

    if (currentUser?.id !== gig.clientId && currentUser?.role !== 'admin') {
      addToast('error', 'Only the client can mark this gig completed.');
      return;
    }

    setGigs((prev) =>
      prev.map((g) => (g.id === gigId ? { ...g, status: 'completed' as GigStatus } : g))
    );

    // Update freelancer's completed jobs counter
    if (gig.assignedFreelancerId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === gig.assignedFreelancerId
            ? { ...u, completedJobsCount: (u.completedJobsCount || 0) + 1 }
            : u
        )
      );
    }

    addToast('success', 'Gig marked as Completed! You can now rate and review the freelancer.');
  };

  const submitReview = (data: {
    gigId: string;
    freelancerId: string;
    rating: number;
    comment: string;
  }) => {
    if (!currentUser) return;
    const gig = gigs.find((g) => g.id === data.gigId);
    const targetFreelancer = users.find((u) => u.id === data.freelancerId);
    if (!gig || !targetFreelancer) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      gigId: data.gigId,
      gigTitle: gig.title,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      freelancerId: data.freelancerId,
      freelancerName: targetFreelancer.name,
      rating: data.rating,
      comment: data.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate average rating for freelancer
    const freelancerReviews = [...reviews.filter((r) => r.freelancerId === data.freelancerId), newReview];
    const avgRating = Number(
      (freelancerReviews.reduce((sum, r) => sum + r.rating, 0) / freelancerReviews.length).toFixed(2)
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === data.freelancerId
          ? {
              ...u,
              rating: avgRating,
              reviewsCount: freelancerReviews.length,
            }
          : u
      )
    );

    addToast('success', `Review submitted with ${data.rating} stars for ${targetFreelancer.name}!`);
  };

  const toggleBlockUser = (userId: string) => {
    if (currentUser?.role !== 'admin') {
      addToast('error', 'Admin role required to moderate users.');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
    const target = users.find((u) => u.id === userId);
    addToast('info', `User ${target?.name} status updated to ${!target?.isBlocked ? 'Blocked' : 'Active'}.`);
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}gigs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}proposals`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}reviews`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user`);
    setUsers(INITIAL_USERS);
    setGigs(INITIAL_GIGS);
    setProposals(INITIAL_PROPOSALS);
    setReviews(INITIAL_REVIEWS);
    setCurrentUser(INITIAL_USERS[0]);
    addToast('success', 'Marketplace state reset to clean seed data.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        gigs,
        proposals,
        reviews,
        activeView,
        selectedGigId,
        toasts,
        searchQuery,
        selectedCategory,
        statusFilter,
        budgetFilter,
        setActiveView,
        setSelectedGigId,
        setSearchQuery,
        setSelectedCategory,
        setStatusFilter,
        setBudgetFilter,
        addToast,
        removeToast,
        switchUser,
        loginUser,
        registerUser,
        logout,
        postGig,
        deleteGig,
        submitProposal,
        acceptProposal,
        rejectProposal,
        deliverWork,
        completeWork,
        submitReview,
        toggleBlockUser,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
