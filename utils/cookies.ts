import Cookies from 'js-cookie';

// User token default
const tokenKey = 'this_is_a_token';
export const getTokenCookies = (): string => Cookies.get(tokenKey) as string;
export const setTokenCookies = (token: string): string | undefined => Cookies.set(tokenKey, token);
export const removeTokenCookies = (): void => Cookies.remove(tokenKey);
