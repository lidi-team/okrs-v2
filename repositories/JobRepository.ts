import { AxiosResponse } from 'axios';
import { unAuthenticatedservice, authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { JobPositionDTO } from '@/constants/app.interface';

export default class JobRepository {
  public static get() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.Job}`);
  }

  public static update(payload: JobPositionDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.Job}/${payload.id}`, payload);
  }

  public static post(payload: JobPositionDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Job}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.Job}/${id}`);
  }
}
