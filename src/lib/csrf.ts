// src/lib/csrf.ts
let csrfToken: Record<string, string> | null = null;

export function setCsrf(tokenValue: string, tokenName: string) {
  csrfToken = { [tokenName]: tokenValue };
}

export function getCsrf(): Record<string, string> | null {
  return csrfToken;
}

export function clearCsrf() {
  csrfToken = null;
}
