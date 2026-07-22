const mongoose = require('mongoose');

const habitEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: Date, required: [true, 'Date is required'] },
  completed: { type: Boolean, default: false },
  value: { type: Number, default: null },
  notes: { type: String },
  completedAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false } });

habitEntrySchema.index({ habitId: 1, date: -1 });
habitEntrySchema.index({ userId: 1, date: -1 });
habitEntrySchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitEntry', habitEntrySchema);
