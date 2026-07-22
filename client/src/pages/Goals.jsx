import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineX, HiOutlineFlag, HiOutlineSparkles } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import styles from './Goals.module.css';

const Goals = () => {
  const { goals, addGoal, contributeGoal } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(null); // holds goalId
  const [contributeAmount, setContributeAmount] = useState('');

  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'emergency',
    icon: '🛡️',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    color: '#10B981'
  });

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;

    addGoal({
      ...newGoal,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: newGoal.currentAmount ? Number(newGoal.currentAmount) : 0
    });

    setShowModal(false);
    setNewGoal({
      name: '',
      category: 'emergency',
      icon: '🛡️',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      color: '#10B981'
    });
  };

  const handleQuickContribute = (e) => {
    e.preventDefault();
    if (showContributeModal && Number(contributeAmount) > 0) {
      contributeGoal(showContributeModal, contributeAmount);
      setContributeAmount('');
      setShowContributeModal(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Savings & <span className="gradient-text">Milestone Goals</span>
          </h1>
          <p className={styles.subtitle}>
            Track progress toward your financial milestones and watch every rupee add up.
          </p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Create Savings Goal
        </button>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {goals.map((goal) => {
          const progress = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <motion.div
              key={goal.id}
              className={`${styles.card} ${isCompleted ? styles.cardDone : ''}`}
              layout
            >
              <div className={styles.cardHeader}>
                <div className={styles.goalIcon}>{goal.icon}</div>
                <div className={styles.goalCategory}>
                  {goal.category?.toUpperCase() || 'MILESTONE'}
                </div>
              </div>

              <h3 className={styles.goalName}>{goal.name}</h3>

              <div className={styles.amountBox}>
                <div className={styles.amountCurrent}>
                  ₹{goal.currentAmount.toLocaleString('en-IN')}
                </div>
                <div className={styles.amountTarget}>
                  of ₹{goal.targetAmount.toLocaleString('en-IN')} target
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressLabels}>
                  <span>Progress</span>
                  <span className={styles.progressPercent}>{progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${progress}%`,
                      backgroundColor: goal.color || '#10B981'
                    }}
                  />
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.deadlineText}>
                  {goal.deadline ? `Target: ${goal.deadline}` : 'No fixed date'}
                </span>

                <button
                  className={styles.contributeBtn}
                  onClick={() => setShowContributeModal(goal.id)}
                  disabled={isCompleted}
                >
                  {isCompleted ? '🎉 Completed!' : '+ Contribute'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Modal */}
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
                <h3>Create New Savings Goal</h3>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Emergency Fund / New Car"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Target Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="100000"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Initial Saved Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newGoal.currentAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category & Icon</label>
                    <select
                      value={newGoal.icon}
                      onChange={(e) => {
                        const iconMap = {
                          '🛡️': 'emergency',
                          '🏖️': 'travel',
                          '🚗': 'vehicle',
                          '🏠': 'home',
                          '🚀': 'investment'
                        };
                        setNewGoal({
                          ...newGoal,
                          icon: e.target.value,
                          category: iconMap[e.target.value] || 'general'
                        });
                      }}
                    >
                      <option value="🛡️">🛡️ Emergency Fund</option>
                      <option value="🏖️">🏖️ Travel & Vacation</option>
                      <option value="🚗">🚗 Vehicle Purchase</option>
                      <option value="🏠">🏠 Home & Real Estate</option>
                      <option value="🚀">🚀 Wealth Investment</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Theme Color</label>
                    <select
                      value={newGoal.color}
                      onChange={(e) => setNewGoal({ ...newGoal, color: e.target.value })}
                    >
                      <option value="#10B981">Emerald Green</option>
                      <option value="#3B82F6">Royal Indigo Blue</option>
                      <option value="#F59E0B">Amber Gold</option>
                      <option value="#8B5CF6">Purple Accent</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Target Date (Optional)</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
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
                    Create Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Quick Contribute Modal */}
        {showContributeModal && (
          <div className={styles.modalBackdrop}>
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className={styles.modalHeader}>
                <h3>Contribute to Goal</h3>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowContributeModal(null)}
                >
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleQuickContribute} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Amount to Contribute (₹)</label>
                  <input
                    type="number"
                    required
                    autoFocus
                    placeholder="2500"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowContributeModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Add Contribution
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
