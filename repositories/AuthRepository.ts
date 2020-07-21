import { AxiosResponse } from 'axios';
import RepositoryService from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { AuthResponse, RegisterDTO, LoginDTO, ResetPasswordActionDTO } from '@/constants/app.interface';

export default class AuthRepository {
  public static register(credentials: RegisterDTO): Promise<AxiosResponse<AuthResponse>> {
    return RepositoryService.post<AuthResponse>(`${ResourcesEnpoint.Auth}/register`, credentials);
  }

  public static login(credentials: LoginDTO): Promise<AxiosResponse<AuthResponse>> {
    return RepositoryService.post<AuthResponse>(`${ResourcesEnpoint.Auth}/login`, credentials);
  }

  public static sendMailToResetPassword(email: string): Promise<AxiosResponse<void>> {
    return RepositoryService.post<void>(`${ResourcesEnpoint.ResetPassword}`, email);
  }

  public static resetPasswordWithToken(data: ResetPasswordActionDTO) {
    return RepositoryService.put(`${ResourcesEnpoint.ResetPassword}`, data);
  }

  public static verifyLinkInvite(token: string) {
    return RepositoryService.get(`${ResourcesEnpoint.Auth}/verification/${token}`);
  }

  public static generateLinkInivte() {
    return RepositoryService.get(`${ResourcesEnpoint.Auth}/link-invite`);
  }
}
