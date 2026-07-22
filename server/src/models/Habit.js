const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Habit name is required'], trim: true, maxlength: 50 },
  description: { type: String, maxlength: 200 },
  category: { type: String, default: 'savings' },
  icon: { type: String, default: '💰' },
  frequency: { type: String, default: 'daily' },
  customDays: { type: Number },
  specificDays: [{ type: Number }],
  dayOfMonth: { type: Number },
  hasTarget: { type: Boolean, default: false },
  targetType: { type: String, enum: ['amount', 'count', 'time', 'boolean'] },
  targetValue: { type: Number },
  targetUnit: { type: String },
  reminderEnabled: { type: Boolean, default: true },
  reminderTime: { type: String, default: '09:00' },
  reminderMessage: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'paused', 'archived'], default: 'active' },
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 },
  totalValueLogged: { type: Number, default: 0 },
  linkedGoalId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingsGoal' },
  autoCompleteTrigger: { type: String, default: null },
  pausedAt: { type: Date }
}, { timestamps: true });

habitSchema.index({ userId: 1, status: 1 });
habitSchema.index({ userId: 1, linkedGoalId: 1 });

module.exports = mongoose.model('Habit', habitSchema);
