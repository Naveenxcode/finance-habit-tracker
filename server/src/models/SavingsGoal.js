const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Goal name is required'] },
  icon: { type: String, default: '🎯' },
  category: { type: String, default: 'custom' },
  targetAmount: { type: Number, required: [true, 'Target amount is required'], min: 1 },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  priority: { type: String, default: 'medium' },
  linkedHabitIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  completedAt: { type: Date }
}, { timestamps: true });

savingsGoalSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
