// import Cookies from 'js-cookie';
// import { getCsrf, setCsrf } from './csrf';
// import { useAuth } from '@/src/auth/AuthContext'; // import context if needed

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   errors?: Record<string, string[]> | string[];
// }

// type Options = Omit<RequestInit, 'body'> & {
//   body?: unknown;
//   authToken?: string;       // optional token
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
//     // console.log(data);
//     if (data?.csrfToken && data?.csrfName) {
//       console.log(data);
//       setCsrf(data.csrfToken, data.csrfName);
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
//       // console.log(csrf[tokenName]);
//       headers['X-CSRF-Token'] = csrf[tokenName];
//     }
//   }

//   // Attach JWT token: either from opts or from cookie
//   let token = opts.authToken || Cookies.get('token'); // fallback to cookie
//   if (token) headers['Authorization'] = `Bearer ${token}`;

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

// /**
//  * API helper for uploading files (FormData)
//  */
// export async function uploadFile<T = unknown>(
//   path: string,
//   file: File,
//   fieldName = 'profile',
//   authToken?: string
// ): Promise<T> {
//   const formData = new FormData();
//   formData.append(fieldName, file);

//   return api<T>(path, {
//     method: 'POST',
//     body: formData,
//     asForm: true,
//     authToken,
//   });
// }


// import Cookies from 'js-cookie';
// import { getCsrf, setCsrf } from './csrf';
// import { useAuth } from '@/src/auth/AuthContext';

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   errors?: Record<string, string[]> | string[];
// }

// type Options = Omit<RequestInit, 'body'> & {
//   body?: unknown;
//   authToken?: string;       // optional token
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
//     console.log(data);
//     if (data?.csrfToken && data?.csrfName) {
//       setCsrf(data.csrfToken, data.csrfName);
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

//   let body: BodyInit | undefined;

//   // Only send body if it is non-empty or FormData
//   if (opts.method && opts.method !== 'GET') {
//     if (opts.asForm && opts.body instanceof FormData) {
//       body = opts.body;
//     } else if (opts.body && typeof opts.body === 'object' && Object.keys(opts.body).length > 0) {
//       headers['Content-Type'] = 'application/json';
//       body = JSON.stringify(opts.body);
//     }
//     // If body is {} or empty, do not send it (avoids Yii 1.1 CSRF error)
//   }

//   // Attach CSRF token if POST/PUT/DELETE
//   // Attach CSRF token for POST/PUT/DELETE
// if (opts.method && opts.method !== 'GET') {
//   let csrf = getCsrf();
//   if (!csrf) {
//     await fetchCsrf();
//     csrf = getCsrf();
//   }
//   if (csrf) {
//     const tokenName = Object.keys(csrf)[0]; // e.g. YII_CSRF_TOKEN
//    const tokenName1="X-CSRF-Token"
//     let tokenValue = csrf[tokenName];

//     console.log(tokenName,tokenValue);
//     // URL decode the token (important for Yii 1.1)
//   try {
//     tokenValue = decodeURIComponent(tokenValue);
//   } catch (e) {
//     // If it's not URL-encoded, use as is
//     console.log('Token was not URL-encoded');
//   }
//   console.log("enocodednbjbbhb--------", tokenValue)
//     // Yii 1.1 accepts either:
//     // 1️⃣ header with the name of the token, or
//     // 2️⃣ body/query parameter
//     headers[tokenName1] = tokenValue;


//     // If sending JSON body, also include in body
//     // if (opts.body && typeof opts.body === 'object' && !opts.asForm) {
//     //   (opts.body as any)[tokenName] = tokenValue;
//     //   body = JSON.stringify(opts.body);
//     // }
//     if (opts.method && opts.method !== 'GET' && !opts.asForm) {
//     const bodyObj = opts.body ? { ...opts.body } : {};
//     bodyObj[tokenName] = tokenValue;
//     body = JSON.stringify(bodyObj);
//   }
//   }
// }

//   // Attach JWT token: either from opts or from cookie
//   // const token = opts.authToken || Cookies.get('token');
//   // if (token) headers['Authorization'] = `Bearer ${token}`;
//   // ATTACH JWT TOKEN FOR ALL REQUESTS (including GET)
//   const token = Cookies.get('token') || localStorage.getItem('token');
//   console.log(token,"THIS IS JWT");
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   } else {
//     console.warn('No JWT token found for API request');
//   }

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

// /**
//  * API helper for uploading files (FormData)
//  */
// // export async function uploadFile<T = unknown>(
// //   path: string,
// //   file: File,
// //   fieldName = 'profile',
// //   authToken?: string
// // ): Promise<T> {
// //   const formData = new FormData();
// //   formData.append(fieldName, file);

// //   return api<T>(path, {
// //     method: 'POST',
// //     body: formData,
// //     asForm: true,
// //     authToken,
// //   });
// // }

// /**
//  * API helper for uploading files (FormData) with CSRF protection
//  */
// export async function uploadFile<T = unknown>(
//   path: string,
//   file: File,
//   fieldName = 'profile',
//   authToken?: string
// ): Promise<T> {
//   const formData = new FormData();
//   formData.append(fieldName, file);

//   // Get CSRF token for FormData uploads
//   let csrf = getCsrf();
//   if (!csrf) {
//     await fetchCsrf();
//     csrf = getCsrf();
//   }
  
//   // Add CSRF token to FormData for Yii 1.1
//   if (csrf) {
//     const tokenName = Object.keys(csrf)[0];
//     const tokenValue = csrf[tokenName];
//     formData.append(tokenName, tokenValue);
//     console.log('Added CSRF to FormData:', tokenName, tokenValue);
//   }

//   return api<T>(path, {
//     method: 'POST',
//     body: formData,
//     asForm: true,
//     authToken,
//   });
// }



import Cookies from 'js-cookie';
import { appendCsrfToFormData, fetchCsrfToken, getCsrfToken, setCsrfToken} from './csrf';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
}

type Options = Omit<RequestInit, 'body'> & {
  body?: Record<string, any>;
  authToken?: string;
};

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:8080/index.php?r=';

/**
 * Fetch CSRF token from Yii
 */
export async function fetchCsrf(): Promise<void> {
  const res = await fetch(`${API_BASE}auth/csrf`, {
    credentials: 'include',
  });
  const data = await res.json();

  if (data?.csrfToken && data?.csrfName) {
    setCsrfToken(data.csrfToken, data.csrfName);
  }
}

/**
 * MAIN API FUNCTION (Yii 1.1 CSRF SAFE)
 */
export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  let body: BodyInit | undefined;

  // Handle FormData
  if (opts.asForm && opts.body instanceof FormData) {
    body = opts.body;
    // DO NOT set headers['Content-Type'] — browser sets multipart/form-data automatically
  } else if (opts.body && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  // CSRF for non-GET (already handled in uploadFile for FormData)
  if (!opts.asForm && opts.method && opts.method !== 'GET') {
    const csrf = getCsrfToken();
    if (csrf) {
      const tokenName = Object.keys(csrf)[0];
      const tokenValue = decodeURIComponent(csrf[tokenName]);
      headers[tokenName] = tokenValue;
      headers['X-CSRF-Token'] = tokenValue;

      if (opts.body && typeof opts.body === 'object') {
        (opts.body as any)[tokenName] = tokenValue;
        body = JSON.stringify(opts.body);
      }
    }
  }

  // JWT token
  const token = opts.authToken || Cookies.get('token') || localStorage.getItem('token');
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
 * Upload file helper - SIMPLIFIED
 */
/**
 * API helper for uploading files (FormData)
 */
/**
 * Upload file helper - UPDATED to include employeeId
 */
// export async function uploadFile<T = unknown>(
//   path: string,
//   file: File,
//   fieldName = 'profile',
//   authToken?: string
// ): Promise<T> {
//   const formData = new FormData();
//   formData.append(fieldName, file);

//   // 1️⃣ Append CSRF token
//   let csrf = getCsrf();
//   if (!csrf) {
//     await fetchCsrf();
//     csrf = getCsrf();
//   }

//   if (csrf) {
//     const tokenName = Object.keys(csrf)[0]; // "YII_CSRF_TOKEN"
//     const tokenValue = decodeURIComponent(csrf[tokenName]);
//     formData.append(tokenName, tokenValue);
//   }

//   return api<T>(path, {
//     method: 'POST',
//     body: formData,
//     asForm: true, // very important! prevents JSON Content-Type
//     authToken,
//   });
// }


export async function uploadFile<T = unknown>(
  path: string,
  file: File,
  fieldName = 'profile',
  extraData?: Record<string, string>,
  authToken?: string
): Promise<T> {

  // Ensure CSRF token exists
  if (!getCsrfToken()) {
    await fetchCsrfToken();
  }

  const formData = new FormData();

  // 1️⃣ File
  formData.append(fieldName, file);

  // 2️⃣ Extra fields (employeeId, etc.)
  if (extraData) {
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  // 3️⃣ CSRF token (CORRECT WAY)
  appendCsrfToFormData(formData);

  return api<T>(path, {
    method: 'POST',
    body: formData,
    asForm: true, // REQUIRED for multipart/form-data
    authToken,
  });
}