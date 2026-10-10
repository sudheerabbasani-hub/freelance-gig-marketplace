const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: [true, 'gigId is required'],
      index: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'freelancerId is required'],
      index: true,
    },
    freelancerName: {
      type: String,
      required: true,
    },
    freelancerAvatar: {
      type: String,
      default: '',
    },
    freelancerTitle: {
      type: String,
      default: '',
    },
    freelancerRating: {
      type: Number,
      default: 5.0,
    },
    coverLetter: {
      type: String,
      required: [true, 'Please provide a proposal cover letter'],
      minlength: [20, 'Cover letter must be at least 20 characters'],
      trim: true,
    },
    proposedPrice: {
      type: Number,
      required: [true, 'Please propose a price in USD'],
      min: [5, 'Proposed price must be at least $5'],
    },
    deliveryDays: {
      type: Number,
      required: [true, 'Please specify the estimated delivery time in days'],
      min: [1, 'Delivery time must be at least 1 day'],
      max: [365, 'Delivery time cannot exceed 365 days'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL UNIQUE COMPOUND INDEX:
// Strictly prevents duplicate proposals from the same freelancer for the same gig at the database level!
proposalSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
