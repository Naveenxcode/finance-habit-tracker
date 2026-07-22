const mongoose = require('mongoose');

const networthSnapshotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalAssets: { type: Number, default: 0 },
  totalLiabilities: { type: Number, default: 0 },
  netWorth: { type: Number, default: 0 },
  assetsBreakdown: {
    bankCash: { type: Number, default: 0 },
    savingsGoals: { type: Number, default: 0 },
    mutualFunds: { type: Number, default: 0 },
    stocks: { type: Number, default: 0 },
    fixedDeposit: { type: Number, default: 0 },
    realEstate: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    crypto: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  liabilitiesBreakdown: {
    educationLoan: { type: Number, default: 0 },
    homeLoan: { type: Number, default: 0 },
    vehicleLoan: { type: Number, default: 0 },
    creditCard: { type: Number, default: 0 },
    personalLoan: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  incomeThisMonth: { type: Number, default: 0 },
  expensesThisMonth: { type: Number, default: 0 },
  savingsThisMonth: { type: Number, default: 0 },
  savingsRate: { type: Number, default: 0 }
}, { timestamps: true });

networthSnapshotSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('NetworthSnapshot', networthSnapshotSchema);
