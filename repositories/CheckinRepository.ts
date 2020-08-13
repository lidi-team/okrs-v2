import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class RoleRepository {
  public static get(params) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}`, { params });
  }

  public static getRequest(params) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/checkin_request`, { params });
  }
}
