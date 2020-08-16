import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class CheckinRepository {
  public static get(params) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}`, { params });
  }

  public static getRequest(params) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/checkin_request`, { params });
  }

  public static getHistory(id) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/history/${id}`);
  }

  public static getHistoryDetail(id) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/${id}`);
  }

  public static getCheckinDetail(checkinId: Number): any {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/waiting_feedback_detail/${checkinId}`);
  }
}
