import { AxiosResponse } from 'axios';
import { unAuthenticatedservice } from './BaseRepository';
import { AuthResponse, RegisterDTO, LoginDTO, ResetPasswordActionDTO } from '@/constants/app.interface';
import { authEnpoint } from '@/constants/app.constant';

export default class AuthRepository {
  public static register(credentials: RegisterDTO): Promise<AxiosResponse<AuthResponse>> {
    return unAuthenticatedservice.post<AuthResponse>(authEnpoint.register, credentials);
  }

  public static login(credentials: LoginDTO): Promise<AxiosResponse<AuthResponse>> {
    return unAuthenticatedservice.post<AuthResponse>(authEnpoint.login, credentials);
  }

  public static logout(): Promise<AxiosResponse<void>> {
    return unAuthenticatedservice.post(authEnpoint.logout);
  }

  public static sendMailToResetPassword(email: string): Promise<AxiosResponse<void>> {
    return unAuthenticatedservice.post<void>(authEnpoint.resetPassword, email);
  }

  public static resetPasswordWithToken(data: ResetPasswordActionDTO) {
    return unAuthenticatedservice.put(authEnpoint.resetPassword, data);
  }

  public static verifyLinkInvite(token: string) {
    return unAuthenticatedservice.get(`/verification/${token}`);
  }

  public static generateLinkInivte() {
    return unAuthenticatedservice.get(`/link-invite`);
  }
}
