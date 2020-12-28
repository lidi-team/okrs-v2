import axios from 'axios';
import { Notification } from 'element-ui';

import { getTokenCookie } from '@/utils/cookies';
import { notificationConfig } from '@/constants/app.constant';

export const baseUrl = axios.create({
  baseURL: `${process.env.baseAPI}/api`,
});

baseUrl.interceptors.request.use(
  (config) => {
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
    if (response.data.code === 2000) {
      Notification.success({
        ...notificationConfig,
        message: response.data.message,
      });
    } else if (response.data.code === 4000) {
      Notification.error({
        ...notificationConfig,
        message: response.data.message,
      });
    }
    return response.data;
  },
  (error) => {
    switch (error.response.status) {
       case 401:
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 403:
        window.location.href = '/403';
        break;
      case 404:
        window.location.href = '/404';
        break;
    }
    return Promise.reject(error);
  },
);
