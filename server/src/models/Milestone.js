const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['net_worth', 'goal_completed', 'debt_payoff', 'savings_rate', 'consistency', 'first_investment'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  value: { type: Number },
  achievedAt: { type: Date, default: Date.now }
}, { timestamps: { createdAt: true, updatedAt: false } });

milestoneSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Milestone', milestoneSchema);
