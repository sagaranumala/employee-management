// import { getCsrf, setCsrf } from './csrf';
// import Cookies from 'js-cookie';

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   errors?: Record<string, string[]> | string[];
// }

// type Options = Omit<RequestInit, 'body'> & {
//   body?: unknown;
//   authToken?: string;
//   asForm?: boolean;
// };

// export const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/index.php?r=';

// /**
//  * Fetch CSRF token from server and store it in memory
//  */
// export async function fetchCsrf(): Promise<boolean> {
//   try {
//     console.log('[CSRF] Fetching CSRF token from server...');
//     const res = await fetch(`${API_BASE}auth/csrf`, {
//       credentials: 'include',
//       headers: { 'X-Requested-With': 'XMLHttpRequest' },
//     });

//     console.log('[CSRF] Response status:', res.status);

//     const data = await res.json();
//     console.log('[CSRF] Response data:', data);

//     if (data?.csrfToken && data?.csrfTokenName) {
//       setCsrf(data.csrfToken, data.csrfTokenName);
//       console.log('[CSRF] Token set in memory:', data.csrfTokenName, data.csrfToken);
//       return true;
//     } else {
//       console.warn('[CSRF] Server did not return token:', data);
//     }
//   } catch (err) {
//     console.error('[CSRF] Fetch failed:', err);
//   }
//   return false;
// }

// /**
//  * Main API function
//  */
// export async function api<T = unknown>(
//   path: string,
//   opts: Options = {}
// ): Promise<T> {
//   const headers: HeadersInit = {
//     Accept: 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//   };

//   console.log('[API] Initial headers:', headers);

//   // Build body
//   let body: BodyInit | undefined;
//   if (opts.method && opts.method !== 'GET' && opts.body !== undefined) {
//     if (opts.asForm && opts.body instanceof FormData) {
//       body = opts.body;
//       console.log('[API] Body is FormData:', body);
//     } else {
//       headers['Content-Type'] = 'application/json';
//       body = JSON.stringify(opts.body);
//       console.log('[API] Body JSON stringified:', body);
//     }
//   } else {
//     console.log('[API] No body to attach');
//   }

//   // Attach CSRF token if POST/PUT/DELETE (for Yii)
//   if (opts.method && opts.method !== 'GET') {
//   let csrf = getCsrf();
//   if (!csrf) {
//     await fetchCsrf();
//     csrf = getCsrf();
//   }
//   // Attach CSRF token for POST/PUT/DELETE
// // const csrf = getCsrf();
// if (csrf) {
//   const tokenName = Object.keys(csrf)[0]; // YII_CSRF_TOKEN
//   const tokenValue = csrf[tokenName];
//   headers['X-CSRF-Token'] = tokenValue;
//   console.log('[CSRF] Attached to header:', tokenName, tokenValue);
// }

// }


//   // Attach JWT token
//   const token = opts.authToken || Cookies.get('token');
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//     console.log('[API] JWT token attached:', token);
//   } else {
//     console.log('[API] No JWT token found');
//   }

//   // Log request details
//   console.log('[API] Fetching:', path, 'Method:', opts.method, 'Headers:', headers, 'Body:', body);

//   // Make the request
//   const res = await fetch(`${API_BASE}${path}`, {
//     ...opts,
//     headers,
//     body,
//     credentials: 'include',
//     cache: 'no-store',
//   });

//   console.log('[API] Response status:', res.status);
//   const contentType = res.headers.get('content-type') ?? '';
//   console.log('[API] Response content-type:', contentType);

//   const data = contentType.includes('application/json')
//     ? await res.json()
//     : await res.text();

//   console.log('[API] Response data:', data);

//   if (!res.ok) {
//     console.error('[API] Error:', res.status, data);
//     const msg = typeof data === 'string' ? data : data?.message || 'Request failed';
//     throw new Error(msg);
//   }

//   console.log('[API] Success:', data);
//   return data as T;
// }


// // src/lib/api.ts
// import Cookies from 'js-cookie';
// import { getCsrf, setCsrf } from './csrf';

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   errors?: Record<string, string[]> | string[];
// }

// type Options = Omit<RequestInit, 'body'> & {
//   body?: unknown;
//   authToken?: string;
//   asForm?: boolean;
// };

// export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/index.php?r=';

// /**
//  * Fetch CSRF token from server
//  */
// export async function fetchCsrf(): Promise<boolean> {
//   try {
//     const res = await fetch(`${API_BASE}auth/csrf`, {
//       credentials: 'include',
//       headers: { 'X-Requested-With': 'XMLHttpRequest' },
//     });
//     const data = await res.json();
//     if (data?.csrfToken && data?.csrfTokenName) {
//       setCsrf(data.csrfToken, data.csrfTokenName);
//       return true;
//     }
//   } catch (err) {
//     console.error('[CSRF] fetch failed:', err);
//   }
//   return false;
// }


// /**
//  * Main API function
//  */
// export async function api<T = unknown>(
//   path: string,
//   opts: Options = {}
// ): Promise<T> {
//   const headers: HeadersInit = {
//     Accept: 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//   };

//   // Handle body
//   let body: BodyInit | undefined;
//   if (opts.method && opts.method !== 'GET' && opts.body !== undefined) {
//     if (opts.asForm && opts.body instanceof FormData) {
//       body = opts.body;
//     } else {
//       headers['Content-Type'] = 'application/json';
//       body = JSON.stringify(opts.body);
//     }
//   }

//   // Attach CSRF token if POST/PUT/DELETE
//   if (opts.method && opts.method !== 'GET') {
//     let csrf = getCsrf();
//     if (!csrf) {
//       await fetchCsrf();
//       csrf = getCsrf();
//     }
//     if (csrf) {
//       const tokenName = Object.keys(csrf)[0];
//       headers['X-CSRF-Token'] = csrf[tokenName];
//     }
//   }

//   // Attach JWT token if available
//   const token = opts.authToken || Cookies.get('token');
//   if (token) headers['Authorization'] = `Bearer ${token}`;

//   // Perform fetch
//   const res = await fetch(`${API_BASE}${path}`, {
//     ...opts,
//     headers,
//     body,
//     credentials: 'include',
//     cache: 'no-store',
//   });

//   const contentType = res.headers.get('content-type') ?? '';
//   const data = contentType.includes('application/json') ? await res.json() : await res.text();

//   if (!res.ok) {
//     const msg = typeof data === 'string' ? data : data?.message || 'Request failed';
//     throw new Error(msg);
//   }

//   return data as T;
// }


import Cookies from 'js-cookie';
import { getCsrf, setCsrf } from './csrf';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
}

type Options = Omit<RequestInit, 'body'> & {
  body?: unknown;
  authToken?: string;
  asForm?: boolean;
};

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/index.php?r=';

/**
 * Fetch CSRF token from server
 */
export async function fetchCsrf(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}auth/csrf`, {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    const data = await res.json();
    if (data?.csrfToken && data?.csrfTokenName) {
      setCsrf(data.csrfToken, data.csrfTokenName);
      return true;
    }
  } catch (err) {
    console.error('[CSRF] fetch failed:', err);
  }
  return false;
}

/**
 * Main API function
 */
export async function api<T = unknown>(
  path: string,
  opts: Options = {}
): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  let body: BodyInit | undefined;
  if (opts.method && opts.method !== 'GET' && opts.body !== undefined) {
    if (opts.asForm && opts.body instanceof FormData) {
      body = opts.body;
      // Don't set Content-Type; browser sets it automatically for FormData
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(opts.body);
    }
  }

  // Attach CSRF token if POST/PUT/DELETE
  if (opts.method && opts.method !== 'GET') {
    let csrf = getCsrf();
    if (!csrf) {
      await fetchCsrf();
      csrf = getCsrf();
    }
    if (csrf) {
      const tokenName = Object.keys(csrf)[0];
      headers['X-CSRF-Token'] = csrf[tokenName];
    }
  }

  // Attach JWT token if available
  const token = opts.authToken || Cookies.get('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    body,
    credentials: 'include',
    cache: 'no-store',
  });

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof data === 'string' ? data : data?.message || 'Request failed';
    throw new Error(msg);
  }

  return data as T;
}

/**
 * API helper for uploading files (FormData)
 */
export async function uploadFile<T = unknown>(
  path: string,
  file: File,
  fieldName = 'profile',
  authToken?: string
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  return api<T>(path, {
    method: 'POST',
    body: formData,
    asForm: true,
    authToken,
  });
}
