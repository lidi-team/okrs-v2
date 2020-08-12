import { ElMessageBoxOptions } from 'element-ui/types/message-box';

export const authEnpoint = {
  register: 'auth/register',
  login: 'auth/login',
  generateLink: 'auth/link_invite',
  logout: 'users/me/logout',
  resetPassword: 'reset_password',
};

export const pageLimit = 10;

export const notificationConfig = {
  title: 'Trạng thái',
  duration: 2000,
};

export const confirmWarningConfig: ElMessageBoxOptions = {
  type: 'warning',
  confirmButtonText: 'Đồng ý',
  cancelButtonText: 'Hủy',
};

export const environment = process.env.NODE_ENV;
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'development');
