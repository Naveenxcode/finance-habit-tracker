import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiChatBubbleBottomCenterText } from 'react-icons/hi2';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    avatar: '👨‍💻',
    name: 'Rahul S.',
    role: 'Software Developer',
    quote: 'I went from saving 12% of my income to 37% in just 5 months. The streak system is addictive — in the best way possible!',
    color: '#10B981',
  },
  {
    avatar: '👩‍🎓',
    name: 'Priya M.',
    role: 'MBA Student',
    quote: 'As a student, tracking every rupee felt overwhelming. WealthHabit made it feel like a game. I\'ve saved ₹30,000 for my emergency fund!',
    color: '#6366F1',
  },
  {
    avatar: '👨‍💼',
    name: 'Arjun K.',
    role: 'Freelancer',
    quote: 'The wealth growth dashboard is incredible. Seeing my net worth go from negative to positive was the most satisfying moment ever.',
    color: '#F59E0B',
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.header}
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Loved by <span className="gradient-text-gold">Thousands</span></h2>
          <p>See what our users say about their financial transformation</p>
        </motion.div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <HiChatBubbleBottomCenterText className={styles.quoteIcon} />
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.author}>
                <div
                  className={styles.avatarCircle}
                  style={{ background: `${t.color}20`, borderColor: `${t.color}40` }}
                >
                  <span>{t.avatar}</span>
                </div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
