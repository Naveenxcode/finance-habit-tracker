# 💎 WealthHabit — Financial Habit Builder & Wealth Growth Tracker

![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**WealthHabit** is a state-of-the-art, gamified financial tracking and wealth building platform. It combines an addictive **daily habit & streak engine**, **real-time net worth & wealth growth tracking**, **smart savings goal milestones**, and **expense/income analytics**—all wrapped in a rich, glassmorphism-powered modern UI.

---

## ✨ Key Features

### 🔥 Gamified Habit Tracking & Streaks
* **Daily Financial Discipline**: Build lasting financial rituals (e.g., *Save ₹50 daily*, *No-spend days*, *Review portfolio*).
* **Streak Multipliers & Levels**: Earn streak freezes, XP points, and level up from *Starter Level 1* to *Wealth Master*.
* **Optimistic UI + Cloud Sync**: Instantaneous frontend state transitions backed by reliable background synchronization with MongoDB Atlas across all devices.

### 💰 Smart Savings & Milestone Goals
* **Custom Categories & Emojis**: Create personalized goals (*🏖️ Travel & Vacation*, *🛡️ Emergency Fund*, *🚗 Vehicle Purchase*, *🏠 Home & Real Estate*, *🚀 Wealth Investment*).
* **Automated & Manual Contributions**: Track exact progress with dynamic percentage bars and initial savings amounts verified directly in cloud collections.

### 📈 Comprehensive Wealth & Net Worth Dashboard
* **Asset & Liability Management**: Log physical assets (Gold, Real Estate, Vehicles) and financial instruments (Mutual Funds, Stocks, Bank accounts) against existing liabilities (Home Loans, Education Loans, Credit Cards).
* **Real-Time Net Worth Calculation**: Automatically computes total assets minus liabilities with monthly historical growth curves.

### 📊 Income & Expense Insights
* **Granular Transaction Logs**: Track cash flows with categorized breakdown charts, payment methods (UPI, Card, NetBanking), and recurring income schedules.

---

## 🏗️ Architecture & Tech Stack

```
lively-curie/
├── client/                 # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/     # Modals, Navbar, Landing Pages, Charts
│   │   ├── context/        # AppContext (Dual-Write Engine: State + MongoDB Atlas)
│   │   ├── pages/          # Dashboard, Habits, WealthGrowth, Goals, Analytics
│   │   └── styles/         # Vanilla CSS Glassmorphism Design System (variables.css)
│   └── package.json
└── server/                 # Express 5 + Mongoose v9 Backend
    ├── src/
    │   ├── controllers/    # Auth, Habits, Goals, Wealth, Income, Expenses
    │   ├── models/         # Mongoose v9 Async Pre-save Schemas
    │   ├── routes/         # REST API v1 endpoints
    │   └── utils/          # JWT Auth, Error Handlers, Seeders
    └── package.json
```

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend Core** | React 18 + Vite | Fast HMR, component-driven modular architecture |
| **Styling** | Vanilla CSS + Design Tokens | Glassmorphism, CSS Variables, Dark Mode, Micro-animations |
| **State Engine** | React Context (`AppContext`) | Optimistic UI updates paired with REST API cloud persistence |
| **Backend API** | Node.js + Express 5 | High-performance REST API, Rate Limiting, Helmet security |
| **Database** | MongoDB Atlas + Mongoose v9 | Cloud-first document storage, async validation & pre-save hooks |
| **Authentication** | JWT (JSON Web Tokens) | Secure stateless authentication with Bearer token headers |

---

## 🚀 Local Development Setup

### Prerequisities
* **Node.js** (v18 or v20+)
* **npm** (v9+)
* **MongoDB Atlas Account** (Free M0 Cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/wealthhabit.git
cd wealthhabit/lively-curie
```

### 2. Configure Backend Server (`server/`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/finance_habit_builder_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

Install dependencies and start the backend server:
```bash
cd server
npm install
npm run dev
```
The backend API will start on `http://localhost:5000`.

### 3. Configure Frontend Client (`client/`)
In a new terminal window, navigate to the client folder and create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Install dependencies and start the Vite dev server:
```bash
cd client
npm install
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 🌐 Cloud Production Deployment Guide

### Option A: Deploying Backend to Render.com (Recommended Free Tier)
1. Push your repository to GitHub.
2. Log in to [Render.com](https://render.com) and click **New + ➔ Web Service**.
3. Select your GitHub repository and configure:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Under the **Environment Variables** section, add:
   * `NODE_ENV`: `production`
   * `MONGO_URI`: `your_mongodb_atlas_connection_string`
   * `JWT_SECRET`: `your_secure_random_string`
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://wealthhabit-api.onrender.com`).

### Option B: Deploying Frontend to Vercel.com (Recommended Free Tier)
1. Log in to [Vercel.com](https://vercel.com) and click **Add New ➔ Project**.
2. Import your GitHub repository.
3. Configure the Project Settings:
   * **Root Directory**: `client`
   * **Framework Preset**: `Vite`
4. Add the Environment Variable under **Settings ➔ Environment Variables**:
   * `VITE_API_BASE_URL`: `https://wealthhabit-api.onrender.com` (Your Render live backend URL)
5. Click **Deploy**. Your frontend will build (`npm run build`) and go live instantly!

---

## 🛡️ License
This project is built and maintained by the **WealthHabit Engineering Team**. All rights reserved.
