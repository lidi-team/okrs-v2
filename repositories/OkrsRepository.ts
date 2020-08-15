import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class OkrsRepository {
  /**
   * // When the type = 1(Current Cycle) --> Need to passs user ID
   * // When the type = 2(All Cycle) --> Need to pass the cycle id
   * @param id { userId, cycleId }
   * @param type {1, 2}
   */
  public static getLeaderOkrs(userId: number, type: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/team_leaders?userId=${userId}&type=${type}`);
  }

  public static getStaffOkrs(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/staffs`);
  }

  public static getOkrsDetail(okrsId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/detail/${okrsId}`);
  }

  public static getOkrsDashboard(cycleId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/view_list?cycleId=${cycleId}`);
  }

  public static createOrUpdateOkrs(payload: any): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Objective}`, payload);
  }

  public static deleteKr(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.KeyResults}/${id}`);
  }

  public static deleteOkrs(objectiveId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.Objective}/${objectiveId}`);
  }
}
