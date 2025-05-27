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
import { motion } from 'framer-motion';
import AnalyticsCards from '../components/AnalyticsCards';
import DonationTable from '../components/DonationTable';

export default function AdminDashboard() {
  return (
    <div className="px-4 py-6 md:px-10 md:py-8 space-y-6">
      <motion.h1
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center"
      >
        Dashboard Overview
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <AnalyticsCards />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10  }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <DonationTable />
      </motion.div>
    </div>
  );
}