import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ProjectReport from './pages/ProjectReport';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Wealth from './pages/Wealth';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/report" element={<ProjectReport />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="habits" element={<Habits />} />
            <Route path="goals" element={<Goals />} />
            <Route path="wealth" element={<Wealth />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
