import { ResourcesEnpoint } from './app.enum';

export const authEnpoint = {
  register: `${ResourcesEnpoint.Auth}/register`,
  login: `${ResourcesEnpoint.Auth}/login`,
  logout: `${ResourcesEnpoint.Users}/logout`,
  resetPassword: `${ResourcesEnpoint.ResetPassword}`,
};
