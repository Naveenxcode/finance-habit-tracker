const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, default: 'Expense' },
  title: { type: String },
  name: { type: String },
  category: { type: String, default: 'general' },
  amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'upi' },
  notes: { type: String }
}, { timestamps: true });

expenseSchema.pre('save', async function() {
  if (!this.description && (this.title || this.name)) {
    this.description = this.title || this.name;
  }
  if (!this.title && this.description) {
    this.title = this.description;
  }
});

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
