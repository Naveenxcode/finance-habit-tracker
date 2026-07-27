import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';
import styles from './Auth.module.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registerUser, loginUser, loginWithGoogle, demoLogin } = useApp();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const [isLogin, setIsLogin] = useState(() => {
    return !location.search.includes('mode=register');
  });

  useEffect(() => {
    if (location.search.includes('mode=register')) {
      setIsLogin(false);
    } else if (location.search.includes('mode=login')) {
      setIsLogin(true);
    }
  }, [location.search]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.email || !formData.password || loading) return;
    if (!isLogin && !formData.name) return;
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
      } else {
        await registerUser(formData.name, formData.email, formData.password);
      }
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Incorrect email or password! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDemo = () => {
    setError('');
    demoLogin();
    navigate('/app');
  };

  const handleForgotSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <Link to="/" className={styles.backLink}>
          ← Back to Landing Page
        </Link>
      </div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className={styles.brand}>
          <span className={styles.logoIcon}>💰</span>
          <h2>Wealth<span className="gradient-text">Habit</span></h2>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${isLogin ? styles.activeTab : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${!isLogin ? styles.activeTab : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <motion.div
            className={styles.errorBanner}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="Naveen Pradhan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          {isLogin && (
            <button
              type="button"
              className={styles.forgotBtn}
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </button>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  ⏳
                </motion.span>
                <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              isLogin ? 'Sign In to Dashboard' : 'Start Building Wealth'
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In was unsuccessful.')}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            text={isLogin ? "signin_with" : "signup_with"}
            width="100%"
          />
        </div>

        <button type="button" className={styles.demoBtn} onClick={handleDemo}>
          🚀 One-Click Instant Demo Login
        </button>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
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
              <h3>🔑 Password Recovery</h3>
              {forgotSubmitted ? (
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', color: '#10B981', textAlign: 'center' }}>
                  ✅ Recovery link dispatched! Please check your inbox for instructions to reset your password.
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p>
                    Enter your registered email address below. We will send you a secure password reset link.
                  </p>
                  <div className={styles.formGroup}>
                    <label>Registered Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                  <div className={styles.modalBtns}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setShowForgotModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn} style={{ padding: '0.65rem 1.25rem', marginTop: 0 }}>
                      Send Recovery Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
