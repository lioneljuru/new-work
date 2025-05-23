import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Donate from "./pages/Donate";
import AdminLogin from "./admin/pages/AdminLogin";
import { SecureFetch } from "./components/SecureFetch";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminReports from "./admin/pages/AdminReports";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminAcceptInvite from "./admin/pages/AdminAccept";
import AdminLayout from "./admin/components/AdminLayout";
import AdminManage from "./admin/pages/AdminManage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public donation page */}
        <Route path="/" element={<Donate />} />
        <Route path="/admin/accept-invite" element={<AdminAcceptInvite />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route path="/admin" element={<SecureFetch><AdminLayout /></SecureFetch>}>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage" element={
            <ProtectedRoute requiredRole="root">
              <AdminManage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch-all for invalid routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;