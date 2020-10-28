import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export enum enpoint {
  objectivesParent = 'objective/parent-okr',
}

export default class ObjectiveRepository {
  public static getObjectivesParent(id: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.objectivesParent}/${id}`);
  }
}
