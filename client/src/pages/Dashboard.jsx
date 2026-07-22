import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineArrowRight,
  HiOutlineFlag
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import AnimatedNumber from '../components/common/AnimatedNumber';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const {
    user,
    habits,
    completeHabit,
    piggyBankBalance,
    netWorth,
    totalAssets,
    totalLiabilities,
    monthlySavings,
    goals
  } = useApp();

  const activeDailyHabits = habits.filter(h => h.frequency === 'daily');
  const completedCount = activeDailyHabits.filter(h => h.completedToday).length;

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className={styles.subtitle}>
            Here is your wealth discipline overview for today.
          </p>
        </div>
        <Link to="/app/habits" className={styles.primaryAction}>
          <HiOutlineSparkles />
          <span>Log Financial Habit</span>
        </Link>
      </div>

      {/* Top Stat Grid */}
      <div className={styles.statsGrid}>
        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.statLabel}>Net Worth</div>
          <div className={styles.statValue}>
            <AnimatedNumber value={netWorth} prefix="₹" />
          </div>
          <div className={styles.statDetail}>
            Assets: ₹{totalAssets.toLocaleString('en-IN')} • Liabilities: ₹{totalLiabilities.toLocaleString('en-IN')}
          </div>
        </motion.div>

        <motion.div
          className={`${styles.statCard} ${styles.piggyCard}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={styles.piggyCardHeader}>
            <span className={styles.statLabel}>Virtual Piggy Bank</span>
            <span className={styles.piggyBadge}>🐷 Interactive</span>
          </div>
          <div className={styles.statValueGold}>
            <AnimatedNumber value={piggyBankBalance} prefix="₹" />
          </div>
          <div className={styles.statDetail}>
            Grows automatically every time you complete a saving habit!
          </div>
        </motion.div>

        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className={styles.statLabel}>Monthly Surplus Savings</div>
          <div className={styles.statValueGreen}>+₹{monthlySavings.toLocaleString('en-IN')}</div>
          <div className={styles.statDetail}>
            Income vs expense flow for current month
          </div>
        </motion.div>

        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className={styles.statLabel}>Daily Habit Score</div>
          <div className={styles.statValue}>
            {completedCount} / {activeDailyHabits.length}
          </div>
          <div className={styles.statDetail}>
            {completedCount === activeDailyHabits.length
              ? '🔥 All daily financial habits completed!'
              : 'Complete remaining habits to keep your streak alive'}
          </div>
        </motion.div>
      </div>

      {/* Content Columns */}
      <div className={styles.contentGrid}>
        {/* Left: Today's Financial Habits Checklist */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Today's Financial Habits</h2>
              <p className={styles.panelSubtitle}>Check off your daily financial actions</p>
            </div>
            <Link to="/app/habits" className={styles.viewAllBtn}>
              Manage All <HiOutlineArrowRight />
            </Link>
          </div>

          <div className={styles.habitList}>
            {habits.slice(0, 4).map((habit) => (
              <div
                key={habit.id}
                className={`${styles.habitItem} ${habit.completedToday ? styles.completed : ''}`}
              >
                <div className={styles.habitIcon}>{habit.icon}</div>
                <div className={styles.habitInfo}>
                  <div className={styles.habitName}>{habit.name}</div>
                  <div className={styles.habitMeta}>
                    🔥 {habit.streak} day streak •{' '}
                    {habit.targetValue ? `+₹${habit.targetValue} to Piggy Bank` : 'Checkoff Habit'}
                  </div>
                </div>

                <button
                  className={`${styles.checkBtn} ${habit.completedToday ? styles.checkedBtn : ''}`}
                  onClick={() => !habit.completedToday && completeHabit(habit.id)}
                  disabled={habit.completedToday}
                >
                  {habit.completedToday ? (
                    <>
                      <HiOutlineCheckCircle className={styles.checkIcon} />
                      <span>Done Today</span>
                    </>
                  ) : (
                    <span>Complete (+₹{habit.targetValue || 0})</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Savings Goals Summary */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Active Savings Goals</h2>
              <p className={styles.panelSubtitle}>Tracking progress to milestones</p>
            </div>
            <Link to="/app/goals" className={styles.viewAllBtn}>
              View Goals <HiOutlineArrowRight />
            </Link>
          </div>

          <div className={styles.goalList}>
            {goals.slice(0, 3).map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className={styles.goalItem}>
                  <div className={styles.goalTop}>
                    <div className={styles.goalNameGroup}>
                      <span className={styles.goalIcon}>{goal.icon}</span>
                      <span className={styles.goalName}>{goal.name}</span>
                    </div>
                    <span className={styles.goalPercent}>{progress}%</span>
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%`, backgroundColor: goal.color || '#10B981' }}
                    />
                  </div>

                  <div className={styles.goalAmounts}>
                    <span>₹{goal.currentAmount.toLocaleString('en-IN')} saved</span>
                    <span>Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
