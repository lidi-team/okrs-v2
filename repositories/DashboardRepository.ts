import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { baseUrlV1 } from './BaseRepository';

export default class DashboardRepository {
  /**
   * @param: cycleId: cycle id in dropdown list
   * @param: type = 1: income  | type = 2: outcome
   */
  public static getTopIncome(
    cycleId: number,
    type: number,
  ): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Dashboard}/top_stars?`, {
      params: { cycleId, type },
    });
  }

  public static getOKRsProgress(params: any): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Dashboard}/view_progress`, {
      params,
    });
  }

  public static getOKRsStatus(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Dashboard}/okr_status`);
  }

  public static getCheckinStatus(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Dashboard}/checkin_status`);
  }

  public static getCfrStatus(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Dashboard}/cfr_status`);
  }
}
