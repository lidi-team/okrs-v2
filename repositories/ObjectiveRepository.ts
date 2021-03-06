import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';

export enum enpoint {
  objectivesParent = 'objective/parent-okr',
  createObjective = 'objective/add',
  alignObjective = 'objective/align-objective',
  objectivesProject = 'objective/align-objective-project',
  deleteObjective = 'objective/delete',
  listChildObject = 'objective/child-objectives',
}

export default class ObjectiveRepository {
  public static getObjectivesParent(id: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.objectivesParent}/${id}`);
  }

  public static createObjective(data: any) {
    return baseUrl.post(enpoint.createObjective, data);
  }

  public static getAlignObjective(
    cycleId: Number,
    projectId: Number,
  ): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.alignObjective, {
      params: { cycleId, projectId },
    });
  }

  public static getObjectivesProject(
    cycleId: Number,
    projectId: Number,
  ): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.objectivesProject, {
      params: { cycleId, projectId },
    });
  }

  public static getListChildObjective(
    cycleId: Number,
    objectiveId: Number,
  ): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.listChildObject, {
      params: { cycleId, objectiveId },
    });
  }

  public static deleteObjective(id: Number): Promise<AxiosResponse<any>> {
    return baseUrl.delete(`${enpoint.deleteObjective}/${id}`);
  }
}
