"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "@/services/authService";

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await authService.getMe();
      const userData = response?.user || response?.admin || response || null;
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initAuth() {
      try {
        const response = await authService.getMe();
        if (!ignore) {
          const userData = response?.user || response?.admin || response || null;
          setUser(userData);
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

    initAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (credentials) => {
    const loginResponse = await authService.login(credentials);
    try {
      const meResponse = await authService.getMe();
      const userData = meResponse?.user || meResponse?.admin || meResponse || loginResponse?.user || null;
      setUser(userData);
      return loginResponse;
    } catch {
      if (loginResponse?.user) {
        setUser(loginResponse.user);
      }
      return loginResponse;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout request warning:", err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser: fetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
