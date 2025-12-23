// src/lib/csrf.ts
import { API_BASE } from './api';
import { useToast } from '@/app/(pages)/components/toast';

const toast = useToast();

// Store CSRF token name & value
let csrfToken: { name: string; value: string } | null = null;

/**
 * Fetch a fresh CSRF token from backend
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}auth/csrf`, {
      credentials: 'include', // send cookies
    });

    const data = await res.json();

    if (data?.csrfToken && data?.csrfName) {
      setCsrfToken(data.csrfToken, data.csrfName);
      return data.csrfToken;
    }

    if (data?.YII_CSRF_TOKEN) {
      setCsrfToken(data.YII_CSRF_TOKEN, 'YII_CSRF_TOKEN');
      return data.YII_CSRF_TOKEN;
    }

    return null;
  } catch (err) {
    toast.error('Failed to fetch CSRF token');
    return null;
  }
}

/**
 * Store CSRF token in memory
 */
export function setCsrfToken(token: string, name: string = 'YII_CSRF_TOKEN') {
  csrfToken = { name, value: token };
}

/**
 * Get current CSRF token value
 */
export function getCsrfToken(): string | null {
  return csrfToken?.value || null;
}

/**
 * Get current CSRF token name
 */
export function getCsrfName(): string | null {
  return csrfToken?.name || null;
}

/**
 * Clear token
 */
export function clearCsrfToken() {
  csrfToken = null;
}

/**
 * Add CSRF token to headers for POST/PUT requests
 */
export function addCsrfHeader(headers: HeadersInit = {}): HeadersInit {
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken.value;
  }
  return headers;
}

/**
 * Add CSRF token to FormData (for multipart/form-data requests)
 */
export function appendCsrfToFormData(fd: FormData) {
  if (csrfToken) {
    fd.append(csrfToken.name, csrfToken.value);
  }
}
