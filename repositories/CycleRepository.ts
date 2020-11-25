import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO } from '@/constants/app.interface';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { AdminParams } from '@/constants/DTO/common';

export enum enpoint {
  cycles = 'cycle',
  cycleCurrent = 'cycle/current',
  cyclesMetadata = 'meta_data/cycles',
}

export default class CycleRepository {
  public static getList(): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.cycles);
  }

  public static getListMetadata(): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.cyclesMetadata);
  }

  public static getCycleDetailById(cycleId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.cycles}/${cycleId}`);
  }

  public static getCycleCurrent(cycleId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.cycleCurrent}/${cycleId}`);
  }

  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${ResourcesEnpoint.CycleOKRs}`, { params });
  }

  public static update(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrl.put(`${ResourcesEnpoint.CycleOKRs}/${payload.id}`, payload);
  }

  public static post(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${ResourcesEnpoint.CycleOKRs}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrl.delete(`${ResourcesEnpoint.CycleOKRs}/${id}`);
  }
}
