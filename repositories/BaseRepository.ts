import axios from 'axios';
import { Notification } from 'element-ui';

import { getTokenCookie } from '@/utils/cookies';
import { notificationConfig } from '@/constants/app.constant';

export const baseUrlV1 = axios.create({
  baseURL: `${process.env.baseAPIV1}/api/v1`,
});

export const baseUrl = axios.create({
  baseURL: `${process.env.baseAPI}/api`,
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
baseUrl.interceptors.request.use(
  (config) => {
    // Add Bearer token's header to every request
    if (getTokenCookie() !== null) {
      config.headers.Authorization = `lidi ${getTokenCookie()}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

baseUrl.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    switch (error.response.data.statusCode) {
      case 401:
        window.location.href = '/dang-nhap';
        break;
      case 403:
        Notification.error({
          ...notificationConfig,
          message: 'Bạn không có quyền truy cập vào khu vực này',
        });
        break;
      case 404:
        window.location.href = `${process.env.baseURL}/404`;
        break;
      case 440: // error already exist instance
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 490: // DB logic error
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 495: // DB Constraint
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 500:
        Notification.error({
          ...notificationConfig,
          message: 'Có lỗi xảy ra',
        });
        break;
    }
    return Promise.reject(error);
  },
);
