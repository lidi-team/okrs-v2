import { baseUrlV1, baseUrl } from './BaseRepository';
import { ChangePasswordDTO } from '@/constants/app.interface';
import { formatDateToYYYY } from '@/utils/dateParser';

export enum enpoint {
  Users = 'users',
  me = 'user/me',
}

export default class UserRepository {
  public static me() {
    return baseUrl.get(enpoint.me);
  }

  public static getAdminId() {
    return baseUrlV1.get(`${enpoint.Users}/admin`);
  }

  public static getAllUsers() {
    return baseUrlV1.get(`${enpoint.Users}/all`);
  }

  public static changePassword(payload: ChangePasswordDTO) {
    return baseUrlV1.put(`${enpoint.Users}/me/change_password`, payload);
  }

  public static update(payload: any) {
    const tempProfile = {
      fullName: payload.fullName,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth ? formatDateToYYYY(payload.dateOfBirth) : null,
    };
    return baseUrlV1.put(`${enpoint.Users}/me`, tempProfile);
  }
}
