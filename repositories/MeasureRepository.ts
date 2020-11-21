import { AxiosResponse } from 'axios';
import { MeasureUnitDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';

export enum enpoint {
  measureUnit = 'measures',
  listMeasure = 'meta_data/measureUnit',
}

export default class MeasureUnitRepository {
  public static getListMeasure(): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.listMeasure);
  }

  public static get(params?: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.measureUnit}`, { params });
  }

  public static update(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return baseUrl.put(`${enpoint.measureUnit}/${payload.id}`, payload);
  }

  public static post(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${enpoint.measureUnit}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrl.delete(`${enpoint.measureUnit}/${id}`);
  }
}
