const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a gig title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed project description'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a gig category'],
      enum: [
        'Web Development',
        'Mobile Apps',
        'UI/UX Design',
        'AI & Machine Learning',
        'DevOps & Cloud',
        'Content & Copywriting',
        'Data Analytics',
      ],
    },
    minBudget: {
      type: Number,
      required: [true, 'Please specify the minimum budget'],
      min: [5, 'Minimum budget must be at least $5'],
    },
    maxBudget: {
      type: Number,
      required: [true, 'Please specify the maximum budget'],
      validate: {
        validator: function (val) {
          return val >= this.minBudget;
        },
        message: 'Maximum budget must be greater than or equal to minimum budget',
      },
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please provide at least one required skill'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one skill is required',
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a completion deadline'],
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientAvatar: {
      type: String,
      default: '',
    },
    clientRating: {
      type: Number,
      default: 5.0,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'delivered', 'completed', 'cancelled'],
      default: 'open',
      index: true,
    },
    proposalsCount: {
      type: Number,
      default: 0,
    },
    acceptedProposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      default: null,
    },
    assignedFreelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedFreelancerName: {
      type: String,
      default: null,
    },
    deliveryNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast keyword search and filtering
gigSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ minBudget: 1, maxBudget: 1 });

module.exports = mongoose.model('Gig', gigSchema);
