import {
  LayoutDashboard,
  BarChart,
  Settings,
  Users,
  Menu,
  X,
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
          "z-30 fixed md:relative top-0 left-0 bg-white border-r shadow-sm transition-all duration-200 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h2 className="text-lg font-bold">Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(prev => !prev)}
            className="ml-auto"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        <nav className="space-y-1 px-2 mt-4">
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
      <main className="flex-1 p-6 overflow-y-auto ml-16 md:ml-64 transition-all duration-200">
        <Outlet />
      </main>
    </div>
  );
}
