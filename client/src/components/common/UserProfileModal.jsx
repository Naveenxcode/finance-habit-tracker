import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineKey,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineCog
} from 'react-icons/hi';
import { useApp } from '../../context/AppContext';
import styles from './UserProfileModal.module.css';

const UserProfileModal = ({ isLanding = false }) => {
  const { user, logout, updateProfile } = useApp();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg({ text: 'Name cannot be empty', type: 'error' });
      return;
    }

    if (newPassword || confirmPassword || currentPassword) {
      if (newPassword !== confirmPassword) {
        setMsg({ text: 'New passwords do not match!', type: 'error' });
        return;
      }
      if (!currentPassword) {
        setMsg({ text: 'Please enter current password to update security settings', type: 'error' });
        return;
      }
    }

    updateProfile({ name });
    setMsg({ text: 'Profile updated successfully! ✅', type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        className={styles.avatarBtn}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={user.name}
        style={{ padding: user?.avatar?.startsWith('http') ? 0 : undefined, overflow: 'hidden' }}
      >
        {user?.avatar?.startsWith('http') ? (
          <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className={styles.avatarLetter}>{firstLetter}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={styles.dropdownHeader}>
              <div className={styles.dropName}>{user.name}</div>
              <div className={styles.dropEmail}>{user.email}</div>
              <div className={styles.dropLevel}>{user.level || 'Wealth Builder'}</div>
            </div>

            <div className={styles.dropdownDivider} />

            <button
              className={styles.dropdownItem}
              onClick={() => {
                setDropdownOpen(false);
                setProfileModalOpen(true);
              }}
            >
              <HiOutlineCog className={styles.dropIcon} />
              <span>Profile & Security</span>
            </button>

            {isLanding ? (
              <Link
                to="/app"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <HiOutlineHome className={styles.dropIcon} />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <HiOutlineHome className={styles.dropIcon} />
                <span>Landing Page</span>
              </Link>
            )}

            <div className={styles.dropdownDivider} />

            <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
              <HiOutlineLogout className={styles.dropIcon} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile & Password Edit Modal rendered via portal to escape top bar containment */}
      {createPortal(
        <AnimatePresence>
          {profileModalOpen && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={styles.modalBox}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <div className={styles.modalHeader}>
                  <h3>👤 Profile & Account Settings</h3>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => setProfileModalOpen(false)}
                  >
                    <HiOutlineX />
                  </button>
                </div>

                {msg.text && (
                  <div className={`${styles.msgBanner} ${styles[msg.type]}`}>
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className={styles.form}>
                  {/* Editable Name */}
                  <div className={styles.formGroup}>
                    <label>Full Name (Editable)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Non-Editable Email ID */}
                  <div className={styles.formGroup}>
                    <label>Email Address (Non-Editable)</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className={styles.disabledInput}
                      title="Email ID cannot be changed for security integrity"
                    />
                    <span className={styles.fieldNote}>🔒 Registered Email ID cannot be modified</span>
                  </div>

                  <div className={styles.sectionDivider}>
                    <span>SECURITY & PASSWORD CHANGE</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password to verify"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className={styles.passwordRow}>
                    <div className={styles.formGroup}>
                      <label>New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setProfileModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn}>
                      <HiOutlineCheck /> Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default UserProfileModal;
