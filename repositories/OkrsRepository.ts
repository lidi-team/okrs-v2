import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO } from '@/constants/app.interface';

export default class OkrRepository {
  public static getDetailOkrs(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${id}`);
  }

  /**
   * // When the type = 1(Current Cycle) --> Need to passs user ID
   * // When the type = 2(All Cycle) --> Need to pass the cycle id
   * @param id { userId, cycleId }
   * @param type {1, 2}
   */
  public static getLeaderOkrs(id: number, type: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/team_leaders?id=${id}&type=${type}`);
  }

  public static getOkrsDashboard(cycleId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/view_list?cycleId=${cycleId}`);
  }

  public static createOrUpdateOkrs(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.Objective}/${payload.id}`, payload);
  }

  public static deleteKr(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.Objective}/${id}`);
  }

  public static deleteOkrs(objectiveId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.Objective}/${objectiveId}`);
  }
}
