import { AxiosResponse } from 'axios';
import { baseUrlV1 } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO, AdminParams } from '@/constants/app.interface';

export default class MeasureUnitRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.MeasureUnit}`, { params });
  }

  public static update(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.put(`${ResourcesEnpoint.MeasureUnit}/${payload.id}`, payload);
  }

  public static post(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.MeasureUnit}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.MeasureUnit}/${id}`);
  }
}
