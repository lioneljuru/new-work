// pages/Admin.jsx
/*import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/admin/components/AdminLayout";
import AnalyticsCards from "@/admin/components/AnalyticsCards";
import DonationTable from "@/admin/components/DonationTable";
import AdminLogsTable from "@/admin/components/AdminLogsTable";
import AdminUsersTable from "@/admin/components/AdminUsersTable";
import SettingsPanel from "@/admin/components/SettingsPanel";

export default function Admin() {
  return (
    <Routes>
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={
          <>
            <AnalyticsCards />
            <DonationTable />
          </>
        } />
        <Route path="reports" element={
          <>
            <AdminLogsTable />
            <DonationTable />
          </>
        } />
        <Route path="settings" element={
          <ProtectedRoute requiredRole="root">
            <SettingsPanel />
            <AdminUsersTable />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}
*/
import AdminLayout from '../components/AdminLayout';
import AnalyticsCards from '../components/AnalyticsCards';
import DonationTable from '../components/DonationTable';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className='text-5xl p-30 font-extrabold text-gray-800'>Dashboard Overview</h1>
      <AnalyticsCards />
      <DonationTable />
    </div>
  );
}