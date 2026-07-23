import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX, HiOutlineBell } from 'react-icons/hi';
import Sidebar from './Sidebar';
import UserProfileModal from '../common/UserProfileModal';
import { useApp } from '../../context/AppContext';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }


  return (
    <div className={styles.appShell}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.mainContainer}>
        {/* Top Header */}
        <header className={styles.topBar}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>

          <div className={styles.topBarRight}>
            <div className={styles.badgeBanner}>
              🔥 <span className={styles.streakText}>14 Day Streak</span>
            </div>
            <button className={styles.notifBtn} aria-label="Notifications">
              <HiOutlineBell />
              <span className={styles.notifDot} />
            </button>
            <UserProfileModal isLanding={false} />
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
