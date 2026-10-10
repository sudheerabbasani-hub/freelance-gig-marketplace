export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewsCount?: number;
  completedJobsCount?: number;
  totalSpent?: number;
  isBlocked?: boolean;
  createdAt: string;
}

export type GigCategory = 
  | 'Web Development'
  | 'Mobile Apps'
  | 'UI/UX Design'
  | 'AI & Machine Learning'
  | 'DevOps & Cloud'
  | 'Content & Copywriting'
  | 'Data Analytics';

export type GigStatus = 'open' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: GigCategory;
  minBudget: number;
  maxBudget: number;
  requiredSkills: string[];
  deadline: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientRating: number;
  status: GigStatus;
  proposalsCount: number;
  acceptedProposalId?: string;
  assignedFreelancerId?: string;
  assignedFreelancerName?: string;
  deliveryNotes?: string;
  createdAt: string;
}

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  gigId: string;
  gigTitle?: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerTitle: string;
  freelancerRating: number;
  coverLetter: string;
  proposedPrice: number;
  deliveryDays: number;
  status: ProposalStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  gigId: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  freelancerId: string;
  freelancerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export type ActiveView = 'home' | 'browse' | 'client-dashboard' | 'freelancer-dashboard' | 'admin-panel';
