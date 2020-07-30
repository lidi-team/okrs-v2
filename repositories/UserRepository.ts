import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ChangePasswordDTO, ProfileDTO } from '@/constants/app.interface';

export default class UserRepository {
  public static me() {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/me`);
  }

  public static changePassword(payload: ChangePasswordDTO) {
    return authenticatedService.put(`${ResourcesEnpoint.Users}/me/change_password`, payload);
  }

  public static update(payload: ProfileDTO) {
    const tempProfile = {
      fullName: payload.fullName,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth,
    };
    return authenticatedService.put(`${ResourcesEnpoint.Users}/me`, tempProfile);
  }
}
