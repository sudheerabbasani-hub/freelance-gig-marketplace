const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Gig = require('../models/Gig');
const Proposal = require('../models/Proposal');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes: User must be authenticated and have 'admin' role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private (admin)
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const totalGigs = await Gig.countDocuments();
    const openGigs = await Gig.countDocuments({ status: 'open' });
    const completedGigs = await Gig.countDocuments({ status: 'completed' });
    const totalProposals = await Proposal.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalClients,
        totalFreelancers,
        totalGigs,
        openGigs,
        completedGigs,
        totalProposals,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users list
// @access  Private (admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/admin/users/:id/toggle-block
// @desc    Toggle block/unblock user
// @access  Private (admin)
router.patch('/users/:id/toggle-block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block platform administrators' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User is now ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/gigs/:id
// @desc    Remove any gig as admin (moderation)
// @access  Private (admin)
router.delete('/gigs/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    await Gig.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ gigId: req.params.id });

    res.json({ success: true, message: 'Gig removed by administrator' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
