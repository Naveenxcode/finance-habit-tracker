const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  employmentType: { type: String, enum: ['student', 'employed', 'freelancer', 'business', ''], default: '' },
  currency: { type: String, default: 'INR' },
  monthlyIncomeRange: { type: String, default: '' },
  settings: {
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    emailReminders: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    weeklyReportEmail: { type: Boolean, default: true }
  },
  onboardingCompleted: { type: Boolean, default: false },
  lastLoginAt: Date
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
