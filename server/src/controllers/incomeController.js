const Income = require('../models/Income');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.addIncome = asyncHandler(async (req, res) => {
  req.body.userId = req.user._id;
  const income = await Income.create(req.body);
  res.status(201).json({ success: true, data: income });
});

exports.getAll = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, recurrence, sort = '-date', page = 1, limit = 20 } = req.query;
  const filter = { userId: req.user._id };
  if (category) filter.category = category;
  if (recurrence) filter.recurrence = recurrence;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const total = await Income.countDocuments(filter);
  const data = await Income.find(filter).sort(sort).skip((page - 1) * limit).limit(+limit);
  res.json({ success: true, count: data.length, total, page: +page, data });
});

exports.getOne = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
  if (!income) throw new ApiError(404, 'Income record not found');
  res.json({ success: true, data: income });
});

exports.update = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true }
  );
  if (!income) throw new ApiError(404, 'Income record not found');
  res.json({ success: true, data: income });
});

exports.remove = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!income) throw new ApiError(404, 'Income record not found');
  res.json({ success: true, message: 'Deleted' });
});

exports.getSummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const m = month ? +month : now.getMonth() + 1;
  const y = year ? +year : now.getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  const monthData = await Income.find({ userId: req.user._id, date: { $gte: start, $lte: end } });
  const totalThisMonth = monthData.reduce((s, i) => s + i.amount, 0);

  const yearStart = new Date(y, 0, 1);
  const yearData = await Income.find({ userId: req.user._id, date: { $gte: yearStart, $lte: end } });
  const totalThisYear = yearData.reduce((s, i) => s + i.amount, 0);

  const categoryBreakdown = await Income.aggregate([
    { $match: { userId: req.user._id, date: { $gte: start, $lte: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);

  res.json({
    success: true,
    data: { totalThisMonth, totalThisYear, sourceCount: monthData.length,
      avgMonthlyIncome: Math.round(totalThisYear / m),
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c._id, total: c.total,
        percentage: totalThisMonth ? Math.round((c.total / totalThisMonth) * 100) : 0
      }))
    }
  });
});
