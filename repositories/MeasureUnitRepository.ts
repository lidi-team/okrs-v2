import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO, AdminParams } from '@/constants/app.interface';

export default class MeasureUnitRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    const query = { params };
    return authenticatedService.get(`${ResourcesEnpoint.MeasureUnit}`, query);
  }

  public static update(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.MeasureUnit}/${payload.id}`, payload);
  }

  public static post(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.MeasureUnit}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.MeasureUnit}/${id}`);
  }
}
