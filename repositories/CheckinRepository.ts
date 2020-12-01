import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { baseUrlV1, baseUrl } from './BaseRepository';

export enum enpoint {
  myCheckin = 'checkin',
  requestCheckin = 'checkin/checkin_request',
  inferiorCheckin = 'checkin/inferior',
  listObjectiveInferior = 'checkin/inferior-objective',
  history = 'checkin/history',
}

export default class CheckinRepository {
  public static getMyCheckin(params: any) {
    return baseUrl.get(enpoint.myCheckin, { params });
  }

  public static getRequestCheckin(params: any) {
    return baseUrl.get(enpoint.requestCheckin, { params });
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

  public static get(params: any) {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}`, { params });
  }

  public static getDetail(id: number) {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/objective/${id}`);
  }

  public static getRequest(params: any) {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/checkin_request`, { params });
  }

  public static getListInferior(params: any) {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/inferior`, { params });
  }

  public static getListOKRs(params: any) {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/inferior_objective`, { params });
  }

  public static getOKRsCompany(params: any) {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/admin`, { params });
  }

  public static post(payload: any) {
    return baseUrlV1.post(`${ResourcesEnpoint.Checkin}`, payload);
  }

  public static adminCreateCheckin(payload: any) {
    return baseUrlV1.post(`${ResourcesEnpoint.Checkin}/admin`, payload);
  }

  public static adminUpdateCheckin(payload: any, id: number) {
    return baseUrlV1.put(`${ResourcesEnpoint.Checkin}/admin/${id}`, payload);
  }

  public static staffUpdateCheckin(payload: any, id: number) {
    return baseUrlV1.put(`${ResourcesEnpoint.Checkin}/${id}`, payload);
  }

  public static leaderUpdateCheckin(payload: any, id: number) {
    return baseUrlV1.put(`${ResourcesEnpoint.Checkin}/checkin_request/${id}`, payload);
  }

  public static getDetailCheckin(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/${id}`);
  }

  public static getCheckinDetail(checkinId: number): any {
    return baseUrlV1.get(`${ResourcesEnpoint.Checkin}/waiting_feedback_detail/${checkinId}`);
  }
}
