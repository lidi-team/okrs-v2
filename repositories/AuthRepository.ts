import { AxiosResponse } from 'axios';
import {
  RegisterDTO,
  MailResetPassDTO,
  LoginDTO,
  ResetPasswordActionDTO,
} from '@/constants/DTO/auth';
import { baseUrl } from './BaseRepository';

export const enpoint = {
  register: 'auth/register',
  login: 'auth/signin',
  generateLink: 'auth/link_invite',
  logout: 'users/me/logout',
  resetPassword: 'auth/reset-password',
};

export default class AuthRepository {
  public static register(credentials: RegisterDTO) {
    return baseUrl.post(enpoint.register, credentials);
  }

  public static login(credentials: LoginDTO) {
    return baseUrl.post(enpoint.login, credentials);
  }

  public static sendMailToResetPassword(
    payload: MailResetPassDTO,
  ): Promise<AxiosResponse<void>> {
    return baseUrl.post<void>(enpoint.resetPassword, payload);
  }
}
