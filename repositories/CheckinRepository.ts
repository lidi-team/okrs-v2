import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class RoleRepository {
  public static get(params) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}`, { params });
  }

  public static getDetail(id) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/objective/${id}`);
  }

  public static getRequest(params) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/checkin_request`, { params });
  }

  public static post(payload) {
    return authenticatedService.post(`${ResourcesEnpoint.Checkin}`, payload);
  }

  public static staffUpdateCheckin(payload, id) {
    return authenticatedService.put(`${ResourcesEnpoint.Checkin}/${id}`, payload);
  }

  public static getHistory(id) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/history/${id}`);
  }

  public static getHistoryDetail(id) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/${id}`);
  }
}
