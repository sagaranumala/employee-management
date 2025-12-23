// import Cookies from 'js-cookie';
// import { getCsrf, setCsrf } from './csrf2';

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
//     // Try multiple endpoints as Yii 1.1 might have different setups
//     // const endpoints = [
//     //   `${API_BASE}auth/csrf`,
//     // //   `${API_BASE}site/csrf`,
//     // //   API_BASE.replace('?r=', '') // Try the base URL
//     // ];
    
//     let success = false;
//       try {
//         const res = await fetch( `${API_BASE}auth/csrf`, {
//           method: 'GET',
//           credentials: 'include',
//           headers: { 
//             'X-Requested-With': 'XMLHttpRequest',
//             'Accept': 'application/json'
//           },
//         });
        
//         if (res.ok) {
//           const contentType = res.headers.get('content-type') || '';
//           if (contentType.includes('application/json')) {
//             const data = await res.json();
    
//             // Handle different response formats
//             if (data?.csrfToken && data?.csrfName) {
//               setCsrf(data.csrfToken, data.csrfName);
//               success = true;
//             } else if (data?.token) {
//               setCsrf(data.token, data.name || 'YII_CSRF_TOKEN');
//               success = true;
//             } else if (typeof data === 'string' && data.length > 10) {
//               // If the response is just a token string
//               setCsrf(data, 'YII_CSRF_TOKEN');
//               success = true;
//             }
//           }
//         }
//       } catch (err) {
//         // Silently try next endpoint
    
//       }
//     // If no endpoint worked, check existing cookies
//     if (!success) {
//       const existingToken = Cookies.get('YII_CSRF_TOKEN');
//       if (existingToken) {
//         setCsrf(existingToken, 'YII_CSRF_TOKEN');
//         success = true;
//       }
//     }
    
//     return success;
//   } catch (err) {
//     console.error('[CSRF] fetch failed:', err);
//     return false;
//   }
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
//   const method = opts.method?.toUpperCase() || 'GET';
//   const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

//   // Handle FormData
//   if (opts.asForm && opts.body instanceof FormData) {
//     body = opts.body;
//     // Don't set Content-Type for FormData - browser sets it with boundary
//   } 
//   // Handle JSON body for write methods or when body is provided
//   else if (opts.body && typeof opts.body === 'object') {
//     headers['Content-Type'] = 'application/json';
//     body = JSON.stringify(opts.body);
//   }

//   // Handle CSRF token for write methods
//   if (isWriteMethod) {
//     let csrf = getCsrf();
    
//     // If no CSRF token, try to fetch one
//     if (!csrf) {
//       await fetchCsrf();
//       csrf = getCsrf();
//     }
    
//     if (csrf) {

//       // Get token name and value - handle both object formats
//       const tokenName = csrf.name || 'YII_CSRF_TOKEN';
//       const tokenValue = csrf.token || csrf[tokenName];
      
//       console.log('CSRF Token:', tokenName, tokenValue);
      
//       // Add CSRF token to headers
//       headers[tokenName] = tokenValue;
      
//       // Yii 1.1 typically expects CSRF token in the POST body
//       // For FormData, append the token
//       if (opts.asForm && body instanceof FormData) {
//         body.append(tokenName, tokenValue);
//       } 
//       // For JSON requests, merge token into body
//       else if (opts.body && typeof opts.body === 'object') {
//         const bodyObj = { ...opts.body as any, [tokenName]: tokenValue };
//         body = JSON.stringify(bodyObj);
//       }
//       // For write methods without body, create body with just CSRF token
//       else if (!body) {
//         const bodyObj = { [tokenName]: tokenValue };
//         headers['Content-Type'] = 'application/json';
//         body = JSON.stringify(bodyObj);
//       }
      
//       // Also include cookie if available (for compatibility)
//       const csrfCookie = Cookies.get('YII_CSRF_TOKEN');
//       if (csrfCookie && !headers['YII_CSRF_TOKEN']) {
//         headers['YII_CSRF_TOKEN'] = csrfCookie;
//       }
//     } else {
//       console.warn('No CSRF token available for write operation');
//     }
//   }

//   // Attach JWT token
//   const token = opts.authToken || Cookies.get('token');
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   // Log request details for debugging
//   console.log('API Request:', {
//     url: `${API_BASE}${path}`,
//     method,
//     headers,
//     body: body ? (body instanceof FormData ? '[FormData]' : body) : undefined,
//   });

//   const res = await fetch(`${API_BASE}${path}`, {
//     ...opts,
//     method,
//     headers,
//     body,
//     credentials: 'include',
//     cache: 'no-store',
//   });

//   // Handle CSRF token expiration
//   if (res.status === 400 || res.status === 403 || res.status === 419) {
//     const responseText = await res.text();
    
//     if (responseText.includes('CSRF') || 
//         responseText.includes('token') || 
//         responseText.includes('The CSRF token could not be verified')) {
      
//       console.log('CSRF token expired, refreshing...');
      
//       // Clear old CSRF and fetch new one
//       localStorage.removeItem('csrf');
//       await fetchCsrf();
      
//       // Retry the request once with new token
//       return api(path, opts);
//     }
//   }

//   // Parse response
//   const contentType = res.headers.get('content-type') ?? '';
//   let data: any;
  
//   if (contentType.includes('application/json')) {
//     try {
//       data = await res.json();
//     } catch (err) {
//       // If JSON parsing fails, try text
//       data = await res.text();
//     }
//   } else {
//     data = await res.text();
//   }

//   if (!res.ok) {
//     const errorMessage = typeof data === 'string' 
//       ? data 
//       : data?.message || data?.error || `Request failed with status ${res.status}`;
    
//     console.error('API Error:', {
//       status: res.status,
//       message: errorMessage,
//       data
//     });
    
//     throw new Error(errorMessage);
//   }

//   return data as T;
// }

// /**
//  * API helper for GET requests
//  */
// export async function apiGet<T = unknown>(path: string, queryParams?: Record<string, any>): Promise<T> {
//   let url = path;
  
//   if (queryParams && Object.keys(queryParams).length > 0) {
//     const params = new URLSearchParams();
//     Object.entries(queryParams).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         params.append(key, String(value));
//       }
//     });
//     url = `${path}?${params.toString()}`;
//   }
  
//   return api<T>(url, { method: 'GET' });
// }

// /**
//  * API helper for POST requests
//  */
// export async function apiPost<T = unknown>(
//   path: string, 
//   data?: any, 
//   options?: Omit<Options, 'method' | 'body'>
// ): Promise<T> {
//   return api<T>(path, {
//     method: 'POST',
//     body: data,
//     ...options,
//   });
// }

// /**
//  * API helper for PUT requests
//  */
// export async function apiPut<T = unknown>(
//   path: string, 
//   data?: any, 
//   options?: Omit<Options, 'method' | 'body'>
// ): Promise<T> {
//   return api<T>(path, {
//     method: 'PUT',
//     body: data,
//     ...options,
//   });
// }

// /**
//  * API helper for DELETE requests
//  */
// export async function apiDelete<T = unknown>(
//   path: string, 
//   data?: any, 
//   options?: Omit<Options, 'method' | 'body'>
// ): Promise<T> {
//   return api<T>(path, {
//     method: 'DELETE',
//     body: data,
//     ...options,
//   });
// }

// /**
//  * API helper for uploading files (FormData)
//  */
// export async function uploadFile<T = unknown>(
//   path: string,
//   file: File,
//   fieldName = 'profile',
//   additionalData?: Record<string, any>,
//   authToken?: string
// ): Promise<T> {
//   const formData = new FormData();
//   formData.append(fieldName, file);
  
//   // Add additional data to FormData
//   if (additionalData) {
//     Object.entries(additionalData).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value instanceof Blob ? value : String(value));
//       }
//     });
//   }

//   return api<T>(path, {
//     method: 'POST',
//     body: formData,
//     asForm: true,
//     authToken,
//   });
// }