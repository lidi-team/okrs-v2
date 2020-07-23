import axios from 'axios';
import { Message } from 'element-ui';
import { getTokenCookie } from '@/utils/cookies';

export const unAuthenticatedservice = axios.create({
  baseURL: `${process.env.baseAPI}`,
  timeout: 5000,
});

// unAuthenticatedservice.interceptors.response.use(
//   (response) => {
//     if (response.status === 401) {
//       Message({
//         message: 'Sai thông tin tài khoản',
//         type: 'error',
//         duration: 5 * 1000,
//       });
//     } else {
//       return response.data;
//     }
//   },
//   (error) => {
//     const message = error.message === 'Network Error' ? 'Lỗi kết nối' : error.message;
//     Message({
//       message,
//       type: 'error',
//       duration: 5 * 1000,
//     });
//     return Promise.reject(error);
//   },
// );

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
