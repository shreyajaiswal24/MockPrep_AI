"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { User, AuthTokens, LoginCredentials, RegisterData } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.get("/auth/profile/");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("tokens");
    }
  }, []);

  useEffect(() => {
    const tokens = localStorage.getItem("tokens");
    const savedUser = localStorage.getItem("user");

    if (tokens && savedUser) {
      setUser(JSON.parse(savedUser));
      refreshProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshProfile]);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login/", credentials);
    const tokens: AuthTokens = response.data;
    localStorage.setItem("tokens", JSON.stringify(tokens));

    await refreshProfile();
  };

  const register = async (data: RegisterData) => {
    await api.post("/auth/register/", data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
