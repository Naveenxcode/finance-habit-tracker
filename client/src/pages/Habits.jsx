import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlineX
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import AnimatedNumber from '../components/common/AnimatedNumber';
import styles from './Habits.module.css';

const Habits = () => {
  const {
    habits,
    completeHabit,
    addHabit,
    deleteHabit,
    piggyBankBalance,
    setPiggyBankBalance,
    goals
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showPiggyDepositModal, setShowPiggyDepositModal] = useState(false);
  const [customPiggyAmount, setCustomPiggyAmount] = useState('');
  const [piggyDepositSuccess, setPiggyDepositSuccess] = useState(false);
  const [lastDepositAmt, setLastDepositAmt] = useState(0);

  // New habit form state
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'savings',
    icon: '💰',
    targetValue: '',
    frequency: 'daily',
    customDays: '5',
    linkedGoalId: ''
  });

  const filteredHabits = habits.filter((h) => {
    if (activeTab === 'all') return true;
    return h.category === activeTab || h.frequency === activeTab;
  });

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!newHabit.name) return;

    addHabit({
      ...newHabit,
      targetValue: newHabit.targetValue ? Number(newHabit.targetValue) : 0,
      description:
        newHabit.frequency === 'custom'
          ? `Every ${newHabit.customDays} days automated savings habit`
          : `${newHabit.frequency} financial discipline habit`
    });

    setShowModal(false);
    setNewHabit({
      name: '',
      category: 'savings',
      icon: '💰',
      targetValue: '',
      frequency: 'daily',
      customDays: '5',
      linkedGoalId: ''
    });
  };

  const handleManualDeposit = (e) => {
    e.preventDefault();
    const amt = Number(customPiggyAmount);
    if (amt > 0) {
      setLastDepositAmt(amt);
      setPiggyBankBalance((prev) => prev + amt);
      setPiggyDepositSuccess(true);
      setTimeout(() => {
        setPiggyDepositSuccess(false);
        setShowPiggyDepositModal(false);
        setCustomPiggyAmount('');
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      {/* Interactive Piggy Bank Hero Section */}
      <div className={styles.piggyHero}>
        <div className={styles.piggyLeft}>
          <div className={styles.piggyBadge}>
            <span className={styles.piggyEmoji}>🐷</span>
            <span>Virtual Piggy Bank Showcase</span>
          </div>
          <h1 className={styles.piggyTitle}>
            Your automated discipline vault has saved{' '}
            <span className="gradient-text-gold">
              <AnimatedNumber value={piggyBankBalance} prefix="₹" />
            </span>
          </h1>
          <p className={styles.piggyDesc}>
            Every time you complete a saving habit or discipline checkoff, your virtual piggy bank grows.
            Link it to your real-world accounts or savings goals.
          </p>

          <div className={styles.piggyActions}>
            <button
              className={styles.piggyDepositBtn}
              onClick={() => {
                setPiggyDepositSuccess(false);
                setShowPiggyDepositModal(true);
              }}
            >
              <HiOutlinePlus /> Add Extra Deposit
            </button>
            <div className={styles.piggyStatTag}>
              🔥 {habits.filter((h) => h.completedToday).length} habits completed today
            </div>
          </div>
        </div>

        <div className={styles.piggyVisual}>
          <div className={styles.piggyCard3D}>
            <div className={styles.piggyGlow} />
            <div className={styles.piggyIconBig}>🐷</div>
            <div className={styles.piggyCardTitle}>PIGGY VAULT RESERVE</div>
            <div className={styles.piggyCardAmount}>
              <AnimatedNumber value={piggyBankBalance} prefix="₹" />
            </div>
            <div className={styles.piggyCardFooter}>
              <span>STATUS: AUTO-SAVING</span>
              <span>GROWTH: +14.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.filterTabs}>
          {['all', 'daily', 'weekly', 'savings', 'mindset'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <button className={styles.createBtn} onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Create Financial Habit
        </button>
      </div>

      {/* Habits Grid */}
      <div className={styles.grid}>
        {filteredHabits.map((habit) => (
          <motion.div
            key={habit.id}
            className={`${styles.card} ${habit.completedToday ? styles.cardCompleted : ''}`}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>{habit.icon}</div>
              <div className={styles.cardActions}>
                <span className={styles.streakBadge}>🔥 {habit.streak}d streak</span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteHabit(habit.id)}
                  title="Delete Habit"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </div>

            <h3 className={styles.habitTitle}>{habit.name}</h3>
            <p className={styles.habitDesc}>
              {habit.description || `${habit.frequency} financial checkoff`}
            </p>

            <div className={styles.cardFooter}>
              <div className={styles.valueInfo}>
                <span className={styles.valueLabel}>Piggy Contribution</span>
                <span className={styles.valueAmount}>
                  {habit.targetValue ? `₹${habit.targetValue}` : 'Checkoff'}
                </span>
              </div>

              <button
                className={`${styles.actionBtn} ${habit.completedToday ? styles.doneBtn : ''}`}
                onClick={() => !habit.completedToday && completeHabit(habit.id)}
                disabled={habit.completedToday}
              >
                {habit.completedToday ? (
                  <>
                    <HiOutlineCheckCircle /> Done
                  </>
                ) : (
                  <>
                    <HiOutlineSparkles /> Complete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Habit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className={styles.modalBackdrop}>
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className={styles.modalHeader}>
                <h3>Create New Financial Habit</h3>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Habit Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Save ₹1,000 every 5 days"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                    >
                      <option value="savings">Savings & Deposit</option>
                      <option value="tracking">Expense Tracking</option>
                      <option value="investment">Investing & SIP</option>
                      <option value="mindset">Mindset & Spending</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Icon Emoji</label>
                    <select
                      value={newHabit.icon}
                      onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                    >
                      <option value="💰">💰 Piggy Bank</option>
                      <option value="📈">📈 Stock Growth</option>
                      <option value="🥗">🥗 No Junk Food</option>
                      <option value="☕">☕ Coffee Saving</option>
                      <option value="🛡️">🛡️ Safety Fund</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Amount to Save (₹)</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={newHabit.targetValue}
                      onChange={(e) => setNewHabit({ ...newHabit, targetValue: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Frequency</label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Every N Days (Custom)</option>
                    </select>
                  </div>
                </div>

                {newHabit.frequency === 'custom' && (
                  <div className={styles.formGroup}>
                    <label>Every How Many Days?</label>
                    <input
                      type="number"
                      min="2"
                      max="60"
                      value={newHabit.customDays}
                      onChange={(e) => setNewHabit({ ...newHabit, customDays: e.target.value })}
                      placeholder="5 (e.g. Once every 5 days)"
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Link to Savings Goal (Optional)</label>
                  <select
                    value={newHabit.linkedGoalId}
                    onChange={(e) => setNewHabit({ ...newHabit, linkedGoalId: e.target.value })}
                  >
                    <option value="">No linked goal</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.icon} {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Create Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Manual Deposit Modal */}
        {showPiggyDepositModal && (
          <div className={styles.modalBackdrop}>
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              {piggyDepositSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: 'center', padding: '2.5rem 1rem' }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉 🐷 ✨</div>
                  <h3 style={{ color: '#10B981', fontSize: '1.6rem', marginBottom: '0.6rem' }}>
                    +₹{lastDepositAmt.toLocaleString('en-IN')} Deposited!
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                    Your virtual piggy bank is growing right before your eyes...
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className={styles.modalHeader}>
                    <h3>Deposit into Virtual Piggy Bank</h3>
                    <button
                      className={styles.closeBtn}
                      onClick={() => setShowPiggyDepositModal(false)}
                    >
                      <HiOutlineX />
                    </button>
                  </div>

                  <form onSubmit={handleManualDeposit} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label>Deposit Amount (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="500"
                        autoFocus
                        value={customPiggyAmount}
                        onChange={(e) => setCustomPiggyAmount(e.target.value)}
                      />
                    </div>
                    <div className={styles.modalActions}>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => setShowPiggyDepositModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className={styles.submitBtn}>
                        Deposit to Piggy Bank
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Habits;
