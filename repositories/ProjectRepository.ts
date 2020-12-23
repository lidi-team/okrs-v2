import { ParamsUser } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';
import { IProjectStaffState, ProjectDTO } from '@/constants/app.interface';
import { ResourcesEnpoint } from '@/constants/app.enum';

const enpoint = {
  getList: 'projects',
  createUpdate: 'projects/create',
  getListCurrent: 'projects/available',
};

export default class ProjectRepository {
  public static get(params: ParamsUser) {
    return baseUrl.get(enpoint.getList, { params });
  }

  public static getById(id: number) {
    return baseUrl.get(`${ResourcesEnpoint.Project}/` + id);
  }

  public static getStaffsById(id: number) {
    return baseUrl.get(`${ResourcesEnpoint.Project}/` + id + '/staff');
  }

  public static postStaffsById(id: number, payload: number[]) {
    return baseUrl.post(
      `${ResourcesEnpoint.Project}/` + id + '/staff',
      payload,
    );
  }

  public static putStaffsById(id: number, payload: IProjectStaffState[]) {
    return baseUrl.put(`${ResourcesEnpoint.Project}/` + id + '/staff', payload);
  }

  public static deleteStaffById(projectId: number, staffId: number) {
    return baseUrl.delete(
      `${ResourcesEnpoint.Project}/` + projectId + '/staff/' + staffId,
    );
  }

  public static getActiveCandidates(id: number) {
    return baseUrl.get(`${ResourcesEnpoint.Project}/` + id + '/candidate');
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

  public static getListCurrent() {
    return baseUrl.get(enpoint.getListCurrent);
  }

  public static changeState(id: number) {
    return baseUrl.delete(`${enpoint.getList}/` + id);
  }
}
