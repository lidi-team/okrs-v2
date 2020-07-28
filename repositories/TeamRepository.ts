import { AxiosResponse } from 'axios';
import { unAuthenticatedservice, authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { TeamDTO, AdminParams } from '@/constants/app.interface';

export default class TeamRepository {
  public static get(params: AdminParams) {
    const query = { params };
    return authenticatedService.get(`${ResourcesEnpoint.Team}`, query);
  }

  public static update(payload: TeamDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.Team}/${payload.id}`, payload);
  }

  public static post(payload: TeamDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Team}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.Team}/${id}`);
  }

  public static getMetaData() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.MetaData}/teams`);
  }
}
