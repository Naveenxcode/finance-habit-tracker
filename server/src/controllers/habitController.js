const Habit = require('../models/Habit');
const HabitEntry = require('../models/HabitEntry');
const SavingsGoal = require('../models/SavingsGoal');
const GoalContribution = require('../models/GoalContribution');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @route POST /api/v1/habits
exports.createHabit = asyncHandler(async (req, res) => {
  req.body.userId = req.user._id;
  const habit = await Habit.create(req.body);
  res.status(201).json({ success: true, data: habit });
});

// @route GET /api/v1/habits
exports.getHabits = asyncHandler(async (req, res) => {
  const { status = 'active', category } = req.query;
  const filter = { userId: req.user._id };
  if (status !== 'all') filter.status = status;
  if (category) filter.category = category;

  const habits = await Habit.find(filter).populate('linkedGoalId', 'name currentAmount targetAmount icon').sort('-createdAt');
  res.json({ success: true, count: habits.length, data: habits });
});

// @route GET /api/v1/habits/today
exports.getTodayHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ userId: req.user._id, status: 'active' }).populate('linkedGoalId', 'name currentAmount targetAmount icon');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entries = await HabitEntry.find({
    userId: req.user._id,
    date: today
  });

  const entryMap = {};
  entries.forEach(e => { entryMap[e.habitId.toString()] = e; });

  const data = habits.map(h => ({
    ...h.toObject(),
    completedToday: !!(entryMap[h._id.toString()] && entryMap[h._id.toString()].completed),
    todayEntry: entryMap[h._id.toString()] || null
  }));

  res.json({ success: true, count: data.length, data });
});

// @route GET /api/v1/habits/:id
exports.getHabitById = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id }).populate('linkedGoalId');
  if (!habit) throw new ApiError(404, 'Habit not found');
  res.json({ success: true, data: habit });
});

// @route PUT /api/v1/habits/:id
exports.updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!habit) throw new ApiError(404, 'Habit not found');
  res.json({ success: true, data: habit });
});

// @route DELETE /api/v1/habits/:id
exports.deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!habit) throw new ApiError(404, 'Habit not found');
  await HabitEntry.deleteMany({ habitId: req.params.id });
  res.json({ success: true, message: 'Habit deleted' });
});

// @route POST /api/v1/habits/:id/complete
// CORE API: Marks habit complete, updates streak, piggy bank, goal contribution, and checks badges
exports.completeHabit = asyncHandler(async (req, res) => {
  const { value, notes, date } = req.body;
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
  if (!habit) throw new ApiError(404, 'Habit not found');

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  // Check if already completed today
  let entry = await HabitEntry.findOne({ userId: req.user._id, habitId: habit._id, date: targetDate });
  if (entry && entry.completed) {
    return res.json({ success: true, message: 'Habit already completed for this date', data: { habit, entry } });
  }

  const logValue = value !== undefined ? Number(value) : (habit.targetValue || 0);

  if (entry) {
    entry.completed = true;
    entry.value = logValue;
    entry.notes = notes || entry.notes;
    entry.completedAt = new Date();
    await entry.save();
  } else {
    entry = await HabitEntry.create({
      userId: req.user._id,
      habitId: habit._id,
      date: targetDate,
      completed: true,
      value: logValue,
      notes: notes || '',
      completedAt: new Date()
    });
  }

  // Update streak & stats
  habit.currentStreak = (habit.currentStreak || 0) + 1;
  if (habit.currentStreak > (habit.bestStreak || 0)) {
    habit.bestStreak = habit.currentStreak;
  }
  habit.totalCompletions = (habit.totalCompletions || 0) + 1;
  habit.totalValueLogged = (habit.totalValueLogged || 0) + logValue;
  await habit.save();

  // If linked to a SavingsGoal, contribute automatically
  let goalUpdate = null;
  if (habit.linkedGoalId && logValue > 0) {
    const goal = await SavingsGoal.findOne({ _id: habit.linkedGoalId, userId: req.user._id });
    if (goal && goal.status === 'active') {
      goal.currentAmount += logValue;
      if (goal.currentAmount >= goal.targetAmount) {
        goal.status = 'completed';
        goal.completedAt = new Date();
      }
      await goal.save();

      await GoalContribution.create({
        userId: req.user._id,
        goalId: goal._id,
        amount: logValue,
        source: 'habit',
        habitId: habit._id,
        habitEntryId: entry._id,
        notes: `Contribution from habit: ${habit.name}`
      });
      goalUpdate = goal;
    }
  }

  // Check badges for streaks (e.g. 7 days, 30 days)
  const unlockedBadges = [];
  const streakTargets = [7, 21, 30, 100];
  if (streakTargets.includes(habit.currentStreak)) {
    const badgeType = `streak_${habit.currentStreak}`;
    const badgeExists = await Badge.findOne({ userId: req.user._id, badgeType });
    if (!badgeExists) {
      const newBadge = await Badge.create({
        userId: req.user._id,
        badgeType,
        badgeName: `${habit.currentStreak} Day Flame 🔥`,
        badgeCategory: 'streak',
        badgeDescription: `Completed a ${habit.currentStreak}-day habit streak!`,
        habitId: habit._id
      });
      unlockedBadges.push(newBadge);

      await Notification.create({
        userId: req.user._id,
        type: 'badge_unlock',
        title: '🏆 New Badge Unlocked!',
        message: `You earned the ${newBadge.badgeName} badge!`,
        relatedType: 'badge',
        relatedId: newBadge._id
      });
    }
  }

  res.json({
    success: true,
    message: 'Habit completed successfully!',
    data: {
      habit,
      entry,
      goalUpdate,
      unlockedBadges
    }
  });
});

// @route GET /api/v1/habits/:id/history
exports.getHabitHistory = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = { userId: req.user._id, habitId: req.params.id };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  const entries = await HabitEntry.find(filter).sort('-date');
  res.json({ success: true, count: entries.length, data: entries });
});
