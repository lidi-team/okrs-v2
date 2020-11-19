import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';
import { baseUrl, baseUrlV1 } from './BaseRepository';

export default class MeasureUnitRepository {
  public static get(params?: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${ResourcesEnpoint.MeasureUnit}`, { params });
  }

  public static update(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return baseUrl.put(`${ResourcesEnpoint.MeasureUnit}/${payload.id}`, payload);
  }

  public static post(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${ResourcesEnpoint.MeasureUnit}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrl.delete(`${ResourcesEnpoint.MeasureUnit}/${id}`);
  }
}
