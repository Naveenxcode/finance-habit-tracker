const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route POST /api/v1/auth/register
exports.register = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ApiError(503, 'Database disconnected. Use offline fallback.');
  }
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);
  res.status(201).json({
    success: true, token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, onboardingCompleted: user.onboardingCompleted }
  });
});

// @route POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ApiError(503, 'Database disconnected. Use offline fallback.');
  }
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Please provide email and password');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  const token = generateToken(user._id);

  res.json({
    success: true, token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, onboardingCompleted: user.onboardingCompleted, settings: user.settings }
  });
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route POST /api/v1/auth/google
exports.googleLogin = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    throw new ApiError(503, 'Database disconnected. Use offline fallback.');
  }
  const { credential } = req.body;
  if (!credential) throw new ApiError(400, 'Google token is required');

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // Register new user via Google
    // Generate random secure password since they login via Google
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    user = await User.create({ 
      name, 
      email, 
      password: randomPassword,
      avatar: picture 
    });
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  const token = generateToken(user._id);

  res.json({
    success: true, token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, onboardingCompleted: user.onboardingCompleted, settings: user.settings, avatar: user.avatar }
  });
});

// @route GET /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route PUT /api/v1/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'employmentType', 'currency', 'monthlyIncomeRange'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
});

// @route PUT /api/v1/profile/onboarding
exports.completeOnboarding = asyncHandler(async (req, res) => {
  const { employmentType, currency, monthlyIncomeRange } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, {
    employmentType, currency, monthlyIncomeRange, onboardingCompleted: true
  }, { new: true });
  res.json({ success: true, message: 'Onboarding completed!', user });
});

// @route PUT /api/v1/profile/settings
exports.updateSettings = asyncHandler(async (req, res) => {
  const { theme, emailReminders, pushNotifications, weeklyReportEmail } = req.body;
  const settings = {};
  if (theme !== undefined) settings['settings.theme'] = theme;
  if (emailReminders !== undefined) settings['settings.emailReminders'] = emailReminders;
  if (pushNotifications !== undefined) settings['settings.pushNotifications'] = pushNotifications;
  if (weeklyReportEmail !== undefined) settings['settings.weeklyReportEmail'] = weeklyReportEmail;

  const user = await User.findByIdAndUpdate(req.user._id, { $set: settings }, { new: true });
  res.json({ success: true, user });
});

// @route PUT /api/v1/profile/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});
