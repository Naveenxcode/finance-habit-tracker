const Expense = require('../models/Expense');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.addExpense = asyncHandler(async (req, res) => {
  req.body.userId = req.user._id;
  const expense = await Expense.create(req.body);
  res.status(201).json({ success: true, data: expense });
});

exports.getAll = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, paymentMethod, sort = '-date', page = 1, limit = 20 } = req.query;
  const filter = { userId: req.user._id };
  if (category) filter.category = category;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const total = await Expense.countDocuments(filter);
  const data = await Expense.find(filter).sort(sort).skip((page - 1) * limit).limit(+limit);
  res.json({ success: true, count: data.length, total, page: +page, data });
});

exports.getOne = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!expense) throw new ApiError(404, 'Expense not found');
  res.json({ success: true, data: expense });
});

exports.update = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true }
  );
  if (!expense) throw new ApiError(404, 'Expense not found');
  res.json({ success: true, data: expense });
});

exports.remove = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!expense) throw new ApiError(404, 'Expense not found');
  res.json({ success: true, message: 'Deleted' });
});

exports.getSummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const m = month ? +month : now.getMonth() + 1;
  const y = year ? +year : now.getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  const monthData = await Expense.find({ userId: req.user._id, date: { $gte: start, $lte: end } });
  const totalThisMonth = monthData.reduce((s, e) => s + e.amount, 0);

  const categoryBreakdown = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: start, $lte: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);

  const dailySpending = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: start, $lte: end } } },
    { $group: { _id: { $dayOfMonth: '$date' }, total: { $sum: '$amount' } } },
    { $sort: { '_id': 1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalThisMonth, transactionCount: monthData.length,
      avgDailySpending: Math.round(totalThisMonth / new Date().getDate()),
      topCategory: categoryBreakdown[0] || null,
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c._id, total: c.total, count: c.count,
        percentage: totalThisMonth ? Math.round((c.total / totalThisMonth) * 100) : 0
      })),
      dailySpending: dailySpending.map(d => ({ day: d._id, total: d.total }))
    }
  });
});
