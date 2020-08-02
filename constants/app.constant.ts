import { ResourcesEnpoint } from './app.enum';

export const authEnpoint = {
  register: `${ResourcesEnpoint.Auth}/register`,
  login: `${ResourcesEnpoint.Auth}/login`,
  generateLink: `${ResourcesEnpoint.Auth}/link_invite`,
  logout: `${ResourcesEnpoint.Users}/me/logout`,
  resetPassword: `${ResourcesEnpoint.ResetPassword}`,
};

export const pageLimit = 10;

export const notificationConfig = {
  title: 'Trạng thái',
  duration: 2000,
};

export const environment = process.env.NODE_ENV;
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'development');
