import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Checking authentication...</p>
    </div>
  </div>
);

// For regular logged-in users
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute - isLoading:', isLoading);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// For admin users only
export const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log('AdminRoute - isLoading:', isLoading);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - user:', user);
  console.log('AdminRoute - user role:', user?.role);
  console.log('AdminRoute - is admin?', user?.role === 'admin');

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('AdminRoute - Redirecting to login: not authenticated');
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if authenticated but not admin
  if (user?.role !== 'admin') {
    console.log('AdminRoute - Redirecting to home: not admin role');
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin
  console.log('AdminRoute - Access granted: user is admin');
  return <Outlet />;
};

// Alternative AdminRoute with more detailed error handling
export const AdminRouteWithFallback = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.error('AdminRoute: User is authenticated but user object is null');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You need administrator privileges to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Current role: {user.role}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
