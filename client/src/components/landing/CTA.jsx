import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import styles from './CTA.module.css';

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/auth');
  };

  return (
    <section className={styles.cta}>
      <div className={styles.glow} />
      <div className="container">
        <motion.div
          className={styles.content}
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Build Your <span className="gradient-text">Wealth</span>?</h2>
          <p>Join 10,000+ users who are transforming their financial future, one habit at a time.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              type="submit"
              className={styles.submitBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
              <HiArrowRight />
            </motion.button>
          </form>

          <p className={styles.disclaimer}>Free forever. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
