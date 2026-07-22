import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineFlag,
  HiOutlineTrendingUp,
  HiOutlineCurrencyRupee,
  HiOutlineChartPie,
  HiOutlineLogout
} from 'react-icons/hi';
import { useApp } from '../../context/AppContext';
import AnimatedNumber from '../common/AnimatedNumber';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, piggyBankBalance, logout } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: HiOutlineHome, exact: true },
    { name: 'Financial Habits', path: '/app/habits', icon: HiOutlineSparkles },
    { name: 'Savings Goals', path: '/app/goals', icon: HiOutlineFlag },
    { name: 'Wealth Growth', path: '/app/wealth', icon: HiOutlineTrendingUp },
    { name: 'Income & Expense', path: '/app/transactions', icon: HiOutlineCurrencyRupee },
    { name: 'Reports & Analytics', path: '/app/reports', icon: HiOutlineChartPie },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Brand Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>💰</div>
          <span>Wealth<span className="gradient-text">Habit</span></span>
        </Link>
      </div>

      {/* Piggy Bank Quick Widget */}
      <div className={styles.piggyWidget}>
        <div className={styles.piggyHeader}>
          <span className={styles.piggyIcon}>🐷</span>
          <span className={styles.piggyTitle}>Virtual Piggy Bank</span>
        </div>
        <div className={styles.piggyAmount}>
          <AnimatedNumber value={piggyBankBalance} prefix="₹" />
        </div>
        <div className={styles.piggySubtitle}>
          Auto-saved from completed daily habits
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSectionLabel}>MENU</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Icon className={styles.navIcon} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user?.avatar || '👨‍💻'}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userLevel}>{user?.level || 'Wealth Builder'}</div>
          </div>
          <Link
            to="/"
            onClick={logout}
            className={styles.logoutBtn}
            title="Logout of session"
          >
            <HiOutlineLogout />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
