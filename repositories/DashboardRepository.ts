import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class DashboardRepository {
  /**
   * @param: cycleId: cycle id in drpdown list
   * @param: type = 1: income  | type = 2: outcome
   */
  public static getTopIncome(cycleId: number, type: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Dashboard}/top_stars?`, { params: { cycleId, type } });
  }
}
