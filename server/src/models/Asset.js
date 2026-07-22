const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Asset name is required'] },
  category: { type: String, default: 'other' },
  investedAmount: { type: Number, default: 0 },
  currentValue: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  interestRate: { type: Number },
  dateAdded: { type: Date, default: Date.now },
  autoSource: { type: String, default: null },
  linkedGoalId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingsGoal' },
  notes: { type: String }
}, { timestamps: true });

assetSchema.pre('save', async function() {
  if (!this.currentValue && this.value) {
    this.currentValue = this.value;
  }
  if (!this.value && this.currentValue) {
    this.value = this.currentValue;
  }
});

assetSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Asset', assetSchema);
