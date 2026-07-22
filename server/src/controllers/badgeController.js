const Badge = require('../models/Badge');
const asyncHandler = require('../utils/asyncHandler');

exports.getMyBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find({ userId: req.user._id }).sort('-unlockedAt');
  res.json({ success: true, count: badges.length, data: badges });
});
