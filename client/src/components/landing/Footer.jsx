import { HiSparkles } from 'react-icons/hi2';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <a href="/" className={styles.logo}>
            <HiSparkles className={styles.logoIcon} />
            <span>WealthHabit</span>
          </a>
          <p className={styles.tagline}>Build wealth, one habit at a time.</p>
          <div className={styles.socials}>
            <a href="https://github.com/Naveenxcode" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub"><FiGithub /></a>
            <a href="https://x.com/ChhabilaKumarP2" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X (Twitter)"><FaXTwitter /></a>
            <a href="https://www.linkedin.com/in/chhabila-kumar-pradhan-441022208/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn"><FiLinkedin /></a>
          </div>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>Product</h4>
          <a href="#" className={styles.footerLink}>Features</a>
          <a href="#" className={styles.footerLink}>Pricing</a>
          <a href="#" className={styles.footerLink}>Dashboard</a>
          <a href="#" className={styles.footerLink}>Mobile App</a>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>Company</h4>
          <a href="#" className={styles.footerLink}>About</a>
          <a href="#" className={styles.footerLink}>Blog</a>
          <a href="#" className={styles.footerLink}>Careers</a>
          <a href="#" className={styles.footerLink}>Contact</a>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>Legal</h4>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <a href="#" className={styles.footerLink}>Terms of Service</a>
          <a href="#" className={styles.footerLink}>Security</a>
          <a href="#" className={styles.footerLink}>Cookie Policy</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <span>© 2026 WealthHabit. All rights reserved.</span>
            <span>Made with 💚 in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
