import { AxiosResponse } from 'axios';
import { baseUrlV1 } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO, AdminParams } from '@/constants/app.interface';

export default class CycleRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.CycleOKRs}`, { params });
  }

  public static getMetadata(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/cycles`);
  }

  public static getCurrentCycle(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.CycleOKRs}/current`);
  }

  public static update(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.put(`${ResourcesEnpoint.CycleOKRs}/${payload.id}`, payload);
  }

  public static post(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.CycleOKRs}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.CycleOKRs}/${id}`);
  }
}
