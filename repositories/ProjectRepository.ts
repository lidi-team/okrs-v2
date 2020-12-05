import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';
import { ProjectDTO } from '@/constants/app.interface';

export default class ProjectRepository {
  public static get(params: ParamsUser) {
    return baseUrl.get(`${ResourcesEnpoint.Project}`, { params });
  }

  public static getById(id: number) {
    return baseUrl.get(`${ResourcesEnpoint.Project}/` + id);
  }

  public static getStaffsById(id: number) {
    return baseUrl.get(`${ResourcesEnpoint.Project}/` + id + '/staff');
  }

  public static deleteStaffById(projectId: number, staffId: number) {
    return baseUrl.delete(`${ResourcesEnpoint.Project}/` + projectId + '/staff/' + staffId);
  }

  public static getAllActiveStaff() {
    return baseUrl.delete(`${ResourcesEnpoint.Users}/` + 'all');
  }

  public static update(payload: ProjectDTO) {
    return baseUrl.post(`${ResourcesEnpoint.Project}/create`, payload);
  }

  public static getManagers(params: any) {
    return baseUrl.get(`${ResourcesEnpoint.Project}/pm`, { params });
  }

  public static getOriginalProjects() {
    return baseUrl.get(`${ResourcesEnpoint.Project}/parents`);
  }
}
