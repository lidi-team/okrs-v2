import { formatDateToYYYY } from '@/utils/dateParser';
import { baseUrl } from './BaseRepository';

export enum enpoint {
  Users = 'user',
  me = 'user/me',
}

export default class UserRepository {
  public static me() {
    return baseUrl.get(enpoint.me);
  }

  public static getAllUsers() {
    return baseUrl.get(`${enpoint.Users}/all`);
  }

  public static changePassword(payload: Object) {
    return baseUrl.post(`user/change-password`, payload);
  }

  public static updateAvatar(url: string) {
    const payload = { avatarUrl: url };
    return baseUrl.put(`${enpoint.Users}/upload-avatar`, null, {
      params: payload,
    });
  }
}
