import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

// Create AuthContext for managing authentication state
const AuthContext = createContext();

// AuthProvider component to provide authentication context to children
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null,
  }); // State to manage authentication status
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Logout handler to reset auth state and redirect to login
  const handleLogout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null,
    });
    navigate("/login");
  }, [navigate]);

  // Function to check authentication status and fetch user data
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/auth/me/"); // Request current user data
      if (response.data.role) {
        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: {
            email: response.data.email,
            role: response.data.role,
          },
          error: null,
        });
        return true;
      }
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized error
        try {
          await api.post("/auth/refresh/"); // Attempt token refresh
          return await checkAuth(); // Recheck auth after refresh
        } catch (refreshError) {
          console.log(refreshError); // Log refresh error
          return false;
        }
      }
      return false;
    }
  }, []);

  // Login function to authenticate user with email and password
  const login = async (email, password) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null })); // Set loading state
      await api.post("/auth/login/", { email, password }); // Send login request
      await checkAuth(); // Verify authentication after login
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.detail || "Login failed", // Set error message
      }));
      throw error;
    }
  };

  // Logout function to end user session
  const logout = async () => {
    try {
      await api.post("/auth/logout/"); // Send logout request
    } finally {
      handleLogout(); // Reset state and redirect regardless of request outcome
    }
  };

  // Effect to initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth(); // Check auth status on component mount
    };
    initializeAuth();
  }, [checkAuth]);

  // Context value with auth state and methods
  const value = {
    ...authState,
    login,
    logout,
    isAdmin: () =>
      authState.user?.role === "admin" ||
      authState.user?.role === "super_admin", // Check if user is admin
    isSuperAdmin: () => authState.user?.role === "super_admin", // Check if user is super admin
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Render children with auth context */}
    </AuthContext.Provider>
  );
}

// Hook to access AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Error for missing provider
  }
  return context;
}
