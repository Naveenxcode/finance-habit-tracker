const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceName: { type: String, default: 'Income' },
  title: { type: String },
  name: { type: String },
  category: { type: String, default: 'other' },
  amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
  date: { type: Date, default: Date.now },
  recurrence: { type: String, default: 'one_time' },
  notes: { type: String }
}, { timestamps: true });

incomeSchema.pre('save', async function() {
  if (!this.sourceName && (this.title || this.name)) {
    this.sourceName = this.title || this.name;
  }
  if (!this.title && this.sourceName) {
    this.title = this.sourceName;
  }
});

incomeSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Income', incomeSchema);
