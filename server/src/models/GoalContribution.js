const mongoose = require('mongoose');

const goalContributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingsGoal', required: true },
  amount: { type: Number, required: [true, 'Amount is required'] },
  source: {
    type: String,
    enum: ['habit', 'bonus', 'salary', 'gift', 'manual', 'other'],
    required: [true, 'Source is required']
  },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' },
  habitEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'HabitEntry' },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

goalContributionSchema.index({ goalId: 1, date: -1 });
goalContributionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('GoalContribution', goalContributionSchema);
