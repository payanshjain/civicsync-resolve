import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// For regular logged-in users
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// For admin users only
export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

