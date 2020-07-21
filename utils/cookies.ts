import Cookies from 'js-cookie';

// User token default
const tokenKey = 'vue_typescript_admin_access_token';
export const getTokenCookies = (): string | undefined => Cookies.get(tokenKey);
export const setTokenCookies = (token: string): string | undefined => Cookies.set(tokenKey, token);
export const removeTokenCookies = (): void => Cookies.remove(tokenKey);
