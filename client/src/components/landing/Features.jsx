import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Features.module.css';

const features = [
  {
    icon: '🔥',
    title: 'Habit Tracking',
    desc: 'Build daily financial habits with streaks, reminders, and satisfying check-off animations.',
    color: '#EF4444',
  },
  {
    icon: '💰',
    title: 'Smart Savings',
    desc: 'Set goals, watch your interactive piggy bank grow, and celebrate every milestone.',
    color: '#10B981',
  },
  {
    icon: '📊',
    title: 'Expense Insights',
    desc: 'Know exactly where every rupee goes with visual breakdowns and spending trends.',
    color: '#6366F1',
  },
  {
    icon: '📈',
    title: 'Wealth Dashboard',
    desc: 'Track your net worth growth in real-time with beautiful charts and milestones.',
    color: '#3B82F6',
  },
  {
    icon: '🎯',
    title: 'Goal Crusher',
    desc: 'Set financial goals with deadlines and smart insights to keep you on track.',
    color: '#F59E0B',
  },
  {
    icon: '🏆',
    title: 'Achievements',
    desc: 'Earn badges for consistency — from First Flame to Yearly Legend. Gamify your finances.',
    color: '#A855F7',
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className={styles.features}>
      <div className="container">
        <motion.div
          className={styles.header}
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Everything You Need to <span className="gradient-text">Build Wealth</span></h2>
          <p>Powerful tools designed to make financial discipline feel effortless and rewarding.</p>
        </motion.div>

        <div className={styles.grid}>
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className={styles.iconCircle}
                style={{ background: `${feat.color}15`, boxShadow: `0 0 30px ${feat.color}10` }}
              >
                <span className={styles.icon}>{feat.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
