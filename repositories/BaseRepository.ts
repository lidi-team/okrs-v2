import axios from 'axios';
import { Notification } from 'element-ui';
import { getTokenCookie } from '@/utils/cookies';

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
        Notification.error({
          title: 'Trạng thái',
          message: 'Phiên hoạt động đã hết. Vui lòng đăng nhập lại',
          duration: 2000,
        });
        break;
      case 403:
        Notification.error({
          title: 'Trạng thái',
          message: 'Bạn không có quyền truy cập vào khu vực này',
          duration: 2000,
        });
        break;
      case 500:
        Notification.error({
          title: 'Trạng thái',
          message: 'Có lỗi xảy ra',
          duration: 2000,
        });
        break;
      default:
        Notification.error({
          title: 'Trạng thái',
          message: 'Có lỗi xảy ra',
          duration: 2000,
        });
    }
    return Promise.reject(error);
  },
);
