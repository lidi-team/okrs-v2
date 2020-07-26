import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class UserRepository {
  public static me() {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/me`);
  }

  public static changePassword(oldPassword: string, newPassword: string) {}
}
