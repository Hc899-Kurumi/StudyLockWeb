import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout, ProtectedRoute } from "./components/Layouts";
import DashboardLayout from "./components/DashboardLayout";

// Public pages
import Landing from "./pages/public/Landing";
import Pricing from "./pages/public/Pricing";
import Download from "./pages/public/Download";
import Extension from "./pages/public/Extension";
import Help from "./pages/public/Help";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Tasks from "./pages/dashboard/Tasks";
import Schedules from "./pages/dashboard/Schedules";
import Blocklists from "./pages/dashboard/Blocklists";
import Devices from "./pages/dashboard/Devices";
import Browsers from "./pages/dashboard/Browsers";
import Settings from "./pages/dashboard/Settings";
import Billing from "./pages/dashboard/Billing";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/download" element={<Download />} />
        <Route path="/extension" element={<Extension />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Auth (no public chrome) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="blocklists" element={<Blocklists />} />
          <Route path="devices" element={<Devices />} />
          <Route path="browsers" element={<Browsers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
