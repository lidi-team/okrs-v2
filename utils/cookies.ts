import Cookies from 'js-cookie';

// User token default
const tokenKey = 'token';
export const getTokenCookie = (): string => Cookies.get(tokenKey) as string;
export const setTokenCookie = (token: string): string | undefined => Cookies.set(tokenKey, token);
export const removeTokenCookie = (): void => Cookies.remove(tokenKey);
