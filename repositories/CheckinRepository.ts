import { baseUrl } from './BaseRepository';

export enum enpoint {
  checkin = 'checkin',
  dashboard = 'checkin/dashboard',
  requestCheckin = 'checkin/checkin_request',
  inferiorCheckin = 'checkin/inferior',
  listObjectiveInferior = 'checkin/inferior-objective',
  detailCheckinByObjectiveId = 'checkin/objective',
  history = 'checkin/history',
  add = 'checkin/add',
}

export default class CheckinRepository {
  public static getMyCheckin(params: any) {
    return baseUrl.get(enpoint.checkin, { params });
  }

  public static getRequestCheckin(params: any) {
    return baseUrl.get(enpoint.requestCheckin, { params });
  }

  public static getDashboard(params: any) {
    return baseUrl.get(enpoint.dashboard, { params });
  }

  public static getHistory(id: Number) {
    return baseUrl.get(`${enpoint.history}/${id}`);
  }

  public static getInferiorCheckin(params: any) {
    return baseUrl.get(enpoint.inferiorCheckin, { params });
  }

  public static getListObjectiveInferior(params: any) {
    return baseUrl.get(enpoint.listObjectiveInferior, { params });
  }

  public static getDetailCheckinByCheckinId(id: Number) {
    return baseUrl.get(`${enpoint.checkin}/${id}`);
  }

  public static getDetailCheckinCFRsByCheckinId(id: Number) {
    return baseUrl.get(`${enpoint.checkin}/list-waiting-feedback/` + id);
  }

  public static getDetailCheckInByObjectiveId(id: Number) {
    return baseUrl.get(`${enpoint.detailCheckinByObjectiveId}/${id}`);
  }

  public static createCheckin(payload: any) {
    return baseUrl.post(enpoint.add, payload);
  }
}
