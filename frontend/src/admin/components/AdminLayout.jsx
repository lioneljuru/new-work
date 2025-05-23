import {
  LayoutDashboard,
  BarChart,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.adminAuth);

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { label: "Reports", icon: <BarChart size={20} />, path: "/admin/reports" },
    { label: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
    ...(user?.role === "root" ? [
      { label: "Admin Manage", icon: <Users size={20} />, path: "/admin/manage" }
    ] : [])
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col space-y-2 bg-white border-r transition-all duration-200 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-bold">Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(prev => !prev)}
            className="ml-auto"
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map(({ label, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-gray-600",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {icon}
                {!collapsed && <span>{label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
