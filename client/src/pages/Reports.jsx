import React from 'react';
import * as XLSX from 'xlsx';
import { HiOutlineDownload, HiOutlineChartPie, HiOutlineTrendingUp } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import AnimatedNumber from '../components/common/AnimatedNumber';
import styles from './Reports.module.css';

const Reports = () => {
  const {
    totalIncomeMonth,
    totalExpenseMonth,
    monthlySavings,
    piggyBankBalance,
    netWorth,
    habits,
    goals = []
  } = useApp();

  const savingsRate = totalIncomeMonth
    ? Math.round((monthlySavings / totalIncomeMonth) * 100)
    : 0;

  const totalHabitCompletions = habits.reduce((s, h) => s + (h.streak || 0), 0);

  const handleExportExcel = () => {
    // Sheet 1: Summary Metrics
    const summaryData = [
      { Metric: 'Net Worth', Value: netWorth, Unit: 'INR' },
      { Metric: 'Virtual Piggy Bank Balance', Value: piggyBankBalance, Unit: 'INR' },
      { Metric: 'Monthly Gross Income', Value: totalIncomeMonth, Unit: 'INR' },
      { Metric: 'Monthly Total Expenses', Value: totalExpenseMonth, Unit: 'INR' },
      { Metric: 'Monthly Net Savings', Value: monthlySavings, Unit: 'INR' },
      { Metric: 'Monthly Savings Rate', Value: `${savingsRate}%`, Unit: 'Percentage' },
      { Metric: 'Total Habit Checkoff Score', Value: totalHabitCompletions, Unit: 'Days' }
    ];

    // Sheet 2: Habits Discipline
    const habitsData = habits.map(h => ({
      HabitName: h.name,
      Category: h.category,
      Frequency: h.frequency,
      StreakDays: h.streak || 0,
      CompletedToday: h.completedToday ? 'Yes' : 'No',
      TotalSaved: h.totalSaved || 0
    }));

    // Sheet 3: Savings Goals
    const goalsData = goals.map(g => ({
      GoalName: g.name,
      Category: g.category,
      TargetAmount: g.targetAmount || g.target || 0,
      CurrentAmount: g.currentAmount || g.current || 0,
      Status: g.status || 'Active'
    }));

    const workbook = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const habitsSheet = XLSX.utils.json_to_sheet(habitsData);
    const goalsSheet = XLSX.utils.json_to_sheet(goalsData);

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Financial Summary');
    XLSX.utils.book_append_sheet(workbook, habitsSheet, 'Habits & Piggy Vault');
    XLSX.utils.book_append_sheet(workbook, goalsSheet, 'Savings Goals');

    XLSX.writeFile(workbook, 'WealthHabit_Financial_Analysis_Report.xlsx');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Financial Reports & <span className="gradient-text">Analytics</span>
          </h1>
          <p className={styles.subtitle}>
            Deep dive into your financial discipline metrics and wealth trajectory.
          </p>
        </div>
        <button className={styles.exportBtn} onClick={handleExportExcel}>
          <HiOutlineDownload /> Export Report (Excel .xlsx)
        </button>
      </div>

      {/* Main Stats Banner */}
      <div className={styles.heroGrid}>
        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>MONTHLY SAVINGS RATE</div>
          <div className={styles.rateValue}>{savingsRate}%</div>
          <div className={styles.rateBar}>
            <div className={styles.rateFill} style={{ width: `${Math.max(0, savingsRate)}%` }} />
          </div>
          <div className={styles.heroSub}>Target recommendation: ≥ 30%</div>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>TOTAL HABIT CHECKOFF SCORE</div>
          <div className={styles.scoreValue}>
            <AnimatedNumber value={totalHabitCompletions} prefix="" suffix=" Days" />
          </div>
          <div className={styles.heroSub}>Cumulative discipline streak across all habits</div>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.heroLabel}>VIRTUAL PIGGY VAULT YIELD</div>
          <div className={styles.yieldValue}>
            <AnimatedNumber value={piggyBankBalance} prefix="₹" />
          </div>
          <div className={styles.heroSub}>Saved effortlessly through daily micro-habits</div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className={styles.sectionsGrid}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Monthly Cash Flow Summary</h2>
          <div className={styles.flowList}>
            <div className={styles.flowItem}>
              <span>Gross Monthly Inflow</span>
              <span className={styles.valGreen}>₹{totalIncomeMonth.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.flowItem}>
              <span>Total Monthly Outflow</span>
              <span className={styles.valRed}>₹{totalExpenseMonth.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.flowItemDivider} />
            <div className={styles.flowItem}>
              <span className={styles.flowBold}>Net Surplus Retained</span>
              <span className={styles.valGold}>₹{monthlySavings.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Discipline Efficiency Matrix</h2>
          <div className={styles.matrixList}>
            <div className={styles.matrixRow}>
              <span>Active Discipline Habits</span>
              <span className={styles.badgeVal}>{habits.length} Active</span>
            </div>
            <div className={styles.matrixRow}>
              <span>Completed Today</span>
              <span className={styles.badgeValGreen}>
                {habits.filter((h) => h.completedToday).length} Done
              </span>
            </div>
            <div className={styles.matrixRow}>
              <span>Discipline Level</span>
              <span className={styles.badgeValGold}>Level 3 Master</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
