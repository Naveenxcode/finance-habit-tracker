import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineX, HiOutlineCurrencyRupee, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import styles from './Transactions.module.css';

const Transactions = () => {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, totalIncomeMonth, totalExpenseMonth, monthlySavings } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);

  const [newTx, setNewTx] = useState({
    title: '',
    type: 'expense',
    category: 'groceries',
    amount: ''
  });

  const filteredTx = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  const handleOpenCreate = () => {
    setEditingTxId(null);
    setNewTx({ title: '', type: 'expense', category: 'groceries', amount: '' });
    setShowModal(true);
  };

  const handleEditClick = (tx) => {
    setEditingTxId(tx.id);
    setNewTx({
      title: tx.title || '',
      type: tx.type || 'expense',
      category: tx.category || 'groceries',
      amount: tx.amount || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleSaveTx = (e) => {
    e.preventDefault();
    if (!newTx.title || !newTx.amount) return;
    if (editingTxId) {
      updateTransaction(editingTxId, {
        ...newTx,
        amount: Number(newTx.amount)
      });
    } else {
      addTransaction({
        ...newTx,
        amount: Number(newTx.amount)
      });
    }
    setShowModal(false);
    setEditingTxId(null);
    setNewTx({ title: '', type: 'expense', category: 'groceries', amount: '' });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Income & <span className="gradient-text">Expense Tracker</span>
          </h1>
          <p className={styles.subtitle}>
            Every rupee accounted for. Keep your cash flow healthy and positive.
          </p>
        </div>
        <button className={styles.createBtn} onClick={handleOpenCreate}>
          <HiOutlinePlus /> Log Transaction
        </button>
      </div>

      {/* Cash Flow Overview */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Income (This Month)</div>
          <div className={styles.summaryGreen}>₹{totalIncomeMonth.toLocaleString('en-IN')}</div>
          <div className={styles.summarySub}>Inflows & earnings</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Expense (This Month)</div>
          <div className={styles.summaryRed}>₹{totalExpenseMonth.toLocaleString('en-IN')}</div>
          <div className={styles.summarySub}>Outflows & spending</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Net Cash Flow Surplus</div>
          <div className={styles.summaryGold}>₹{monthlySavings.toLocaleString('en-IN')}</div>
          <div className={styles.summarySub}>
            Savings Rate: {totalIncomeMonth ? Math.round((monthlySavings / totalIncomeMonth) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        {['all', 'income', 'expense'].map((t) => (
          <button
            key={t}
            className={`${styles.filterBtn} ${filterType === t ? styles.activeFilter : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Transactions Table/List */}
      <div className={styles.listCard}>
        {filteredTx.map((tx) => (
          <div key={tx.id} className={styles.txRow}>
            <div className={styles.txLeft}>
              <div
                className={`${styles.txIcon} ${
                  tx.type === 'income' ? styles.txIconGreen : styles.txIconRed
                }`}
              >
                <HiOutlineCurrencyRupee />
              </div>
              <div>
                <div className={styles.txTitle}>{tx.title}</div>
                <div className={styles.txMeta}>
                  {tx.category.toUpperCase()} • {tx.date}
                </div>
              </div>
            </div>

            <div className={styles.txRight}>
              <div
                className={
                  tx.type === 'income' ? styles.amountGreen : styles.amountRed
                }
              >
                {tx.type === 'income' ? '+' : '-'}₹
                {Number(tx.amount).toLocaleString('en-IN')}
              </div>
              <div className={styles.txActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => handleEditClick(tx)}
                  title="Edit Transaction"
                >
                  <HiOutlinePencil />
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDeleteClick(tx.id)}
                  title="Delete Transaction"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
                <h3>{editingTxId ? 'Edit Transaction' : 'Log Income or Expense'}</h3>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleSaveTx} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grocery Supermarket / Freelance Payment"
                    value={newTx.title}
                    onChange={(e) => setNewTx({ ...newTx, title: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Type</label>
                    <select
                      value={newTx.type}
                      onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                    >
                      <option value="expense">Expense (-)</option>
                      <option value="income">Income (+)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="4500"
                      value={newTx.amount}
                      onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  >
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="groceries">Groceries</option>
                    <option value="rent">Rent / Housing</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="investment">Investment SIP</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    {editingTxId ? 'Update Transaction' : 'Save Transaction'}
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

export default Transactions;
