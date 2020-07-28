import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ChangePasswordDTO } from '@/constants/app.interface';

export default class UserRepository {
  public static me() {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/me`);
  }

  public static changePassword(payload: ChangePasswordDTO) {
    return authenticatedService.put(`${ResourcesEnpoint.Users}/me/change_password`, payload);
  }
}
