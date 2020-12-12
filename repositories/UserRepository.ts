import { formatDateToYYYY } from '@/utils/dateParser';
import { ChangePasswordDTO } from '@/constants/app.interface';
import { baseUrlV1, baseUrl } from './BaseRepository';

export enum enpoint {
  Users = 'user',
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
    return baseUrl.get(`${enpoint.Users}/all`);
  }

  public static changePassword(payload: Object) {
    return baseUrl.post(`user/change-password`, payload);
  }

  public static update(payload: any) {
    const tempProfile = {
      fullName: payload.fullName,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth
        ? formatDateToYYYY(payload.dateOfBirth)
        : null,
    };
    return baseUrlV1.put(`${enpoint.Users}/me`, tempProfile);
  }
}
