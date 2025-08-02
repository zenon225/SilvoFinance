import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ChatbotProvider from './components/ChatbotProvider';
import HomePage from './pages/HomePage';
import InvestmentPacksPage from './pages/InvestmentPacksPage';
import PackDetailPage from './components/PackDetailPage';
import Dashboard from './components/Dashboard';
import ContactPage from './pages/ContactPage';
import DepositWithdrawal from './components/DepositWithdrawal';
import ReferralSystem from './components/ReferralSystem';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ChatbotProvider>
        <div className="min-h-screen">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/packs" element={<InvestmentPacksPage />} /> {/* Déplacé hors de ProtectedRoute */}
            <Route path="/pack/:packId" element={<PackDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Routes protégées */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deposit-withdrawal" element={<DepositWithdrawal />} />
              <Route path="/referral" element={<ReferralSystem />} />
            </Route>
          </Routes>
        </div>
      </ChatbotProvider>
    </Router>
  );
}

export default App;