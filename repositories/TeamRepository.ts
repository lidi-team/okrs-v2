import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { TeamDTO, AdminParams } from '@/constants/app.interface';

export default class TeamRepository {
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
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/teams`);
  }
}
