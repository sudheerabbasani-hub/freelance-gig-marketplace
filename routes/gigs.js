const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const Proposal = require('../models/Proposal');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/gigs
// @desc    Get all gigs with search, category filter, budget filter, status filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { keyword, category, status, minBudget, maxBudget, sort } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(keyword, 'i')] } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (minBudget || maxBudget) {
      query.minBudget = {};
      if (minBudget) query.minBudget.$gte = Number(minBudget);
      if (maxBudget) query.maxBudget = { $lte: Number(maxBudget) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'budget-high') sortOption = { maxBudget: -1 };
    if (sort === 'budget-low') sortOption = { minBudget: 1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };

    const gigs = await Gig.find(query).sort(sortOption);

    res.json({
      success: true,
      count: gigs.length,
      data: gigs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/gigs/:id
// @desc    Get single gig details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }
    res.json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/gigs
// @desc    Post a new gig (Client only)
// @access  Private (client)
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const { title, description, category, minBudget, maxBudget, requiredSkills, deadline } = req.body;

    if (!title || !description || !category || !minBudget || !maxBudget || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, category, minBudget, maxBudget, deadline)',
      });
    }

    if (Number(maxBudget) < Number(minBudget)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum budget must be greater than or equal to minimum budget',
      });
    }

    const gig = await Gig.create({
      title,
      description,
      category,
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map((s) => s.trim()),
      deadline,
      clientId: req.user._id,
      clientName: req.user.name,
      clientAvatar: req.user.avatar,
      clientRating: req.user.rating || 5.0,
      status: 'open',
    });

    res.status(201).json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/gigs/:id/deliver
// @desc    Freelancer marks work as delivered
// @access  Private (freelancer assigned to gig or admin)
router.patch('/:id/deliver', protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.assignedFreelancerId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the assigned freelancer can deliver this gig' });
    }

    if (gig.status !== 'in_progress') {
      return res.status(400).json({ success: false, message: 'Gig must be in progress to be delivered' });
    }

    gig.status = 'delivered';
    gig.deliveryNotes = req.body.deliveryNotes || 'Deliverables submitted for review.';
    await gig.save();

    res.json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/gigs/:id/complete
// @desc    Client marks work as completed
// @access  Private (client owner or admin)
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the gig client owner can mark work completed' });
    }

    gig.status = 'completed';
    await gig.save();

    // Increment freelancer completed jobs count
    if (gig.assignedFreelancerId) {
      await User.findByIdAndUpdate(gig.assignedFreelancerId, {
        $inc: { completedJobsCount: 1 },
      });
    }

    res.json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/gigs/:id
// @desc    Delete a gig
// @access  Private (client owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this gig' });
    }

    await Gig.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ gigId: req.params.id });

    res.json({ success: true, message: 'Gig and associated proposals deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
