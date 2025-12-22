'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { api, fetchCsrf, ApiResponse } from '../lib/api';
import { setCsrf, getCsrf } from '../lib/csrf';
import { useToast } from '@/app/(pages)/components/toast';

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

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth from storage
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

  // LOGIN
  // LOGIN
const login = async (email: string, password: string) => {
  try {
    // 1️⃣ Fetch CSRF token only if your API requires it
    // Since your Yii1 API disables CSRF for login, you can skip this
    // But if you want CSRF protection in future:
    // if (!getCsrf()) await fetchCsrf();

    // 2️⃣ Call API
    const res = await fetch('http://localhost:8080/index.php?r=auth/login', {
      method: 'POST',
      credentials: 'include', // send cookies for session if needed
      headers: {
        'Content-Type': 'application/json',
        // 'YII_CSRF_TOKEN': getCsrf() || '', // optional if CSRF is enabled
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // HTTP errors (404, 500, etc)
      const text = await res.text();
      throw new Error(text || 'Login request failed');
    }

    const data: ApiResponse<ApiAuthData> = await res.json();

    if (!data.success || !data.data) throw new Error(data.message || 'Invalid login');

    // 3️⃣ Save token and user
    setToken(data.data.token);
    setUser(data.data.user);
    Cookies.set('token', data.data.token, { path: '/', sameSite: 'lax' });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));

    toast.success('Login successful');
  } catch (e: any) {
    console.error('Login error:', e);
    toast.error(e?.message || 'Login failed');
  }
};


   // SIGNUP - Updated to match login pattern
  const signup = async (payload: SignupPayload) => {
    try {
      // 1️⃣ Fetch CSRF token only if your API requires it
      // Since your Yii1 API disables CSRF for signup, you can skip this
      // if (!getCsrf()) await fetchCsrf();

      // 2️⃣ Call API
      const res = await fetch('http://localhost:8080/index.php?r=auth/signup', {
        method: 'POST',
        credentials: 'include', // send cookies for session if needed
        headers: {
          'Content-Type': 'application/json',
          // 'YII_CSRF_TOKEN': getCsrf() || '', // optional if CSRF is enabled
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // HTTP errors (404, 500, etc)
        const text = await res.text();
        throw new Error(text || 'Signup request failed');
      }

      const data: ApiResponse<ApiAuthData> = await res.json();

      if (!data.success || !data.data) throw new Error(data.message || 'Signup failed');

      // 3️⃣ Save token and user
      setToken(data.data.token);
      setUser(data.data.user);
      Cookies.set('token', data.data.token, { path: '/', sameSite: 'lax' });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      toast.success('Signup successful');
    } catch (e: any) {
      console.error('Signup error:', e);
      toast.error(e?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    Cookies.remove('token', { path: '/' });
    toast.info('Logged out');
  };

  const value = useMemo(() => ({ user, token, loading, login, signup, logout }), [user, token, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
