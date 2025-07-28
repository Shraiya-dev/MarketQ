
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '@/lib/types';
import { userRoles } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'socialflow-auth-user';

// Create a dummy user based on email and role
const createDummyUser = (email: string, role: UserRole): User => {
  const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  return {
    id: `user-${Date.now()}`,
    name: name || "SocialFlow User",
    email,
    role,
    avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
  };
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from storage", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string) => {
    // Determine role based on email for simulation
    let role: UserRole = 'User';
    if (email.toLowerCase() === 'admin@example.com') {
      role = 'Admin';
    } else if (email.toLowerCase() === 'superadmin@example.com') {
      role = 'Superadmin';
    }

    const newUser = createDummyUser(email, role);
    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
        console.error("Failed to save user to storage", error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to remove user from storage", error);
    }
  };
  

  const value = { user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
