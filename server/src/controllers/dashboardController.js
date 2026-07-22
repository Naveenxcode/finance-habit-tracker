const Habit = require('../models/Habit');
const HabitEntry = require('../models/HabitEntry');
const SavingsGoal = require('../models/SavingsGoal');
const Asset = require('../models/Asset');
const Liability = require('../models/Liability');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Badge = require('../models/Badge');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Habits Today
  const habits = await Habit.find({ userId, status: 'active' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = await HabitEntry.find({ userId, date: today });
  const entryMap = {};
  todayEntries.forEach(e => { entryMap[e.habitId.toString()] = e; });

  const habitsWithStatus = habits.map(h => ({
    ...h.toObject(),
    completedToday: !!(entryMap[h._id.toString()] && entryMap[h._id.toString()].completed)
  }));

  // 2. Piggy Bank Value (sum of all savings habits totalValueLogged)
  const piggyBankValue = habits
    .filter(h => h.category === 'savings')
    .reduce((s, h) => s + (h.totalValueLogged || 0), 0);

  // 3. Active Goals
  const goals = await SavingsGoal.find({ userId, status: 'active' }).limit(4);

  // 4. Net Worth
  const assets = await Asset.find({ userId });
  const liabilities = await Liability.find({ userId, status: 'active' });
  const totalAssets = assets.reduce((s, a) => s + a.currentValue, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.remainingAmount, 0);
  const netWorth = totalAssets - totalLiabilities;

  // 5. This Month's Income / Expense
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const monthlyIncome = await Income.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } });
  const monthlyExpenses = await Expense.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } });

  const totalIncomeThisMonth = monthlyIncome.reduce((s, i) => s + i.amount, 0);
  const totalExpenseThisMonth = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const savingsThisMonth = totalIncomeThisMonth - totalExpenseThisMonth;

  // 6. Badges count
  const badgeCount = await Badge.countDocuments({ userId });

  res.json({
    success: true,
    data: {
      user: { name: req.user.name, email: req.user.email },
      summary: {
        netWorth,
        totalAssets,
        totalLiabilities,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        savingsThisMonth,
        piggyBankValue,
        badgeCount
      },
      habits: habitsWithStatus,
      goals
    }
  });
});
