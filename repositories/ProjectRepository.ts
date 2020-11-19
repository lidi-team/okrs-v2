import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';
import { ProjectDTO } from '@/constants/app.interface';

export default class ProjectRepository {
  public static get(params: ParamsUser) {
    return baseUrl.get(`${ResourcesEnpoint.Project}`, { params });
  }

  public static update(params: ProjectDTO) {
    return baseUrl.post(`${ResourcesEnpoint.Project}/create`, { params });
  }
}
