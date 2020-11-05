import { AxiosResponse } from 'axios';
import { AdminParams } from '@/constants/DTO/common';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { TeamDTO } from '@/constants/app.interface';
import { baseUrlV1, baseUrl } from './BaseRepository';

export default class DepartmentRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Team}`, { params });
  }

  public static update(payload: TeamDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.put(`${ResourcesEnpoint.Team}/${payload.id}`, payload);
  }

  public static post(payload: TeamDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.Team}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.Team}/${id}`);
  }

  public static getMetaData() {
    return baseUrl.get(`${ResourcesEnpoint.MetaData}/departments`);
  }
}
