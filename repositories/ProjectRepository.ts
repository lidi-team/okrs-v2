import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';

export default class ProjectRepository {
  public static get(params: ParamsUser) {
    return baseUrl.get(`${ResourcesEnpoint.Project}`, { params });
  }
}
