import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    num: '01',
    icon: '📋',
    title: 'Set Up Your Profile',
    desc: 'Tell us about your income, expenses, and financial goals. We\'ll create a personalized plan just for you.',
  },
  {
    num: '02',
    icon: '🔄',
    title: 'Build Daily Habits',
    desc: 'Choose financial habits — save daily, track expenses, invest monthly. We\'ll remind you and track your streaks.',
  },
  {
    num: '03',
    icon: '📈',
    title: 'Watch Wealth Grow',
    desc: 'See your net worth rise, goals get crushed, and habits become second nature. Your future self will thank you.',
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.header}
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>How It <span className="gradient-text">Works</span></h2>
          <p>Three simple steps to financial freedom</p>
        </motion.div>

        <div className={styles.stepsContainer}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className={styles.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className={styles.numBadge}>{step.num}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}

          {/* Connecting Lines */}
          <div className={styles.connector} />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
