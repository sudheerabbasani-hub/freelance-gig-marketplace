const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Gig = require('../models/Gig');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/proposals
// @desc    Submit a proposal for a gig (Freelancer only)
// @access  Private (freelancer)
router.post('/', protect, authorize('freelancer'), async (req, res) => {
  try {
    const { gigId, coverLetter, proposedPrice, deliveryDays } = req.body;

    if (!gigId || !coverLetter || !proposedPrice || !deliveryDays) {
      return res.status(400).json({
        success: false,
        message: 'Please provide gigId, coverLetter, proposedPrice, and deliveryDays',
      });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This gig is not open for proposals' });
    }

    // Attempt to create proposal (MongoDB unique compound index will catch race conditions too)
    try {
      const proposal = await Proposal.create({
        gigId,
        freelancerId: req.user._id,
        freelancerName: req.user.name,
        freelancerAvatar: req.user.avatar,
        freelancerTitle: req.user.title || 'Freelance Specialist',
        freelancerRating: req.user.rating || 5.0,
        coverLetter,
        proposedPrice: Number(proposedPrice),
        deliveryDays: Number(deliveryDays),
        status: 'pending',
      });

      // Increment proposal count
      await Gig.findByIdAndUpdate(gigId, { $inc: { proposalsCount: 1 } });

      return res.status(201).json({ success: true, data: proposal });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate proposal: You have already submitted a proposal for this gig.',
        });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/proposals/gig/:gigId
// @desc    Get all proposals for a specific gig (Only gig owner client or admin)
// @access  Private
router.get('/gig/:gigId', protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    // Authorization: Only the client who owns the gig or an admin can inspect received proposals
    if (gig.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the client who posted this gig can view its submitted proposals.',
      });
    }

    const proposals = await Proposal.find({ gigId: req.params.gigId }).sort({ createdAt: -1 });

    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/proposals/my
// @desc    Get all proposals submitted by the logged-in freelancer
// @access  Private (freelancer)
router.get('/my', protect, authorize('freelancer'), async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user._id })
      .populate('gigId', 'title category minBudget maxBudget status deadline')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/proposals/:id/accept
// @desc    Accept proposal: marks this proposal accepted, rejects all others, updates gig to in_progress
// @access  Private (client owner)
router.patch('/:id/accept', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const gig = await Gig.findById(proposal.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Associated gig not found' });
    }

    // Only owner client can accept
    if (gig.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage proposals for this gig' });
    }

    // 1. Mark target proposal as accepted
    proposal.status = 'accepted';
    await proposal.save();

    // 2. Automatically mark all other proposals for this gig as rejected
    await Proposal.updateMany(
      { gigId: gig._id, _id: { $ne: proposal._id } },
      { $set: { status: 'rejected' } }
    );

    // 3. Update gig status to in_progress with assigned freelancer
    gig.status = 'in_progress';
    gig.acceptedProposalId = proposal._id;
    gig.assignedFreelancerId = proposal.freelancerId;
    gig.assignedFreelancerName = proposal.freelancerName;
    await gig.save();

    res.json({
      success: true,
      message: 'Proposal accepted. Other proposals rejected. Gig is now In Progress.',
      data: { gig, acceptedProposal: proposal },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/proposals/:id/reject
// @desc    Reject a proposal
// @access  Private (client owner)
router.patch('/:id/reject', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const gig = await Gig.findById(proposal.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Associated gig not found' });
    }

    if (gig.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to reject proposals for this gig' });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
