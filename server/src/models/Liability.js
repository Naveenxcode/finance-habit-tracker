const mongoose = require('mongoose');

const liabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, default: 'other' },
  category: { type: String, default: 'other' },
  originalAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  interestRate: { type: Number, default: 0 },
  emiAmount: { type: Number, default: 0 },
  emiDate: { type: Number },
  startDate: { type: Date },
  expectedClearDate: { type: Date },
  status: { type: String, default: 'active' },
  paidOffAt: { type: Date },
  notes: { type: String, default: '' }
}, { timestamps: true });

liabilitySchema.pre('save', async function() {
  if (!this.originalAmount && (this.totalAmount || this.remainingAmount)) {
    this.originalAmount = this.totalAmount || this.remainingAmount;
  }
  if (!this.remainingAmount && (this.totalAmount || this.originalAmount)) {
    this.remainingAmount = this.totalAmount || this.originalAmount;
  }
  if (!this.type && this.category) {
    this.type = this.category;
  }
});

liabilitySchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Liability', liabilitySchema);
