import { Notification } from 'element-ui';
import { notificationConfig } from './app.constant';

export const notifyErrorLogin = (error: any) => {
  switch (error.response.data.statusCode) {
    case 430:
      Notification.error({
        ...notificationConfig,
        message: 'Email không tồn tại',
      });
      break;
    case 409:
      Notification.error({
        ...notificationConfig,
        message: 'Mât khẩu không chính xác',
      });
      break;
    case 420:
      Notification.error({
        ...notificationConfig,
        message: 'Tài khoản của bạn đã bị khóa',
      });
      break;
    case 422:
      Notification.error({
        ...notificationConfig,
        message: 'Tài khoản của bạn đang chờ phê duyệt',
      });
      break;
    default:
      Notification.error({
        ...notificationConfig,
        message: 'Có lỗi xảy ra',
      });
  }
};

export const notifyErrorRegister = (error: any) => {
  switch (error.response.data.statusCode) {
    case 432:
      Notification.error({
        ...notificationConfig,
        message: 'Email đã tồn tại',
      });
      break;
    case 413:
      Notification.error({
        ...notificationConfig,
        message: 'Token không chính xác',
      });
      break;
    case 414:
      Notification.error({
        ...notificationConfig,
        message: 'Token đã hết hạn',
      });
      break;
    default:
      Notification.error({
        ...notificationConfig,
        message: 'Có lỗi xảy ra',
      });
  }
};

export const notifyErrorResetPassword = (error: any) => {
  switch (error.response.data.statusCode) {
    case 413:
      Notification.error({
        ...notificationConfig,
        message: 'Token không chính xác',
      });
      break;
    case 414:
      Notification.error({
        ...notificationConfig,
        message: 'Token đã hết hạn',
      });
      break;
    default:
      Notification.error({
        ...notificationConfig,
        message: 'Có lỗi xảy ra',
      });
  }
};
