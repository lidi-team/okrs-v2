import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { JobPositionDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';

export default class JobRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${ResourcesEnpoint.Job}`, { params });
  }

  public static update(payload: JobPositionDTO): Promise<AxiosResponse<any>> {
    return baseUrl.put(`${ResourcesEnpoint.Job}/${payload.id}`, payload);
  }

  public static post(payload: JobPositionDTO): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${ResourcesEnpoint.Job}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrl.delete(`${ResourcesEnpoint.Job}/${id}`);
  }

  public static getMetaData() {
    return baseUrl.get(`${ResourcesEnpoint.MetaData}/positions`);
  }
}
