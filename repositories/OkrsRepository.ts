import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO, ParamsQuery } from '@/constants/app.interface';

export default class OkrRepository {
  public static getDetailOkrs(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${id}`);
  }

  public static getLeaderOkrs(cycleId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/team_leaders?cycleID=${cycleId}`);
  }

  public static getCurrentLeaderOkrs(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/current_team_leaders`);
  }

  public static getOkrsDashboard(cycleId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/view_list?cycleID=${cycleId}`);
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
