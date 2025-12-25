import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/signup";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgot-password";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/Dashboard";
import FounderProfile from "./pages/founder profile";
import FounderSettings from "./pages/settings";
import FounderTickets from "./pages/ticketing";
import FounderAIWalkthrough from "./pages/FounderAIWalkthrough";
import FounderOnboarding from "./pages/onboarding";
import FundingPathwayPage from "./pages/Funding";
import Compliance from "./pages/compliance";
import DocumentsVault from "./pages/document vault";
import ComplianceForm from "./pages/compliance form";
import Strategy from "./pages/strategy";
import StrategySessions from "./pages/strategy session";

function App() {
  return (
    <div className="font-mont">
      <Routes>
        {/* ================= AUTH ROUTES ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<FounderOnboarding />} />
        <Route path="/ai-walkthrough" element={<FounderAIWalkthrough />} />

        {/* ================= DASHBOARD ROUTES ================= */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* Phase 1 */}
          <Route path="compliance" element={<Compliance />} />
          <Route path="documents" element={<DocumentsVault />} />

          <Route
            path="compliance/:docType"
            element={<ComplianceForm />}
          />

          {/* Phase 2 */}
          <Route
            path="strategy"
            element={<Strategy/>}
          />
          <Route
            path="sessions"
            element={<StrategySessions/>}
          />

          {/* Phase 3 */}
          <Route path="funding" element={<FundingPathwayPage />} />

          {/* Shared */}
          <Route path="messages" element={<FounderTickets />} />
          <Route path="profile" element={<FounderProfile />} />
          <Route path="settings" element={<FounderSettings />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
