import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { JobPositionDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';

export default class JobRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Job}`, { params });
  }

  public static update(payload: JobPositionDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.put(`${ResourcesEnpoint.Job}/${payload.id}`, payload);
  }

  public static post(payload: JobPositionDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.Job}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.Job}/${id}`);
  }

  public static getMetaData() {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/job_positions`);
  }
}
