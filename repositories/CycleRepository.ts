import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO } from '@/constants/app.interface';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { AdminParams } from '@/constants/DTO/common';

export enum enpoint {
  cycles = 'cycle',
  cycleCurrent = 'cycle/current',
}

export default class CycleRepository {
  public static getList(): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.cycles);
  }

  public static getMetadata(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/cycles`);
  }

  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.cycles}/all`, { params });
  }

  /**
   *
   * @param cycleId if equal 0 then return cycle with time current, else then return cycle with id inputmeta_data/cycles
   */
  public static getCycleCurrent(cycleId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.cycleCurrent}/${cycleId}`);
  }

  public static update(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrl.put(`${enpoint.cycles}/update/${payload.id}`, payload);
  }

  public static post(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.CycleOKRs}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.CycleOKRs}/${id}`);
  }
}
