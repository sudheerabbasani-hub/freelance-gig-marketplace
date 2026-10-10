const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Gig = require('../models/Gig');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Submit review and rating for completed gig (Client only)
// @access  Private (client)
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;

    if (!gigId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide gigId, rating, and review comment' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the client who hired this gig can leave a review' });
    }

    if (gig.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Reviews can only be submitted after the gig is completed' });
    }

    if (!gig.assignedFreelancerId) {
      return res.status(400).json({ success: false, message: 'No freelancer assigned to this gig' });
    }

    const existingReview = await Review.findOne({ gigId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'A review has already been submitted for this gig' });
    }

    const review = await Review.create({
      gigId,
      gigTitle: gig.title,
      clientId: req.user._id,
      clientName: req.user.name,
      clientAvatar: req.user.avatar,
      freelancerId: gig.assignedFreelancerId,
      freelancerName: gig.assignedFreelancerName || 'Freelancer',
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating for freelancer
    const allReviews = await Review.find({ freelancerId: gig.assignedFreelancerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(gig.assignedFreelancerId, {
      rating: parseFloat(avgRating.toFixed(2)),
      reviewsCount: allReviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/freelancer/:freelancerId
// @desc    Get all reviews received by a freelancer
// @access  Public
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const reviews = await Review.find({ freelancerId: req.params.freelancerId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
