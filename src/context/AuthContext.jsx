
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import authService from "@/services/authService";

/**
 * Authentication Context
 */
const AuthContext = createContext(null);

/**
 * Extract user from backend response.
 */
function extractUser(response) {
  return (
    response?.user ||
    response?.admin ||
    null
  );
}

/**
 * Global Authentication Provider.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch current authenticated session.
   */
  const fetchSession = useCallback(async () => {
    setLoading(true);

    try {
      const response = await authService.getMe();

      const userData = extractUser(response);

      setUser(userData);

      return userData;
    } catch (error) {
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initialize authentication on application mount.
   */
  useEffect(() => {
    let ignore = false;

    async function initializeAuth() {
      try {
        const response = await authService.getMe();

        if (!ignore) {
          setUser(extractUser(response));
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Login user.
   */
  const login = async (credentials) => {
    setLoading(true);

    try {
      const loginResponse = await authService.login(credentials);

      try {
        const meResponse = await authService.getMe();

        const userData =
          extractUser(meResponse) ||
          extractUser(loginResponse);

        setUser(userData);

        return loginResponse;
      } catch {
        const userData = extractUser(loginResponse);

        setUser(userData);

        return loginResponse;
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user.
   */
  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout request warning:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  /**
   * Context values.
   */
  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser: fetchSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Authentication Hook.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}

export default AuthContext;
