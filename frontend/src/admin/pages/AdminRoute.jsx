// components/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useSelector(state => state.adminAuth);
  
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/admin/unauthorized" />;
  
  return children;
};

export default AdminRoute;