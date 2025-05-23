// src/admin/pages/AdminManage.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminUsersTable from "../components/AdminUserTable";
import AdminLogsTable from "../components/AdminLogTable";
//import InviteAdminForm from "../components/InviteAdminForm";

export default function AdminManage() {
  const { user } = useSelector((state) => state.adminAuth);

  if (!user || user.role !== "root") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-extrabold mb-4">Admin Management</h1>
      {/*<section>
        <h2 className="text-2xl font-bold mb-4">Invite New Admin</h2>
        <InviteAdminForm />
      </section>*/}

      <section>
        <h2 className="text-2xl font-bold mb-4">All Admin Users</h2>
        <AdminUsersTable />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Admin Logs</h2>
        <AdminLogsTable />
      </section>
    </div>
  );
}
