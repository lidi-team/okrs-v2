import axios from 'axios';
import { getTokenCookie } from '@/utils/cookies';

export const unAuthenticatedservice = axios.create({
  baseURL: `${process.env.baseAPI}`,
  timeout: 5000,
});

export const authenticatedService = axios.create({
  baseURL: `${process.env.baseAPI}/api/v1`,
  timeout: 5000,
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
authenticatedService.interceptors.request.use(
  (config) => {
    // Add Bearer token's header to every request
    if (getTokenCookie() !== null) {
      config.headers.Authorization = `Bearer ${getTokenCookie()}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
