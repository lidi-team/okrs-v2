import { ParamsUser } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';
import { ProjectDTO } from '@/constants/app.interface';

const enpoint = {
  getList: 'projects',
  createUpdate: 'projects/create',
  getListCurrent: 'projects/available',
};

export default class ProjectRepository {
  public static get(params: ParamsUser) {
    return baseUrl.get(enpoint.getList, { params });
  }

  public static update(params: ProjectDTO) {
    return baseUrl.post(enpoint.createUpdate, { params });
  }

  public static getListCurrent() {
    return baseUrl.get(enpoint.getListCurrent);
  }
}
