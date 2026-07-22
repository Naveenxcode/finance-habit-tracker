const SavingsGoal = require('../models/SavingsGoal');
const GoalContribution = require('../models/GoalContribution');
const Habit = require('../models/Habit');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.createGoal = asyncHandler(async (req, res) => {
  req.body.userId = req.user._id;
  const goal = await SavingsGoal.create(req.body);
  res.status(201).json({ success: true, data: goal });
});

exports.getGoals = asyncHandler(async (req, res) => {
  const { status = 'active' } = req.query;
  const filter = { userId: req.user._id };
  if (status !== 'all') filter.status = status;

  const goals = await SavingsGoal.find(filter).populate('linkedHabitIds', 'name currentStreak icon').sort('-createdAt');
  res.json({ success: true, count: goals.length, data: goals });
});

exports.getGoalById = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id }).populate('linkedHabitIds');
  if (!goal) throw new ApiError(404, 'Savings goal not found');
  res.json({ success: true, data: goal });
});

exports.updateGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!goal) throw new ApiError(404, 'Savings goal not found');
  res.json({ success: true, data: goal });
});

exports.deleteGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Savings goal not found');
  await GoalContribution.deleteMany({ goalId: req.params.id });
  res.json({ success: true, message: 'Goal deleted' });
});

exports.contributeToGoal = asyncHandler(async (req, res) => {
  const { amount, source = 'manual', notes } = req.body;
  if (!amount || amount <= 0) throw new ApiError(400, 'Contribution amount must be greater than 0');

  const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Savings goal not found');

  goal.currentAmount += Number(amount);
  if (goal.currentAmount >= goal.targetAmount && goal.status === 'active') {
    goal.status = 'completed';
    goal.completedAt = new Date();
  }
  await goal.save();

  const contribution = await GoalContribution.create({
    userId: req.user._id,
    goalId: goal._id,
    amount: Number(amount),
    source,
    notes: notes || ''
  });

  res.json({ success: true, message: 'Contribution added', data: { goal, contribution } });
});

exports.getGoalContributions = asyncHandler(async (req, res) => {
  const contributions = await GoalContribution.find({
    goalId: req.params.id,
    userId: req.user._id
  }).sort('-date');
  res.json({ success: true, count: contributions.length, data: contributions });
});
