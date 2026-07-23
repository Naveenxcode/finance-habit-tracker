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
            An in-depth, technical exploration of the architecture, psychological design, technology stack, and engineering features powering the WealthHabit ecosystem.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Left Column: Navigation / Quick Links */}
          <aside className={styles.sidebar}>
            <div className={styles.toc}>
              <h3>Contents</h3>
              <ul>
                <li><a href="#overview">1. Project Overview & Vision</a></li>
                <li><a href="#architecture">2. System Architecture</a></li>
                <li><a href="#database">3. Database Engineering</a></li>
                <li><a href="#features">4. Core Technical Features</a></li>
                <li><a href="#deployment">5. Security & Deployment</a></li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Content */}
          <div className={styles.content}>
            
            {/* Section 1: Overview */}
            <section id="overview" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineLightBulb /></div>
                <h2>1. Project Overview & Vision</h2>
              </div>
              <p>
                <strong>WealthHabit</strong> is a full-stack financial habit builder and wealth tracking platform engineered to fundamentally shift how individuals interact with their personal finances. 
              </p>
              <div className={styles.highlightCard}>
                <h4>The Psychological Problem</h4>
                <p>Traditional budgeting applications are inherently <em>reactive</em>. They focus entirely on categorizing past expenses, which induces financial guilt rather than growth. They fail to address the core driver of wealth accumulation: <strong>consistent daily behavior.</strong></p>
                
                <h4 style={{ marginTop: '1.5rem' }}>The WealthHabit Solution</h4>
                <p>We engineered WealthHabit to be entirely <em>proactive</em>. By merging traditional net-worth tracking with behavioral gamification (streak tracking, visual progress bars, and achievement levels), the platform leverages the psychological "habit loop." Users are rewarded for micro-actions—like saving ₹100, reading financial news, or packing lunch—which keeps them motivated to achieve massive long-term macro-goals (like buying a house or retiring early).</p>
              </div>
            </section>

            {/* Section 2: Architecture */}
            <section id="architecture" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineCode /></div>
                <h2>2. System Architecture</h2>
              </div>
              <p>The application is built on the highly scalable <strong>MERN</strong> stack (MongoDB, Express, React, Node.js), utilizing a decoupled client-server architecture to ensure maximum performance and maintainability.</p>
              
              <div className={styles.techStack}>
                <div className={styles.techItem}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" />
                  <div>
                    <h5>Frontend (Client)</h5>
                    <p>
                      Built with <strong>React 18</strong> and bundled via <strong>Vite</strong> for ultra-fast Hot Module Replacement (HMR) and optimized production builds. 
                      Routing is handled by <strong>React Router v6</strong>. 
                      <br/><br/>
                      <strong>Dual-Write Engine:</strong> To provide a buttery-smooth UX, the frontend utilizes an Optimistic UI pattern. When a user completes a habit, the React Context API updates the DOM instantly, while a background asynchronous <code>fetch</code> syncs the data to the Node.js server. This guarantees zero-latency interactions for the end-user.
                    </p>
                  </div>
                </div>
                <div className={styles.techItem}>
                  <img src="https://nodejs.org/static/images/logo.svg" alt="Node" style={{ filter: 'brightness(0) invert(1)' }} />
                  <div>
                    <h5>Backend (Server)</h5>
                    <p>
                      Powered by <strong>Node.js</strong> and <strong>Express.js</strong>. The server follows a strict MVC (Model-View-Controller) design pattern to separate business logic from routing.
                      <br/><br/>
                      It features centralized global error-handling middleware, CORS protection, and an <code>asyncHandler</code> utility to elegantly catch unhandled promise rejections without crashing the Node runtime.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Database */}
            <section id="database" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineDatabase /></div>
                <h2>3. Database Engineering</h2>
              </div>
              <p>The data layer is powered by <strong>MongoDB Atlas</strong> (a NoSQL cloud database) and interfaces with the Node backend via <strong>Mongoose ODM</strong>. This provides strict schema validation and relationship mapping.</p>
              
              <div className={styles.schemaGrid}>
                <div className={styles.schemaCard}>
                  <h4>User Authentication</h4>
                  <p>Stores highly sensitive identity data. Linked to all other collections via <code>ObjectId</code> references.</p>
                  <code>_id, email, password (hashed), name, level, streakDays, totalScore</code>
                </div>
                <div className={styles.schemaCard}>
                  <h4>Habit Engine</h4>
                  <p>Tracks behavioral patterns. Contains temporal logic to determine if a streak is currently active.</p>
                  <code>_id, user, title, frequency, streak, lastCompleted, isCompletedToday</code>
                </div>
                <div className={styles.schemaCard}>
                  <h4>Savings Goals</h4>
                  <p>Manages target vs. actual financial milestones. Calculates real-time percentage completion.</p>
                  <code>_id, user, name, targetAmount, currentAmount, category, deadline</code>
                </div>
                <div className={styles.schemaCard}>
                  <h4>Net Worth Ledger</h4>
                  <p>Separated into Assets (what you own) and Liabilities (what you owe) for algorithmic net-worth calculation.</p>
                  <code>_id, user, name, value, category, type (asset/liability)</code>
                </div>
              </div>
            </section>

            {/* Section 4: Features */}
            <section id="features" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineServer /></div>
                <h2>4. Core Technical Features</h2>
              </div>
              <ul className={styles.featureList}>
                <li>
                  <strong>Algorithmic Streak Calculation:</strong> The backend uses temporal date-diffing logic to calculate daily streaks. If a user misses a habit interval, the streak automatically resets to zero. Successful completions increment the user's global "Wealth Level" score.
                </li>
                <li>
                  <strong>Real-Time Net Worth Aggregator:</strong> The dashboard instantly calculates Total Net Worth by mapping and reducing all active Asset documents minus all active Liability documents.
                </li>
                <li>
                  <strong>Atomic Goal Contributions:</strong> Users can make micro-contributions to massive savings goals. The backend uses atomic MongoDB operations (<code>$inc</code>) to safely update <code>currentAmount</code> without race conditions.
                </li>
                <li>
                  <strong>Financial Cash Flow Insights:</strong> The transaction tracker separates Income vs. Expenses, generating an algorithmic breakdown of monthly free cash flow and savings rates.
                </li>
              </ul>
            </section>

            {/* Section 5: Deployment */}
            <section id="deployment" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}><HiOutlineShieldCheck /></div>
                <h2>5. Security & Deployment</h2>
              </div>
              <p>Enterprise-grade security standards were implemented to protect user financial data across the entire network stack.</p>
              <div className={styles.securityGrid}>
                <div className={styles.securityItem}>
                  <h4>☁️ Cloud Infrastructure</h4>
                  <p>The React frontend is deployed on <strong>Vercel</strong> for ultra-fast Edge Network caching. The Node.js backend is hosted securely on <strong>Render.com</strong>, enabling auto-scaling and continuous deployment from GitHub.</p>
                </div>
                <div className={styles.securityItem}>
                  <h4>🔐 Stateless Auth (JWT)</h4>
                  <p>Authentication utilizes <strong>JSON Web Tokens (JWT)</strong>. Upon login, a signed token is generated and stored in client LocalStorage. Every protected API route intercepts the request, verifies the Bearer token signature, and attaches the decoded user payload to the request lifecycle.</p>
                </div>
                <div className={styles.securityItem}>
                  <h4>🛡️ Cryptographic Hashing</h4>
                  <p>User passwords are never stored in plaintext. They are cryptographically hashed using <strong>Bcrypt.js</strong> (10 salt rounds) before ever touching the MongoDB database, protecting against rainbow table and brute-force attacks.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Designed and Engineered by Naveen | WealthHabit Financial Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ProjectReport;
