import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';

export const enpoint = {
  getMeasureUnit: 'meta_data/measureUnit',
};

export default class MeasureUnitRepository {
  public static get(): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.getMeasureUnit);
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
