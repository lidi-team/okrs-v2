import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';

export enum enpoint {
  projectByUser = 'project/available',
}

export default class ProjectRepository {
  public static getProjectByUser(type: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.projectByUser}/${type}`);
  }
}
