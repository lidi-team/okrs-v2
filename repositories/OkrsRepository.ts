import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO, ParamsQuery } from '@/constants/app.interface';

export default class OkrRepository {
  public static getDetailOkrs(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${id}`);
  }

  public static getLeaderOkrs(params: ParamsQuery): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/leader_okrs`, { params });
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
