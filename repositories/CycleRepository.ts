import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO } from '@/constants/app.interface';

export default class CycleRepository {
  public static getCycles(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.CycleOKRs}`);
  }

  public static getCurrentCycle(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.CycleOKRs}?status=current`);
  }

  public static updateCycle(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.CycleOKRs}/${payload.id}`, payload);
  }

  public static postCycle(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.CycleOKRs}`, payload);
  }

  public static deleteCycle(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.CycleOKRs}/${id}`);
  }
}
