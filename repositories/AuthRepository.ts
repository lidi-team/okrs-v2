import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { RegisterDTO, MailResetPassDTO, LoginDTO, ResetPasswordActionDTO } from '@/constants/DTO/auth';

export const enpoint = {
  register: 'auth/register',
  login: 'auth/signin',
  generateLink: 'auth/link_invite',
  logout: 'users/me/logout',
  resetPassword: 'reset_password',
};

export default class AuthRepository {
  public static register(credentials: RegisterDTO) {
    return baseUrl.post(enpoint.register, credentials);
  }

  public static login(credentials: LoginDTO) {
    return baseUrl.post(enpoint.login, credentials);
  }

  public static logout(): Promise<AxiosResponse<void>> {
    return baseUrlV1.post(enpoint.logout);
  }

  public static sendMailToResetPassword(payload: MailResetPassDTO): Promise<AxiosResponse<void>> {
    return baseUrlV1.post<void>(enpoint.resetPassword, payload);
  }

  public static resetPasswordWithToken(data: ResetPasswordActionDTO) {
    return baseUrlV1.put(enpoint.resetPassword, data);
  }

  public static verifyLinkInvite(token: string) {
    return baseUrlV1.get(`auth/verification/${token}`);
  }

  public static verifyResetPassword(token: string) {
    return baseUrlV1.get(`${enpoint.resetPassword}/${token}`);
  }

  public static generateLinkInivte() {
    return baseUrlV1.get(enpoint.generateLink);
  }
}
