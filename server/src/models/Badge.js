const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeType: { type: String, required: true },
  badgeName: { type: String, required: true },
  badgeCategory: {
    type: String,
    enum: ['streak', 'completion', 'financial', 'special'],
    default: 'streak'
  },
  badgeDescription: { type: String, default: '' },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
  unlockedAt: { type: Date, default: Date.now }
}, { timestamps: { createdAt: true, updatedAt: false } });

badgeSchema.index({ userId: 1, badgeType: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);
