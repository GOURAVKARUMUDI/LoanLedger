import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Home from './publicPages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './components/common/Dashboard';
import NotificationToast from './components/common/NotificationToast';
import SuccessModal from './components/common/SuccessModal';

// Role Panels
import AdminDashboard from './roles/admin/AdminDashboard';
import AdminUsers from './roles/admin/AdminUsers';
import AdminReports from './roles/admin/AdminReports';
import AdminAuditLogs from './roles/admin/AdminAuditLogs';
import AdminSettings from './roles/admin/AdminSettings';
import AdminNetworkMonitor from './roles/admin/AdminNetworkMonitor';
import AdminRiskProtocol from './roles/admin/AdminRiskProtocol';
import LenderDashboard from './roles/lender/LenderDashboard';
import AnalystDashboard from './roles/analyst/AnalystDashboard';
import AnalystMarket from './roles/analyst/AnalystMarket';
import RiskScoringEngine from './roles/analyst/RiskScoringEngine';
import BorrowerIntelligence from './roles/analyst/BorrowerIntelligence';
import AnalystBorrowers from './roles/analyst/AnalystBorrowers';
import LenderActiveLoans from './roles/lender/LenderActiveLoans';
import LenderLoanDetails from './roles/lender/LenderLoanDetails';
import CreateOffer from './roles/lender/CreateOffer';
import MyOffers from './roles/lender/MyOffers';
import LenderRequests from './roles/lender/LenderRequests';
import BorrowerDashboard from './roles/borrower/BorrowerDashboard';
import LenderPayments from './roles/lender/LenderPayments';
import AddFunds from './roles/lender/AddFunds';
import LenderProfile from './roles/lender/LenderProfile';
import BorrowerProfile from './roles/borrower/BorrowerProfile';
import AnalystProfile from './roles/analyst/AnalystProfile';

// Sub Pages
import LoanOffers from './roles/lender/LoanOffers';
import BorrowerApply from './roles/borrower/BorrowerApply';
import PaymentTracker from './roles/borrower/PaymentTracker';
import MyLoans from './roles/borrower/MyLoans';
import LoanDetails from './roles/borrower/LoanDetails';
import BorrowerEMIPage from './roles/borrower/BorrowerEMIPage';
import LenderEarningsPage from './roles/lender/LenderEarningsPage';
import About from './publicPages/About';
import PolicyPage from './publicPages/PolicyPage';
import TermsOfService from './publicPages/TermsOfService';
import Contact from './publicPages/Contact';

// CSS
import './index.css';



import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Guard for Public Pages (Redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useStore();

  if (currentUser) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'lender') return <Navigate to="/lender/dashboard" replace />;
    if (currentUser.role === 'analyst') return <Navigate to="/analyst/dashboard" replace />;
    if (currentUser.role === 'borrower') return <Navigate to="/borrower/dashboard" replace />;
  }
  return children;
};

function App() {
  const seedDummyData = useStore(state => state.seedDummyData);

  React.useEffect(() => {
    seedDummyData();
  }, [seedDummyData]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PolicyPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><Dashboard role="admin" /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="network" element={<AdminNetworkMonitor />} />
          <Route path="risk-protocol" element={<AdminRiskProtocol />} />
        </Route>

        {/* --- LENDER ROUTES --- */}
        <Route path="/lender" element={<ProtectedRoute role="lender"><Dashboard role="lender" /></ProtectedRoute>}>
          <Route path="dashboard" element={<LenderDashboard />} />
          <Route path="requests" element={<LenderRequests />} />
          <Route path="active-loans" element={<LenderActiveLoans />} />
          <Route path="create-offer" element={<CreateOffer />} />
          <Route path="offers" element={<MyOffers />} />
          <Route path="loans/:loanId" element={<LenderLoanDetails />} />
          <Route path="payments" element={<LenderPayments />} />
          <Route path="addfunds" element={<AddFunds />} />
          <Route path="earnings" element={<LenderEarningsPage />} />
          <Route path="profile" element={<LenderProfile />} />
        </Route>

        {/* --- BORROWER ROUTES --- */}
        <Route path="/borrower" element={<ProtectedRoute role="borrower"><Dashboard role="borrower" /></ProtectedRoute>}>
          <Route path="dashboard" element={<BorrowerDashboard />} />
          <Route path="offers" element={<LoanOffers />} />
          <Route path="my-loans" element={<MyLoans />} />
          <Route path="requests" element={<MyLoans />} />
          <Route path="profile" element={<BorrowerProfile />} />
          <Route path="loans/:loanId" element={<LoanDetails />} />
          <Route path="payments" element={<PaymentTracker />} />
          <Route path="apply" element={<BorrowerApply />} />
          <Route path="emi" element={<BorrowerEMIPage />} />
        </Route>

        {/* --- ANALYST ROUTES --- */}
        <Route path="/analyst" element={<ProtectedRoute role="analyst"><Dashboard role="analyst" /></ProtectedRoute>}>
          <Route path="dashboard" element={<AnalystDashboard />} />
          <Route path="risk-verification" element={<RiskScoringEngine />} />
          <Route path="borrower-intelligence" element={<BorrowerIntelligence />} />
          <Route path="market-trends" element={<AnalystMarket />} />
          <Route path="reports" element={<AnalystBorrowers />} />
          <Route path="profile" element={<AnalystProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      <NotificationToast />
      <SuccessModal />
    </BrowserRouter>
  );
}

export default App;
