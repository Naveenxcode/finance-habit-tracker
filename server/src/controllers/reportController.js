const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Habit = require('../models/Habit');
const SavingsGoal = require('../models/SavingsGoal');
const asyncHandler = require('../utils/asyncHandler');

exports.getMonthlyAnalytics = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const m = month ? +month : now.getMonth() + 1;
  const y = year ? +year : now.getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  const income = await Income.find({ userId: req.user._id, date: { $gte: start, $lte: end } });
  const expense = await Expense.find({ userId: req.user._id, date: { $gte: start, $lte: end } });

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expense.reduce((s, e) => s + e.amount, 0);

  res.json({
    success: true,
    data: {
      month: m,
      year: y,
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate: totalIncome ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0
    }
  });
});
