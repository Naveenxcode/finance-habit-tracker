import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi2';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { useApp } from '../../context/AppContext';
import UserProfileModal from '../common/UserProfileModal';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navInner}`}>
        <a href="/" className={styles.logo}>
          <HiSparkles className={styles.logoIcon} />
          <span>WealthHabit</span>
        </a>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
          <button onClick={() => scrollTo('features')} className={styles.navLink}>Features</button>
          <button onClick={() => scrollTo('how-it-works')} className={styles.navLink}>How It Works</button>
          <button onClick={() => scrollTo('testimonials')} className={styles.navLink}>Testimonials</button>
        </div>

        <div className={styles.navActions}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/app" className={styles.ctaBtn}>Go to Dashboard</Link>
              <UserProfileModal isLanding={true} />
            </div>
          ) : (
            <>
              <Link to="/auth?mode=login" className={styles.loginBtn}>Login</Link>
              <Link to="/auth?mode=register" className={styles.ctaBtn}>Get Started</Link>
            </>
          )}
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <button onClick={() => scrollTo('features')} className={styles.mobileLink}>Features</button>
          <button onClick={() => scrollTo('how-it-works')} className={styles.mobileLink}>How It Works</button>
          <button onClick={() => scrollTo('testimonials')} className={styles.mobileLink}>Testimonials</button>
          <div className={styles.mobileActions}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Link to="/app" className={styles.ctaBtn} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <UserProfileModal isLanding={true} />
              </div>
            ) : (
              <>
                <Link to="/auth?mode=login" className={styles.loginBtn} onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/auth?mode=register" className={styles.ctaBtn} onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
