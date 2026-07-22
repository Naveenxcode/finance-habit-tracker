import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiPlay } from 'react-icons/hi2';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      {/* Background Orbs */}
      <div className={styles.orbGreen} />
      <div className={styles.orbIndigo} />
      <div className={styles.orbGold} />
      <div className={styles.gridOverlay} />

      <div className={`container ${styles.heroInner}`}>
        {/* Left: Text Content */}
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className={styles.badgeDot} />
            <span>Trusted by 10,000+ users across India</span>
          </motion.div>

          <h1 className={styles.heading}>
            Build <span className="gradient-text">Wealth</span>,<br />
            One Habit at a Time
          </h1>

          <p className={styles.subtext}>
            Transform your financial future with smart habits. Track savings, build
            streaks, crush goals — and watch your wealth grow every single day.
          </p>

          <div className={styles.ctaGroup}>
            <Link to="/auth" className={styles.primaryCta}>
              Start Building Wealth
              <HiArrowRight />
            </Link>
            <motion.button
              className={styles.secondaryCta}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <HiPlay />
              See How It Works
            </motion.button>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.avatarStack}>
              <div className={styles.avatar} style={{ background: '#10B981' }}>R</div>
              <div className={styles.avatar} style={{ background: '#6366F1' }}>P</div>
              <div className={styles.avatar} style={{ background: '#F59E0B' }}>A</div>
              <div className={styles.avatar} style={{ background: '#EF4444' }}>S</div>
            </div>
            <span className={styles.socialText}>
              <strong>4,200+</strong> people started their journey this month
            </span>
          </div>
        </motion.div>

        {/* Right: Floating Dashboard Cards */}
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {/* Main Dashboard Card */}
          <motion.div
            className={`${styles.dashCard} ${styles.mainCard}`}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Net Worth</span>
              <span className={styles.cardBadge}>+18.4%</span>
            </div>
            <div className={styles.cardValue}>₹1,24,500</div>
            <div className={styles.miniChart}>
              <svg viewBox="0 0 200 60" className={styles.chartSvg}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(16,185,129,0.3)" />
                    <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,50 Q25,45 50,38 T100,28 T150,15 T200,8"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0,50 Q25,45 50,38 T100,28 T150,15 T200,8 V60 H0 Z"
                  fill="url(#chartGrad)"
                />
              </svg>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            className={`${styles.dashCard} ${styles.streakCard}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <span className={styles.streakEmoji}>🔥</span>
            <div>
              <div className={styles.streakCount}>32 Day Streak</div>
              <div className={styles.streakLabel}>Saving ₹1,000 daily</div>
            </div>
          </motion.div>

          {/* Goal Card */}
          <motion.div
            className={`${styles.dashCard} ${styles.goalCard}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className={styles.goalTop}>
              <span>🎯</span>
              <span className={styles.goalName}>Emergency Fund</span>
            </div>
            <div className={styles.goalProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '73%' }} />
              </div>
              <span className={styles.goalPercent}>73%</span>
            </div>
            <div className={styles.goalAmount}>₹36,500 / ₹50,000</div>
          </motion.div>

          {/* Badge Card */}
          <motion.div
            className={`${styles.dashCard} ${styles.badgeCard}`}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            <span className={styles.badgeEmoji}>🏆</span>
            <span className={styles.badgeText}>Week Warrior Unlocked!</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
