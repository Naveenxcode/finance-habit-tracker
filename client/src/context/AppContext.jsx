import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_USER = {
  name: 'Rahul Sharma',
  email: 'rahul@wealthhabit.io',
  role: 'user',
  avatar: '👨‍💻',
  currency: '₹',
  monthlyIncome: 125000,
  streakDays: 14,
  level: 'Wealth Builder Level 3'
};

const INITIAL_HABITS = [
  {
    id: 'h1',
    name: 'Auto-Save Daily Minimum',
    category: 'savings',
    icon: '💰',
    targetValue: 200,
    frequency: 'daily',
    streak: 14,
    completedToday: false,
    totalSaved: 4200,
    linkedGoalId: 'g1',
    description: 'Save at least ₹200 every single morning'
  },
  {
    id: 'h2',
    name: 'No Food Delivery Day',
    category: 'mindset',
    icon: '🥗',
    targetValue: 350,
    frequency: 'daily',
    streak: 8,
    completedToday: true,
    totalSaved: 2800,
    linkedGoalId: 'g2',
    description: 'Cook at home or carry lunch instead of ordering outside'
  },
  {
    id: 'h3',
    name: 'Log All Daily Expenses',
    category: 'tracking',
    icon: '📝',
    targetValue: 1,
    frequency: 'daily',
    streak: 21,
    completedToday: false,
    totalSaved: 0,
    description: 'Track every transaction before sleeping'
  },
  {
    id: 'h4',
    name: 'Weekly Index Fund SIP Buffer',
    category: 'investment',
    icon: '📈',
    targetValue: 2500,
    frequency: 'weekly',
    streak: 6,
    completedToday: true,
    totalSaved: 15000,
    linkedGoalId: 'g3',
    description: 'Move weekly savings surplus into Nifty 50 Index Fund'
  }
];

const INITIAL_GOALS = [
  {
    id: 'g1',
    name: 'Emergency Fund (6 Months)',
    category: 'emergency',
    icon: '🛡️',
    targetAmount: 300000,
    currentAmount: 215000,
    deadline: '2026-12-31',
    color: '#10B981'
  },
  {
    id: 'g2',
    name: 'Goa Annual Trip',
    category: 'travel',
    icon: '🏖️',
    targetAmount: 45000,
    currentAmount: 34200,
    deadline: '2026-10-15',
    color: '#3B82F6'
  },
  {
    id: 'g3',
    name: 'Stock Portfolio Growth Target',
    category: 'retirement',
    icon: '🚀',
    targetAmount: 1000000,
    currentAmount: 640000,
    deadline: '2028-06-30',
    color: '#F59E0B'
  }
];

const INITIAL_ASSETS = [
  { id: 'a1', name: 'HDFC Salary Account', category: 'bank_cash', value: 84500, growth: 2.1 },
  { id: 'a2', name: 'Nifty 50 Index Mutual Fund', category: 'mutual_funds', value: 420000, growth: 14.8 },
  { id: 'a3', name: 'Direct Equity Portfolio', category: 'stocks', value: 210000, growth: 18.4 },
  { id: 'a4', name: 'PPF / EPF Reserves', category: 'fixed_deposit', value: 310000, growth: 7.1 },
  { id: 'a5', name: 'Digital Gold Sovereign', category: 'gold', value: 65000, growth: 9.3 }
];

const INITIAL_LIABILITIES = [
  { id: 'l1', name: 'MacBook M3 Credit Card EMI', type: 'credit_card', originalAmount: 110000, remainingAmount: 36000, emi: 9000 },
  { id: 'l2', name: 'Education Loan Balance', type: 'education_loan', originalAmount: 400000, remainingAmount: 125000, emi: 12500 }
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', title: 'Monthly Salary Credit', type: 'income', category: 'salary', amount: 125000, date: '2026-07-01' },
  { id: 't2', title: 'Freelance Consulting', type: 'income', category: 'freelance', amount: 28000, date: '2026-07-05' },
  { id: 't3', title: 'Apartment Rent & Maintenance', type: 'expense', category: 'rent', amount: 24000, date: '2026-07-02' },
  { id: 't4', title: 'Grocery Supermarket', type: 'expense', category: 'groceries', amount: 6400, date: '2026-07-06' },
  { id: 't5', title: 'Mutual Fund SIP Auto-Debit', type: 'expense', category: 'investment', amount: 25000, date: '2026-07-07' },
  { id: 't6', title: 'Weekend Dining & Movies', type: 'expense', category: 'entertainment', amount: 3200, date: '2026-07-10' }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const isLoggedOut = localStorage.getItem('wh_logged_out');
    if (isLoggedOut === 'true') {
      const saved = localStorage.getItem('wh_user');
      return saved && saved !== 'null' ? JSON.parse(saved) : null;
    }
    const saved = localStorage.getItem('wh_user');
    return saved && saved !== 'null' ? JSON.parse(saved) : null;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('wh_habits');
    return saved && saved !== 'null' ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('wh_goals');
    return saved && saved !== 'null' ? JSON.parse(saved) : [];
  });

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('wh_assets');
    return saved && saved !== 'null' ? JSON.parse(saved) : [];
  });

  const [liabilities, setLiabilities] = useState(() => {
    const saved = localStorage.getItem('wh_liabilities');
    return saved && saved !== 'null' ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('wh_transactions');
    return saved && saved !== 'null' ? JSON.parse(saved) : [];
  });

  const [piggyBankBalance, setPiggyBankBalance] = useState(() => {
    const saved = localStorage.getItem('wh_piggy');
    return saved && saved !== 'null' ? Number(saved) : 0;
  });

  const getAuthHeaders = () => {
    const t = localStorage.getItem('token') || localStorage.getItem('wh_token');
    return t ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` } : null;
  };

  // Helper to load specific account data into React state (Hybrid: Instant Local + Background Cloud Sync)
  const loadAccountData = async (email) => {
    if (!email) return;
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === INITIAL_USER.email.toLowerCase() || lowerEmail === 'demo@wealthhabit.io') {
      setHabits(INITIAL_HABITS);
      setGoals(INITIAL_GOALS);
      setAssets(INITIAL_ASSETS);
      setLiabilities(INITIAL_LIABILITIES);
      setTransactions(INITIAL_TRANSACTIONS);
      setPiggyBankBalance(14650);
      return;
    }

    // 1. Instant load from local storage for 0ms initial render
    const scopedData = localStorage.getItem(`wh_data_${lowerEmail}`);
    if (scopedData && scopedData !== 'null') {
      try {
        const parsed = JSON.parse(scopedData);
        setHabits(parsed.habits || []);
        setGoals(parsed.goals || []);
        setAssets(parsed.assets || []);
        setLiabilities(parsed.liabilities || []);
        setTransactions(parsed.transactions || []);
        setPiggyBankBalance(typeof parsed.piggyBankBalance === 'number' ? parsed.piggyBankBalance : 0);
      } catch (e) {
        console.error('Error parsing scoped user data');
      }
    } else {
      setHabits([]);
      setGoals([]);
      setAssets([]);
      setLiabilities([]);
      setTransactions([]);
      setPiggyBankBalance(0);
    }

    // 2. Background Cloud Sync: Fetch live items from MongoDB Atlas across devices
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const [hRes, gRes, aRes, lRes, eRes, iRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/habits`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/v1/goals`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/v1/wealth/assets`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/v1/wealth/liabilities`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/v1/expenses`, { headers }).catch(() => null),
        fetch(`${API_BASE}/api/v1/income`, { headers }).catch(() => null)
      ]);

      if (hRes && hRes.ok) {
        const hData = await hRes.json();
        if (hData && Array.isArray(hData.data)) {
          setHabits(hData.data.map(item => ({ ...item, id: item._id || item.id })));
        }
      }
      if (gRes && gRes.ok) {
        const gData = await gRes.json();
        if (gData && Array.isArray(gData.data)) {
          setGoals(gData.data.map(item => ({
            ...item,
            id: item._id || item.id,
            currentAmount: Number(item.currentAmount || 0),
            targetAmount: Number(item.targetAmount || 0),
            category: item.category || 'general',
            icon: item.icon || '🎯'
          })));
        }
      }
      if (aRes && aRes.ok) {
        const aData = await aRes.json();
        if (aData && Array.isArray(aData.data)) {
          setAssets(aData.data.map(item => ({
            ...item,
            id: item._id || item.id,
            value: Number(item.currentValue !== undefined ? item.currentValue : item.value || 0)
          })));
        }
      }
      if (lRes && lRes.ok) {
        const lData = await lRes.json();
        if (lData && Array.isArray(lData.data)) {
          setLiabilities(lData.data.map(item => ({
            ...item,
            id: item._id || item.id,
            remainingAmount: Number(item.remainingAmount !== undefined ? item.remainingAmount : item.totalAmount || 0)
          })));
        }
      }

      let combinedTx = [];
      if (eRes && eRes.ok) {
        const eData = await eRes.json();
        if (eData && Array.isArray(eData.data)) {
          combinedTx = [...combinedTx, ...eData.data.map(item => ({ ...item, id: item._id || item.id, type: 'expense', title: item.description || item.title || item.name || 'Expense' }))];
        }
      }
      if (iRes && iRes.ok) {
        const iData = await iRes.json();
        if (iData && Array.isArray(iData.data)) {
          combinedTx = [...combinedTx, ...iData.data.map(item => ({ ...item, id: item._id || item.id, type: 'income', title: item.sourceName || item.title || item.name || 'Income' }))];
        }
      }
      if ((eRes && eRes.ok) || (iRes && iRes.ok)) {
        combinedTx.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(combinedTx);
      }
    } catch (e) {
      console.log('Offline/cloud sync fallback active');
    }
  };

  // Automatic Cloud Synchronization on Startup across devices & browsers
  useEffect(() => {
    if (user && user.email && user.email !== 'demo@wealthhabit.io') {
      loadAccountData(user.email);
    }
  }, [user?.email]);

  // Sync to local storage when state changes
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem('wh_user', JSON.stringify(user));
      const lowerEmail = user.email.toLowerCase();
      // If personal account, save strictly to their personal scoped bucket
      if (lowerEmail !== INITIAL_USER.email.toLowerCase() && lowerEmail !== 'demo@wealthhabit.io') {
        const accountData = { habits, goals, assets, liabilities, transactions, piggyBankBalance };
        localStorage.setItem(`wh_data_${lowerEmail}`, JSON.stringify(accountData));
      }
    }
    localStorage.setItem('wh_habits', JSON.stringify(habits));
    localStorage.setItem('wh_goals', JSON.stringify(goals));
    localStorage.setItem('wh_assets', JSON.stringify(assets));
    localStorage.setItem('wh_liabilities', JSON.stringify(liabilities));
    localStorage.setItem('wh_transactions', JSON.stringify(transactions));
    localStorage.setItem('wh_piggy', piggyBankBalance);
  }, [user, habits, goals, assets, liabilities, transactions, piggyBankBalance]);

  // Auth Actions
  // Auth Actions
  const registerUser = async (name, email, password) => {
    const cleanEmail = (email || '').trim();
    const lowerEmail = cleanEmail.toLowerCase();

    // 0. Instant duplicate check against demo email or local registered accounts
    if (lowerEmail === INITIAL_USER.email.toLowerCase() || lowerEmail === 'demo@wealthhabit.io') {
      throw new Error('This email address is already registered as the Demo Account! Please switch to the Sign In tab.');
    }

    const regUsers = JSON.parse(localStorage.getItem('wh_registered_users') || '[]');
    const existingIdx = regUsers.findIndex(u => (u.email || '').trim().toLowerCase() === lowerEmail);
    if (existingIdx >= 0) {
      throw new Error('An account with this email address already exists! Please switch to the Sign In tab.');
    }

    // Check if they already have personal data saved from previous sessions
    const hasExistingData = localStorage.getItem(`wh_data_${lowerEmail}`);
    if (hasExistingData && hasExistingData !== 'null') {
      throw new Error('An account with this email address already exists! Please switch to the Sign In tab.');
    }

    // Check if wh_user currently matches this email
    try {
      const currentStored = JSON.parse(localStorage.getItem('wh_user') || '{}');
      if (currentStored.email && currentStored.email.trim().toLowerCase() === lowerEmail) {
        throw new Error('An account with this email address already exists! Please switch to the Sign In tab.');
      }
    } catch (e) {}

    // 1. Try hitting real API endpoint
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: (name || '').trim(), email: cleanEmail, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('wh_token', data.token);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 400 || res.status === 409 || errData.message?.toLowerCase().includes('already')) {
          throw new Error(errData.message || 'An account with this email address already exists! Please switch to the Sign In tab.');
        }
      }
    } catch (e) {
      if (e.message && e.message.includes('already')) {
        throw e;
      }
      console.log('API offline/unreachable, verifying offline registry check');
    }

    localStorage.removeItem('wh_logged_out');

    // Serve completely fresh data for newly registered users
    const freshUser = {
      name: (name || 'Starter Builder').trim(),
      email: cleanEmail,
      role: 'user',
      avatar: '🟢',
      currency: '₹',
      monthlyIncome: 0,
      streakDays: 0,
      level: 'Starter Level 1'
    };

    const regRecord = { ...freshUser, password };
    regUsers.push(regRecord);
    localStorage.setItem('wh_registered_users', JSON.stringify(regUsers));

    setUser(freshUser);
    await loadAccountData(email);
    localStorage.setItem('wh_user', JSON.stringify(freshUser));
  };

  const loginUser = async (email, password) => {
    localStorage.removeItem('wh_logged_out');

    // 1. Try hitting real API endpoint
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('wh_token', data.token);
        }
        if (data.user) {
          setUser(data.user);
          await loadAccountData(data.user.email);
          localStorage.setItem('wh_user', JSON.stringify(data.user));
          return true;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 400 || res.status === 404) {
          const regUsers = JSON.parse(localStorage.getItem('wh_registered_users') || '[]');
          const match = regUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
          if (match) {
            setUser(match);
            await loadAccountData(match.email);
            localStorage.setItem('wh_user', JSON.stringify(match));
            return true;
          }
          throw new Error(errData.message || 'Incorrect email or password!');
        }
      }
    } catch (e) {
      if (e.message && (e.message.includes('Incorrect') || e.message.includes('Invalid') || e.message.includes('credentials'))) {
        throw e;
      }
      console.log('API unreachable, checking local credentials fallback');
    }

    // 2. Local registry check
    const regUsers = JSON.parse(localStorage.getItem('wh_registered_users') || '[]');
    const match = regUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (match) {
      setUser(match);
      await loadAccountData(match.email);
      localStorage.setItem('wh_user', JSON.stringify(match));
      return true;
    }

    // 3. Demo account check
    if (email.toLowerCase() === INITIAL_USER.email.toLowerCase() || email.toLowerCase() === 'demo@wealthhabit.io') {
      if (password === 'demo123' || password === 'password' || password === '123456') {
        setUser(INITIAL_USER);
        await loadAccountData(INITIAL_USER.email);
        localStorage.setItem('wh_user', JSON.stringify(INITIAL_USER));
        return true;
      } else {
        throw new Error('Incorrect password for demo account! Try: demo123');
      }
    }

    // 4. If current wh_user matches email
    const existing = localStorage.getItem('wh_user');
    if (existing && existing !== 'null') {
      const parsed = JSON.parse(existing);
      if (parsed.email && parsed.email.toLowerCase() === email.toLowerCase()) {
        const storedUsers = JSON.parse(localStorage.getItem('wh_registered_users') || '[]');
        const rec = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (rec && rec.password !== password) {
          throw new Error('Incorrect email or password!');
        }
        setUser(parsed);
        loadAccountData(parsed.email);
        return true;
      }
    }

    throw new Error('Incorrect email or password! Please check your credentials or register a new account.');
  };

  const loginWithGoogle = async (credential) => {
    localStorage.removeItem('wh_logged_out');
    const res = await fetch(`${API_BASE}/api/v1/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('wh_token', data.token);
      }
      if (data.user) {
        setUser(data.user);
        await loadAccountData(data.user.email);
        localStorage.setItem('wh_user', JSON.stringify(data.user));
        return true;
      }
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Google login failed');
  };

  const demoLogin = () => {
    localStorage.removeItem('wh_logged_out');
    setUser(INITIAL_USER);
    loadAccountData(INITIAL_USER.email);
  };

  const logout = () => {
    setUser(null);
    setHabits([]);
    setGoals([]);
    setAssets([]);
    setLiabilities([]);
    setTransactions([]);
    setPiggyBankBalance(0);
    localStorage.removeItem('wh_user');
    localStorage.removeItem('wh_habits');
    localStorage.removeItem('wh_goals');
    localStorage.removeItem('wh_assets');
    localStorage.removeItem('wh_liabilities');
    localStorage.removeItem('wh_transactions');
    localStorage.removeItem('wh_piggy');
    localStorage.removeItem('wh_token');
    localStorage.removeItem('token');
    localStorage.setItem('wh_logged_out', 'true');
  };

  const updateProfile = (updatedDetails) => {
    setUser(prev => ({ ...prev, ...updatedDetails }));
  };

  // Actions with Optimistic UI + Background Cloud API Sync
  const completeHabit = (id, amount = null) => {
    const habit = habits.find(h => h.id === id);
    if (!habit || habit.completedToday) return;

    const savedAmount = amount !== null ? Number(amount) : Number(habit.targetValue || 0);

    // 1. Optimistic Piggy Bank Update
    if (savedAmount > 0) {
      setPiggyBankBalance(p => p + savedAmount);
    }

    // 2. Optimistic Linked Goal Update
    if (habit.linkedGoalId && savedAmount > 0) {
      setGoals(gs => gs.map(g => g.id === habit.linkedGoalId ? {
        ...g,
        currentAmount: Math.min(g.targetAmount, (g.currentAmount || 0) + savedAmount)
      } : g));
    }

    // 3. Optimistic Habit Update
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completedToday: true,
          streak: (h.streak || 0) + 1,
          totalSaved: (h.totalSaved || 0) + savedAmount
        };
      }
      return h;
    }));

    // 4. Background Cloud API Sync to MongoDB Atlas
    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io') {
      fetch(`${API_BASE}/api/v1/habits/${id}/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ value: savedAmount, date: new Date().toISOString() })
      }).catch(e => console.log('Habit completion saved locally in fallback mode'));
    }
  };

  const addHabit = (newHabit) => {
    const tempId = `h_${Date.now()}`;
    const habitObj = {
      id: tempId,
      streak: 0,
      completedToday: false,
      totalSaved: 0,
      ...newHabit
    };
    setHabits(prev => [habitObj, ...prev]);

    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io') {
      fetch(`${API_BASE}/api/v1/habits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newHabit.name || newHabit.title,
          category: newHabit.category || 'savings',
          frequency: newHabit.frequency || 'daily',
          targetValue: Number(newHabit.targetValue || 0)
        })
      })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.data) {
          setHabits(prev => prev.map(h => h.id === tempId ? { ...h, id: res.data._id || res.data.id } : h));
        }
      })
      .catch(e => console.log('Habit saved locally'));
    }
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io' && !id.toString().startsWith('h_')) {
      fetch(`${API_BASE}/api/v1/habits/${id}`, { method: 'DELETE', headers }).catch(() => {});
    }
  };

  const addGoal = (newGoal) => {
    const tempId = `g_${Date.now()}`;
    const goalObj = {
      id: tempId,
      currentAmount: Number(newGoal.currentAmount || 0),
      ...newGoal
    };
    setGoals(prev => [goalObj, ...prev]);

    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io') {
      fetch(`${API_BASE}/api/v1/goals`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newGoal.name || newGoal.title,
          targetAmount: Number(newGoal.targetAmount || 0),
          currentAmount: Number(newGoal.currentAmount || 0),
          category: newGoal.category || 'general',
          icon: newGoal.icon || '🎯',
          deadline: newGoal.deadline || null
        })
      })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.data) {
          setGoals(prev => prev.map(g => g.id === tempId ? {
            ...g,
            id: res.data._id || res.data.id,
            currentAmount: Number(res.data.currentAmount !== undefined ? res.data.currentAmount : newGoal.currentAmount || 0),
            targetAmount: Number(res.data.targetAmount !== undefined ? res.data.targetAmount : newGoal.targetAmount || 0),
            category: res.data.category || newGoal.category || 'general',
            icon: res.data.icon || newGoal.icon || '🎯'
          } : g));
        }
      })
      .catch(e => console.log('Goal saved locally'));
    }
  };

  const contributeGoal = (goalId, amount) => {
    setGoals(prev => prev.map(g => g.id === goalId ? {
      ...g,
      currentAmount: Math.min(g.targetAmount, g.currentAmount + Number(amount))
    } : g));

    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io' && !goalId.toString().startsWith('g_')) {
      fetch(`${API_BASE}/api/v1/goals/${goalId}/contribute`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount: Number(amount) })
      }).catch(() => {});
    }
  };

  const addAsset = (newAsset) => {
    const tempId = `a_${Date.now()}`;
    const assetObj = { id: tempId, ...newAsset };
    setAssets(prev => [assetObj, ...prev]);

    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io') {
      fetch(`${API_BASE}/api/v1/wealth/assets`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newAsset.name,
          category: newAsset.category || 'other',
          value: Number(newAsset.value || 0)
        })
      })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.data) {
          setAssets(prev => prev.map(a => a.id === tempId ? { ...a, id: res.data._id || res.data.id } : a));
        }
      })
      .catch(() => {});
    }
  };

  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io' && !id.toString().startsWith('a_')) {
      fetch(`${API_BASE}/api/v1/wealth/assets/${id}`, { method: 'DELETE', headers }).catch(() => {});
    }
  };

  const addLiability = (newLiab) => {
    const tempId = `l_${Date.now()}`;
    const liabObj = { id: tempId, ...newLiab };
    setLiabilities(prev => [liabObj, ...prev]);

    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io') {
      fetch(`${API_BASE}/api/v1/wealth/liabilities`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newLiab.name,
          category: newLiab.category || 'loan',
          totalAmount: Number(newLiab.remainingAmount || 0),
          remainingAmount: Number(newLiab.remainingAmount || 0)
        })
      })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.data) {
          setLiabilities(prev => prev.map(l => l.id === tempId ? { ...l, id: res.data._id || res.data.id } : l));
        }
      })
      .catch(() => {});
    }
  };

  const deleteLiability = (id) => {
    setLiabilities(prev => prev.filter(l => l.id !== id));
    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io' && !id.toString().startsWith('l_')) {
      fetch(`${API_BASE}/api/v1/wealth/liabilities/${id}`, { method: 'DELETE', headers }).catch(() => {});
    }
  };

  const addTransaction = (newTx) => {
    const tempId = `t_${Date.now()}`;
    const txObj = { id: tempId, date: new Date().toISOString().split('T')[0], ...newTx };
    setTransactions(prev => [txObj, ...prev]);

    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io') {
      const endpoint = newTx.type === 'income' ? '/api/v1/income' : '/api/v1/expenses';
      fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: newTx.title || newTx.name,
          amount: Number(newTx.amount || 0),
          category: newTx.category || 'general',
          date: newTx.date || new Date().toISOString()
        })
      })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.data) {
          setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: res.data._id || res.data.id } : t));
        }
      })
      .catch(() => {});
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    const headers = getAuthHeaders();
    if (headers && user && user.email !== 'demo@wealthhabit.io' && !id.toString().startsWith('t_')) {
      fetch(`${API_BASE}/api/v1/expenses/${id}`, { method: 'DELETE', headers }).catch(() => {});
    }
  };

  const updateTransaction = (id, updatedTx) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTx, amount: Number(updatedTx.amount || t.amount) } : t));
  };

  // Calculations
  const totalAssets = assets.reduce((s, a) => s + Number(a.value), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + Number(l.remainingAmount), 0);
  const netWorth = totalAssets - totalLiabilities;

  const totalIncomeMonth = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenseMonth = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const monthlySavings = totalIncomeMonth - totalExpenseMonth;

  return (
    <AppContext.Provider value={{
      user, setUser,
      registerUser, loginUser, loginWithGoogle, demoLogin, logout, updateProfile,
      habits, completeHabit, addHabit, deleteHabit,
      goals, addGoal, contributeGoal,
      assets, addAsset, deleteAsset,
      liabilities, addLiability, deleteLiability,
      transactions, addTransaction, deleteTransaction, updateTransaction,
      piggyBankBalance, setPiggyBankBalance,
      totalAssets, totalLiabilities, netWorth,
      totalIncomeMonth, totalExpenseMonth, monthlySavings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
