'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { API_BASE, ApiResponse } from '../lib/api';
import { useToast } from '@/app/(pages)/components/toast';
import { appendCsrfToFormData, addCsrfHeader, fetchCsrfToken, getCsrfToken } from '@/src/lib/csrf';

/* ================= TYPES ================= */

export interface ApiUser {
  userId: string;
  email: string;
  name?: string;
  role?: string;
}

export interface ApiAuthData {
  token: string;
  user: ApiUser;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

interface AuthState {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthCtx = createContext<AuthState | undefined>(undefined);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== Restore auth on reload ===== */
  useEffect(() => {
    try {
      const storedToken = Cookies.get('token') || localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.clear();
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email: string, password: string) => {
    try {
      if (!getCsrfToken()) await fetchCsrfToken();

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      appendCsrfToFormData(formData);

      const res = await fetch(`${API_BASE}auth/login`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...addCsrfHeader(),
        },
      });

      const data: ApiResponse<ApiAuthData> = await res.json();

      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.data.token);
      setUser(data.data.user);

      Cookies.set('token', data.data.token, { path: '/', sameSite: 'lax' });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      toast.success('Login successful');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  /* ================= SIGNUP ================= */
  const signup = async (payload: SignupPayload) => {
    try {
      if (!getCsrfToken()) await fetchCsrfToken();

      const formData = new FormData();
      formData.append('SignupForm[name]', payload.name);
      formData.append('SignupForm[email]', payload.email);
      formData.append('SignupForm[password]', payload.password);
      if (payload.phone) formData.append('SignupForm[phone]', payload.phone);
      if (payload.role) formData.append('SignupForm[role]', payload.role);

      appendCsrfToFormData(formData);

      const res = await fetch(`${API_BASE}auth/signup`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...addCsrfHeader(),
        },
      });

      const data: ApiResponse<ApiAuthData> = await res.json();

      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.message || 'Signup failed');
      }

      setToken(data.data.token);
      setUser(data.data.user);

      Cookies.set('token', data.data.token, { path: '/', sameSite: 'lax' });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      toast.success('Signup successful');
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Signup failed');
      throw err;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    Cookies.remove('token', { path: '/' });
    toast.info('Logged out');
  };

  /* ================= CONTEXT VALUE ================= */
  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/* ================= HOOK ================= */
export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
