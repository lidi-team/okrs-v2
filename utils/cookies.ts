import jsCookie from 'js-cookie';
import cookie from 'cookie';

// User token default
const tokenKey = 'X-Token';
export const getTokenCookie = (): string => jsCookie.get(tokenKey) as string;
export const setTokenCookie = (token: string): string | undefined => jsCookie.set(tokenKey, token);
export const removeTokenCookie = (): void => jsCookie.remove(tokenKey);
