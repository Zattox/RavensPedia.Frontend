import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { publicRoutes } from "@/config/routes";

// ProtectedRoute component to restrict access based on authentication and admin status
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, isAdmin } = useAuth(); // Extract authentication state from AuthContext
  const location = useLocation(); // Get current location for redirect purposes

  // Display loading spinner while authentication status is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <span className="text-white">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated and route is not public
  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if route is admin-only and user is not an admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Render children if all conditions are met
  return children;
}

export default ProtectedRoute;
