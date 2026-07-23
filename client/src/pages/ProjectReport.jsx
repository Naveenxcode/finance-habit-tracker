import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSparkles, HiArrowLeft, HiOutlineServer, HiOutlineDatabase, HiOutlineShieldCheck, HiOutlineLightBulb, HiOutlineCode } from 'react-icons/hi';
import styles from './ProjectReport.module.css';

const ProjectReport = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.reportPage}>
      {/* Navbar for Report Page */}
      <nav className={styles.navbar}>
        <div className={`container ${styles.navInner}`}>
          <Link to="/" className={styles.logo}>
            <HiSparkles className={styles.logoIcon} />
            <span>WealthHabit</span>
          </Link>
          <Link to="/" className={styles.backBtn}>
            <HiArrowLeft /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="container container-wide">
        <header className={styles.header}>
          <div className={styles.badge}>Official Documentation</div>
          <h1 className={styles.title}>Project Report: WealthHabit</h1>
          <p className={styles.subtitle}>
            A comprehensive overview of the architecture, technology stack, and features powering the WealthHabit Financial Tracker application.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Left Column: Navigation / Quick Links */}
          <aside className={styles.sidebar}>
            <div className={styles.toc}>
              <h3>Contents</h3>
              <ul>
                <li><a href="#overview">1. Project Overview</a></li>
                <li><a href="#architecture">2. System Architecture</a></li>
                <li><a href="#database">3. Database Schema</a></li>
                <li><a href="#features">4. Key Features</a></li>
                <li><a href="#deployment">5. Deployment & Security</a></li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Content */}
          <div className={styles.content}>
            
            {/* Section 1: Overview */}
            <section id="overview" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineLightBulb /></div>
                <h2>1. Project Overview</h2>
              </div>
              <p>
                <strong>WealthHabit</strong> is a full-stack financial habit builder and wealth tracking platform designed to help users transform their financial futures through consistent daily actions.
              </p>
              <div className={styles.highlightCard}>
                <h4>The Problem</h4>
                <p>Most financial tools only track past expenses. They fail to build the proactive psychology required for long-term wealth accumulation.</p>
                <h4 style={{ marginTop: '1rem' }}>The Solution</h4>
                <p>WealthHabit merges traditional net worth tracking with gamified habit building. By rewarding daily streaks (e.g., "Saved ₹100 today", "Read financial news"), users stay motivated to achieve their larger savings goals.</p>
              </div>
            </section>

            {/* Section 2: Architecture */}
            <section id="architecture" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineCode /></div>
                <h2>2. System Architecture</h2>
              </div>
              <p>The application is built on the modern <strong>MERN</strong> stack (MongoDB, Express, React, Node.js) utilizing a decoupled client-server architecture.</p>
              
              <div className={styles.techStack}>
                <div className={styles.techItem}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" />
                  <div>
                    <h5>Frontend (Client)</h5>
                    <p>React 18, Vite, React Router v6, CSS Modules. Features an optimistic UI with a custom Dual-Write Engine (Context API) that updates the interface instantly while syncing with the server in the background.</p>
                  </div>
                </div>
                <div className={styles.techItem}>
                  <img src="https://nodejs.org/static/images/logo.svg" alt="Node" style={{ filter: 'brightness(0) invert(1)' }} />
                  <div>
                    <h5>Backend (Server)</h5>
                    <p>Node.js & Express.js. RESTful API architecture following MVC patterns. Includes error handling middleware and stateless JWT authentication.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Database */}
            <section id="database" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineDatabase /></div>
                <h2>3. Database Schema</h2>
              </div>
              <p>Powered by MongoDB Atlas, utilizing Mongoose ODM for strict schema validation. The database is highly normalized across several primary collections:</p>
              
              <div className={styles.schemaGrid}>
                <div className={styles.schemaCard}>
                  <h4>Users</h4>
                  <code>_id, email, password, name, level, streakDays, totalScore</code>
                </div>
                <div className={styles.schemaCard}>
                  <h4>Habits</h4>
                  <code>_id, user, title, frequency, streak, lastCompleted, isCompletedToday</code>
                </div>
                <div className={styles.schemaCard}>
                  <h4>SavingsGoals</h4>
                  <code>_id, user, name, targetAmount, currentAmount, category, deadline</code>
                </div>
                <div className={styles.schemaCard}>
                  <h4>Assets & Liabilities</h4>
                  <code>_id, user, name, value, category, interestRate</code>
                </div>
              </div>
            </section>

            {/* Section 4: Features */}
            <section id="features" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineServer /></div>
                <h2>4. Key Features</h2>
              </div>
              <ul className={styles.featureList}>
                <li>
                  <strong>Gamified Habit Engine:</strong> Tracks daily habits, calculates streaks automatically based on timestamps, and visualizes monthly completion rates.
                </li>
                <li>
                  <strong>Dynamic Net Worth Calculator:</strong> Real-time aggregation of all active assets (cash, investments, real estate) minus active liabilities (loans, mortgages).
                </li>
                <li>
                  <strong>Goal Milestones:</strong> Users can allocate funds to specific goals (e.g., "Emergency Fund", "Bali Trip") and track percentage completion with dynamic progress bars.
                </li>
                <li>
                  <strong>Financial Insights:</strong> Automatically generates monthly income vs. expense breakdowns to calculate free cash flow.
                </li>
              </ul>
            </section>

            {/* Section 5: Deployment */}
            <section id="deployment" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineShieldCheck /></div>
                <h2>5. Deployment & Security</h2>
              </div>
              <div className={styles.securityGrid}>
                <div className={styles.securityItem}>
                  <h4>☁️ Cloud Infrastructure</h4>
                  <p>Frontend deployed seamlessly on <strong>Vercel</strong> for global CDN edge delivery. Backend API hosted on <strong>Render.com</strong>.</p>
                </div>
                <div className={styles.securityItem}>
                  <h4>🔐 Authentication</h4>
                  <p>Stateless JSON Web Tokens (JWT) stored securely in client LocalStorage. All protected API routes require Bearer token validation.</p>
                </div>
                <div className={styles.securityItem}>
                  <h4>🛡️ Data Protection</h4>
                  <p>Bcrypt.js used for password hashing (Salt rounds: 10). Environment variables (.env) protect MongoDB connection strings and JWT secrets.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Designed and Built by Naveen | WealthHabit Financial Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ProjectReport;
