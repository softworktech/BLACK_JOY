"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiPost, apiGet } from '@/lib/api';
import { setToken, setAdminUser, getToken, getAdminUser, logout as authLogout } from '@/lib/auth';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initial load from storage to prevent flicker
    const storedUser = getAdminUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Only check auth if we are in admin routes and not on login page
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await apiGet('/user');
      setUser(response);
      setAdminUser(response);
    } catch (error) {
      authLogout();
      setUser(null);
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiPost('/login', { email, password });
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        setAdminUser(response.user);
        router.push('/admin');
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiPost('/logout');
    } catch (error) {
      console.error('Logout API error', error);
    } finally {
      authLogout();
      setUser(null);
      router.push('/admin/login');
    }
  };

  return (
    <AdminContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
