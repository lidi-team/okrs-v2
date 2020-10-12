import Cookies from 'js-cookie';

// User token default
const tokenKey = 'thaycacac';
export const getTokenCookie = (): string => Cookies.get(tokenKey) as string;
export const setTokenCookie = (token: string): string | undefined => Cookies.set(tokenKey, token, { expires: 7 });
export const removeTokenCookie = (): void => Cookies.remove(tokenKey);
