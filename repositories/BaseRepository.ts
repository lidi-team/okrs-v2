import axios from 'axios';
import { getTokenCookie } from '@/utils/cookies';
import { notifyAction } from '@/constants/app.notify';

export const unAuthenticatedservice = axios.create({
  baseURL: `${process.env.baseAPI}/api/v1`,
});

export const authenticatedService = axios.create({
  baseURL: `${process.env.baseAPI}/api/v1`,
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

authenticatedService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    switch (error.response.data.statusCode) {
      case 401:
        notifyAction('Phiên hoạt động đã hết. Vui lòng đăng nhập lại', 'error');
        break;
      case 403:
        notifyAction('Bạn không có quyền truy cập vào khu vực này', 'error');
        break;
      case 440: // error already exist instance
        notifyAction(error.response.data.message, 'error');
        break;
      case 490: // DB logic error
        notifyAction(error.response.data.message, 'error');
        break;
      case 500:
        notifyAction('Có lỗi xảy ra', 'error');
        break;
    }
    return Promise.reject(error);
  },
);
