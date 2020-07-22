import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { PromiseUserInfo } from '@/constants/app.interface';

export default class UserRepository {
  public static me(): Promise<AxiosResponse<PromiseUserInfo>> {
    return authenticatedService.get<PromiseUserInfo>(`${ResourcesEnpoint.Users}/me`);
  }

  public static changePassword(oldPassword: string, newPassword: string) {}
}
