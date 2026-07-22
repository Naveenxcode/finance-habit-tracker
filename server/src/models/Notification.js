const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['habit_reminder', 'goal_milestone', 'streak_alert', 'weekly_summary', 'badge_unlock', 'system'],
    default: 'system'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedType: {
    type: String,
    enum: ['habit', 'goal', 'badge', null],
    default: null
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId, default: null }
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
