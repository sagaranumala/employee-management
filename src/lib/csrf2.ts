// // csrf.ts
// import Cookies from 'js-cookie';
// let csrfData: { name: string; token: string } | null = null;

// export function getCsrf(): { name: string; token: string } | null {
//   // Return cached value if available
//   if (csrfData) {
//     return csrfData;
//   }
  
//   // Try to get from localStorage
//   try {
//     const stored = localStorage.getItem('csrf');
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       // Validate structure
//       if (parsed && (parsed.token || parsed[parsed.name])) {
//         csrfData = {
//           name: parsed.name || 'YII_CSRF_TOKEN',
//           token: parsed.token || parsed[parsed.name] || ''
//         };
//         return csrfData;
//       }
//     }
//   } catch (err) {
//     console.warn('Failed to parse CSRF from localStorage:', err);
//   }
  
//   // Try to get from cookie
//   const cookieToken = Cookies.get('YII_CSRF_TOKEN');
//   if (cookieToken) {
//     csrfData = { name: 'YII_CSRF_TOKEN', token: cookieToken };
//     // Cache it
//     localStorage.setItem('csrf', JSON.stringify(csrfData));
//     return csrfData;
//   }
  
//   return null;
// }

// export function setCsrf(token: string, name: string = 'YII_CSRF_TOKEN'): void {
//   csrfData = { name, token };
  
//   // Store in localStorage
//   try {
//     localStorage.setItem('csrf', JSON.stringify(csrfData));
//   } catch (err) {
//     console.warn('Failed to store CSRF in localStorage:', err);
//   }
  
//   // Also set cookie for compatibility
//   Cookies.set(name, token, {
//     path: '/',
//     sameSite: 'lax',
//     secure: process.env.NODE_ENV === 'production',
//   });
// }

// export function clearCsrf(): void {
//   csrfData = null;
  
//   // Clear from localStorage
//   try {
//     localStorage.removeItem('csrf');
//   } catch (err) {
//     // Ignore
//   }
  
//   // Clear cookies
//   Cookies.remove('YII_CSRF_TOKEN');
//   Cookies.remove('_csrf');
// }