import { ResourcesEnpoint } from './app.enum';

export const authEnpoint = {
  register: `${ResourcesEnpoint.Auth}/register`,
  login: `${ResourcesEnpoint.Auth}/login`,
  generateLink: `${ResourcesEnpoint.Auth}/link_invite`,
  logout: `${ResourcesEnpoint.Users}/me/logout`,
  resetPassword: `${ResourcesEnpoint.ResetPassword}`,
};
