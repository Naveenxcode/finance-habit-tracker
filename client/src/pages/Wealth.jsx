import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineX, HiOutlineTrendingUp } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import AnimatedNumber from '../components/common/AnimatedNumber';
import styles from './Wealth.module.css';

const Wealth = () => {
  const {
    assets,
    addAsset,
    deleteAsset,
    liabilities,
    addLiability,
    deleteLiability,
    totalAssets,
    totalLiabilities,
    netWorth
  } = useApp();

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'mutual_funds',
    value: '',
    growth: '12.5'
  });

  const [newLiability, setNewLiability] = useState({
    name: '',
    type: 'credit_card',
    originalAmount: '',
    remainingAmount: '',
    emi: ''
  });

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.value) return;
    addAsset({
      ...newAsset,
      value: Number(newAsset.value),
      growth: Number(newAsset.growth || 0)
    });
    setShowAssetModal(false);
    setNewAsset({ name: '', category: 'mutual_funds', value: '', growth: '12.5' });
  };

  const handleCreateLiability = (e) => {
    e.preventDefault();
    if (!newLiability.name || !newLiability.remainingAmount) return;
    addLiability({
      ...newLiability,
      originalAmount: Number(newLiability.originalAmount || newLiability.remainingAmount),
      remainingAmount: Number(newLiability.remainingAmount),
      emi: Number(newLiability.emi || 0)
    });
    setShowLiabilityModal(false);
    setNewLiability({ name: '', type: 'credit_card', originalAmount: '', remainingAmount: '', emi: '' });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Wealth Growth & <span className="gradient-text">Net Worth</span>
          </h1>
          <p className={styles.subtitle}>
            Monitor your real-time balance sheet, investments, and debt freedom roadmap.
          </p>
        </div>
        <div className={styles.headerBtns}>
          <button className={styles.addAssetBtn} onClick={() => setShowAssetModal(true)}>
            <HiOutlinePlus /> Add Asset
          </button>
          <button className={styles.addLiabBtn} onClick={() => setShowLiabilityModal(true)}>
            <HiOutlinePlus /> Add Liability
          </button>
        </div>
      </div>

      {/* Net Worth Hero Banner */}
      <div className={styles.netWorthBanner}>
        <div className={styles.bannerMain}>
          <span className={styles.bannerTag}>CURRENT NET WORTH</span>
          <div className={styles.netWorthBig}>
            <AnimatedNumber value={netWorth} prefix="₹" />
          </div>
          <div className={styles.ratioBar}>
            <span>Assets: <AnimatedNumber value={totalAssets} prefix="₹" /></span>
            <span>Liabilities: <AnimatedNumber value={totalLiabilities} prefix="₹" /></span>
          </div>
        </div>

        <div className={styles.ratioCard}>
          <div className={styles.ratioTitle}>ASSET / DEBT HEALTH</div>
          <div className={styles.ratioValue}>
            {totalLiabilities > 0
              ? `${(totalAssets / totalLiabilities).toFixed(1)}x`
              : 'Debt-Free! 🎉'}
          </div>
          <div className={styles.ratioSub}>
            {totalLiabilities === 0
              ? '100% of wealth is yours'
              : 'Target ratio > 3.0x'}
          </div>
        </div>
      </div>

      {/* Assets & Liabilities Side-by-Side */}
      <div className={styles.splitGrid}>
        {/* Assets Panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Assets & Investments</h2>
              <p className={styles.panelSubtitle}>Total: ₹{totalAssets.toLocaleString('en-IN')}</p>
            </div>
            <button className={styles.iconAddBtn} onClick={() => setShowAssetModal(true)}>
              <HiOutlinePlus />
            </button>
          </div>

          <div className={styles.list}>
            {assets.map((asset) => (
              <div key={asset.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{asset.name}</div>
                  <div className={styles.itemCategory}>
                    {asset.category.replace('_', ' ').toUpperCase()} • +{asset.growth}% p.a.
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.itemValueGreen}>
                    ₹{Number(asset.value).toLocaleString('en-IN')}
                  </span>
                  <button
                    className={styles.delBtn}
                    onClick={() => deleteAsset(asset.id)}
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Liabilities & Debts</h2>
              <p className={styles.panelSubtitle}>
                Total: ₹{totalLiabilities.toLocaleString('en-IN')}
              </p>
            </div>
            <button className={styles.iconAddBtn} onClick={() => setShowLiabilityModal(true)}>
              <HiOutlinePlus />
            </button>
          </div>

          <div className={styles.list}>
            {liabilities.map((liab) => (
              <div key={liab.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{liab.name}</div>
                  <div className={styles.itemCategory}>
                    {liab.type.replace('_', ' ').toUpperCase()}{' '}
                    {liab.emi ? `• EMI ₹${liab.emi}/mo` : ''}
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.itemValueRed}>
                    ₹{Number(liab.remainingAmount).toLocaleString('en-IN')}
                  </span>
                  <button
                    className={styles.delBtn}
                    onClick={() => deleteLiability(liab.id)}
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Modal */}
      <AnimatePresence>
        {showAssetModal && (
          <div className={styles.modalBackdrop}>
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className={styles.modalHeader}>
                <h3>Add New Asset / Investment</h3>
                <button className={styles.closeBtn} onClick={() => setShowAssetModal(false)}>
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mutual Fund Portfolio / Bank FD"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                      value={newAsset.category}
                      onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                    >
                      <option value="bank_cash">Bank Account / Cash</option>
                      <option value="mutual_funds">Mutual Funds</option>
                      <option value="stocks">Direct Equity / Stocks</option>
                      <option value="fixed_deposit">Fixed Deposit / PPF</option>
                      <option value="gold">Gold / Sovereign</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Current Value (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="150000"
                      value={newAsset.value}
                      onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Expected Annual Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12.5"
                    value={newAsset.growth}
                    onChange={(e) => setNewAsset({ ...newAsset, growth: e.target.value })}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowAssetModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Save Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Liability Modal */}
        {showLiabilityModal && (
          <div className={styles.modalBackdrop}>
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className={styles.modalHeader}>
                <h3>Add New Liability / Loan</h3>
                <button className={styles.closeBtn} onClick={() => setShowLiabilityModal(false)}>
                  <HiOutlineX />
                </button>
              </div>

              <form onSubmit={handleCreateLiability} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Liability / Loan Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Car Loan / Credit Card Balance"
                    value={newLiability.name}
                    onChange={(e) => setNewLiability({ ...newLiability, name: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Remaining Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="80000"
                      value={newLiability.remainingAmount}
                      onChange={(e) => setNewLiability({ ...newLiability, remainingAmount: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Monthly EMI (₹)</label>
                    <input
                      type="number"
                      placeholder="4500"
                      value={newLiability.emi}
                      onChange={(e) => setNewLiability({ ...newLiability, emi: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowLiabilityModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Save Liability
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

export default Wealth;
