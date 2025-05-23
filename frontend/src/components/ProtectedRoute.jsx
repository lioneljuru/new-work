// components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function ProtectedRoute({ children, requiredRole = 'admin' }) {
  const { isAuthenticated, user } = useSelector(state => state.adminAuth);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast("Access Denied", {
        description: "Please login to access admin panel",
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'root' && user.role !== 'root') {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
}