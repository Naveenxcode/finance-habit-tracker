import { useEffect, useRef, useState } from 'react';
import styles from './Stats.module.css';

const statsData = [
  { value: 10000, suffix: '+', label: 'Active Users' },
  { value: 50, prefix: '₹', suffix: 'Cr+', label: 'Wealth Tracked' },
  { value: 95, suffix: '%', label: 'Habit Completion Rate' },
  { value: 2500, suffix: '+', label: 'Goals Achieved' },
];

const AnimatedCounter = ({ target, prefix = '', suffix = '', inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  const formatted = count >= 1000 && !suffix.includes('Cr')
    ? count.toLocaleString('en-IN')
    : count;

  return (
    <span className={styles.number}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

const Stats = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.stats} ref={ref}>
      <div className={`container ${styles.grid}`}>
        {statsData.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <AnimatedCounter
              target={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              inView={inView}
            />
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
