const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch (e) {}

// Models
const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitEntry = require('../models/HabitEntry');
const SavingsGoal = require('../models/SavingsGoal');
const GoalContribution = require('../models/GoalContribution');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Asset = require('../models/Asset');
const Liability = require('../models/Liability');
const NetworthSnapshot = require('../models/NetworthSnapshot');
const Badge = require('../models/Badge');

const connectDB = require('../config/db');

const seedDemo = async () => {
  try {
    await connectDB();

    // 1. Clean previous demo user data if present
    const demoEmail = 'demo@wealthhabit.io';
    const existingDemo = await User.findOne({ email: demoEmail });
    if (existingDemo) {
      console.log('🧹 Cleaning existing demo user data...');
      await Habit.deleteMany({ userId: existingDemo._id });
      await HabitEntry.deleteMany({ userId: existingDemo._id });
      await SavingsGoal.deleteMany({ userId: existingDemo._id });
      await GoalContribution.deleteMany({ userId: existingDemo._id });
      await Income.deleteMany({ userId: existingDemo._id });
      await Expense.deleteMany({ userId: existingDemo._id });
      await Asset.deleteMany({ userId: existingDemo._id });
      await Liability.deleteMany({ userId: existingDemo._id });
      await NetworthSnapshot.deleteMany({ userId: existingDemo._id });
      await Badge.deleteMany({ userId: existingDemo._id });
      await User.deleteOne({ _id: existingDemo._id });
    }

    // 2. Create Demo User
    console.log('👤 Creating Demo User account...');
    const demoUser = await User.create({
      name: 'Rahul Sharma (Demo Master)',
      email: demoEmail,
      password: 'DemoPassword123!',
      phone: '+91 9876543210',
      avatar: '👨‍💻',
      role: 'user',
      employmentType: 'employed',
      currency: 'INR',
      monthlyIncomeRange: '1L - 2L',
      settings: {
        theme: 'dark',
        emailReminders: true,
        pushNotifications: true,
        weeklyReportEmail: true
      },
      onboardingCompleted: true,
      lastLoginAt: new Date()
    });

    const uid = demoUser._id;

    // 3. Create Savings Goals
    console.log('🎯 Creating Savings Goals...');
    const emergencyGoal = await SavingsGoal.create({
      userId: uid,
      name: 'Emergency Safety Reserve (6 Months)',
      icon: '🛡️',
      category: 'emergency',
      targetAmount: 150000,
      currentAmount: 112500,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'active'
    });

    const macbookGoal = await SavingsGoal.create({
      userId: uid,
      name: 'MacBook Pro M4 Tech Upgrade',
      icon: '💻',
      category: 'gadget',
      targetAmount: 220000,
      currentAmount: 85000,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      status: 'active'
    });

    const goaGoal = await SavingsGoal.create({
      userId: uid,
      name: 'Annual Goa Wellness Vacation',
      icon: '🏖️',
      category: 'travel',
      targetAmount: 75000,
      currentAmount: 75000,
      priority: 'low',
      status: 'completed',
      completedAt: new Date()
    });

    // Add Goal Contributions
    await GoalContribution.create([
      {
        userId: uid,
        goalId: emergencyGoal._id,
        amount: 25000,
        source: 'manual',
        note: 'Monthly salary savings allocation',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        userId: uid,
        goalId: macbookGoal._id,
        amount: 15000,
        source: 'habit',
        note: 'Auto-saved from Virtual Piggy Bank completion',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]);

    // 4. Create Habits (Option B: Virtual Piggy Bank connected habits)
    console.log('🔥 Creating Financial Habits...');
    const habits = await Habit.create([
      {
        userId: uid,
        name: 'No Impulse Junk Food Purchases',
        description: 'Cook healthy meals & skip food delivery apps',
        category: 'savings',
        icon: '🥗',
        frequency: 'daily',
        hasTarget: true,
        targetType: 'amount',
        targetValue: 250,
        targetUnit: 'INR',
        currentStreak: 14,
        bestStreak: 21,
        totalCompletions: 38,
        totalValueLogged: 9500,
        linkedGoalId: emergencyGoal._id,
        status: 'active'
      },
      {
        userId: uid,
        name: 'Daily Piggy Bank Micro-Transfer',
        description: 'Auto-deposit ₹500 into Virtual Piggy Vault',
        category: 'savings',
        icon: '💰',
        frequency: 'daily',
        hasTarget: true,
        targetType: 'amount',
        targetValue: 500,
        targetUnit: 'INR',
        currentStreak: 21,
        bestStreak: 28,
        totalCompletions: 64,
        totalValueLogged: 32000,
        linkedGoalId: emergencyGoal._id,
        status: 'active'
      },
      {
        userId: uid,
        name: 'Daily Expense Logging & Review',
        description: 'Account for every rupee spent before sleeping',
        category: 'tracking',
        icon: '📊',
        frequency: 'daily',
        hasTarget: false,
        currentStreak: 9,
        bestStreak: 15,
        totalCompletions: 42,
        status: 'active'
      },
      {
        userId: uid,
        name: 'Weekly Index SIP Allocation Check',
        description: 'Verify mutual fund auto-debit executed smoothly',
        category: 'investment',
        icon: '📈',
        frequency: 'weekly',
        hasTarget: true,
        targetType: 'amount',
        targetValue: 5000,
        targetUnit: 'INR',
        currentStreak: 6,
        bestStreak: 12,
        totalCompletions: 18,
        totalValueLogged: 90000,
        linkedGoalId: macbookGoal._id,
        status: 'active'
      },
      {
        userId: uid,
        name: 'Every 5 Days Vault Deposit (Custom)',
        description: 'Special lump-sum checkoff every 5 days',
        category: 'savings',
        icon: '🚀',
        frequency: 'custom',
        customDays: 5,
        hasTarget: true,
        targetType: 'amount',
        targetValue: 1500,
        targetUnit: 'INR',
        currentStreak: 5,
        bestStreak: 10,
        totalCompletions: 14,
        totalValueLogged: 21000,
        status: 'active'
      }
    ]);

    // Create Habit Entries for today so some appear completed
    console.log('✅ Creating Habit Entries...');
    await HabitEntry.create([
      {
        userId: uid,
        habitId: habits[0]._id,
        completed: true,
        value: 250,
        date: new Date(),
        notes: 'Made fresh salad at home!'
      },
      {
        userId: uid,
        habitId: habits[1]._id,
        completed: true,
        value: 500,
        date: new Date(),
        notes: 'Transferred to Piggy Bank reserve'
      }
    ]);

    // 5. Create Income Records
    console.log('💵 Creating Income Records...');
    const now = new Date();
    await Income.create([
      {
        userId: uid,
        sourceName: 'Senior Software Engineer Salary',
        category: 'salary',
        amount: 145000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        recurrence: 'monthly',
        notes: 'Direct bank deposit'
      },
      {
        userId: uid,
        sourceName: 'Tech Advisory & Freelance Project',
        category: 'freelance',
        amount: 35000,
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        recurrence: 'one_time',
        notes: 'Client milestone payout'
      },
      {
        userId: uid,
        sourceName: 'Quarterly Mutual Fund Dividend',
        category: 'investment_returns',
        amount: 8500,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        recurrence: 'one_time'
      }
    ]);

    // 6. Create Expense Records
    console.log('💳 Creating Expense Records...');
    await Expense.create([
      {
        userId: uid,
        description: 'Apartment Monthly Rent & Maintenance',
        category: 'rent',
        amount: 38000,
        date: new Date(now.getFullYear(), now.getMonth(), 2),
        paymentMethod: 'upi'
      },
      {
        userId: uid,
        description: 'Organic Groceries & Supermarket Run',
        category: 'groceries',
        amount: 14500,
        date: new Date(now.getFullYear(), now.getMonth(), 4),
        paymentMethod: 'upi'
      },
      {
        userId: uid,
        description: 'High-Speed Fiber & Electric Bills',
        category: 'bills',
        amount: 4200,
        date: new Date(now.getFullYear(), now.getMonth(), 6),
        paymentMethod: 'upi'
      },
      {
        userId: uid,
        description: 'Weekend Dining Out & Cinema',
        category: 'entertainment',
        amount: 6800,
        date: new Date(now.getFullYear(), now.getMonth(), 8),
        paymentMethod: 'card'
      }
    ]);

    // 7. Create Assets & Liabilities
    console.log('🏛️ Creating Assets & Liabilities...');
    await Asset.create([
      {
        userId: uid,
        name: 'Nifty 50 Direct Index Mutual Fund',
        category: 'mutual_funds',
        investedAmount: 650000,
        currentValue: 840000,
        interestRate: 14.2
      },
      {
        userId: uid,
        name: 'HDFC Emergency High-Yield Fixed Deposit',
        category: 'fixed_deposit',
        investedAmount: 250000,
        currentValue: 268000,
        interestRate: 7.25
      },
      {
        userId: uid,
        name: 'Direct Tech Bluechip Equity Holdings',
        category: 'stocks',
        investedAmount: 320000,
        currentValue: 415000,
        interestRate: 16.5
      },
      {
        userId: uid,
        name: 'Virtual Piggy Bank Reserve & Cash Vault',
        category: 'bank_cash',
        investedAmount: 120000,
        currentValue: 142500,
        interestRate: 4.5
      }
    ]);

    await Liability.create([
      {
        userId: uid,
        name: 'Hyundai Compact SUV Auto Loan',
        type: 'vehicle_loan',
        originalAmount: 650000,
        remainingAmount: 240000,
        interestRate: 8.5,
        emiAmount: 14800,
        status: 'active'
      },
      {
        userId: uid,
        name: 'Regalia Credit Card Statement',
        type: 'credit_card',
        originalAmount: 32000,
        remainingAmount: 18500,
        interestRate: 0,
        emiAmount: 0,
        status: 'active'
      }
    ]);

    // 8. Create Net Worth Growth Snapshots
    console.log('📈 Creating Net Worth Snapshots...');
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const networthValues = [980000, 1045000, 1120000, 1210000, 1295000, 1407000];

    for (let i = 0; i < months.length; i++) {
      await NetworthSnapshot.create({
        userId: uid,
        date: new Date(2026, i + 1, 1),
        month: i + 2,
        year: 2026,
        totalAssets: networthValues[i] + 258500,
        totalLiabilities: 258500,
        netWorth: networthValues[i]
      });
    }

    // 9. Create Badges
    console.log('🏆 Creating Badges...');
    await Badge.create([
      {
        userId: uid,
        badgeType: 'vault_master',
        badgeName: 'Piggy Vault Master',
        badgeDescription: 'Saved over ₹50,000 via automated daily micro-habits',
        badgeCategory: 'financial',
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        userId: uid,
        badgeType: 'streak_21',
        badgeName: '21-Day Habit Streak Champion',
        badgeDescription: 'Completed daily financial discipline checkoffs for 3 consecutive weeks',
        badgeCategory: 'streak',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: uid,
        badgeType: 'first_lakh',
        badgeName: 'First Lakh Emergency Shield',
        badgeDescription: 'Reached ₹1,00,000 in your safety emergency fund goal',
        badgeCategory: 'financial',
        unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('\n======================================================');
    console.log('🎉 DEMO DATA SEEDED SUCCESSFULLY IN MONGODB! 🎉');
    console.log('======================================================');
    console.log('Demo User Credentials:');
    console.log('  Email    : demo@wealthhabit.io');
    console.log('  Password : DemoPassword123!');
    console.log('======================================================');
    console.log('Summary of Seeded Data:');
    console.log('  • 1 User Account (Rahul Sharma)');
    console.log('  • 5 Financial Habits (Daily, Weekly & Custom frequency)');
    console.log('  • 3 Savings Goals (Emergency, Gadget, Vacation)');
    console.log('  • 3 Income Sources (Salary, Freelance, Dividend)');
    console.log('  • 4 Expense Records (Rent, Groceries, Bills, Entertainment)');
    console.log('  • 4 Assets (Mutual Funds, FD, Stocks, Piggy Vault)');
    console.log('  • 2 Liabilities (Auto Loan, Credit Card)');
    console.log('  • 6 Months of Net Worth Growth Snapshots');
    console.log('  • 3 Achievement Badges');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDemo();
