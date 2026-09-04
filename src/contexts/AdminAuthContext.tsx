"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { clearAdminToken, getAdminToken, setAdminToken } from "@/services/tokenStorage";

// The backend's login response has no user profile in it - just a token
// (see AdminSession in types/admin.ts). There is no verified "admin user"
// object anywhere in this system, so this context only tracks the email
// typed in at login, purely for display - it's never sent back to the backend.
interface AdminAuthContextValue {
  email: string | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const ADMIN_EMAIL_KEY = "memory_admin_email";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getAdminToken();
    const storedEmail = window.localStorage.getItem(ADMIN_EMAIL_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a persisted session on mount, no async work needed
    setToken(storedToken);
    setEmail(storedToken && storedEmail ? storedEmail : null);
    setIsLoading(false);
  }, []);

  const login = (nextToken: string, nextEmail: string) => {
    setAdminToken(nextToken);
    window.localStorage.setItem(ADMIN_EMAIL_KEY, nextEmail);
    setToken(nextToken);
    setEmail(nextEmail);
  };

  const logout = () => {
    clearAdminToken();
    window.localStorage.removeItem(ADMIN_EMAIL_KEY);
    setToken(null);
    setEmail(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ email, token, isLoading, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
