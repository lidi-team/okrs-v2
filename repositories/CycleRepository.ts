import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO } from '@/constants/app.interface';

export enum enpoint {
  cycles = 'meta_data/cycles',
  cycleCurrent = 'cycle/current',
}

export default class CycleRepository {
  public static getList(): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.cycles);
  }

  public static getMetadata(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/cycles`);
  }

  /**
   *
   * @param cycleId if equal 0 then return cycle with time current, else then return cycle with id inputmeta_data/cycles
   */
  public static getCycleCurrent(cycleId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.cycleCurrent}/${cycleId}`);
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
