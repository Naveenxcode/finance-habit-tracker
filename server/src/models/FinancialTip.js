const mongoose = require('mongoose');

const financialTipSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: '' },
  category: {
    type: String,
    enum: ['saving', 'investing', 'budgeting', 'mindset'],
    default: 'saving'
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('FinancialTip', financialTipSchema);
