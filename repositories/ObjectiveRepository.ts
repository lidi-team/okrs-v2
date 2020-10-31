import { AxiosResponse } from 'axios';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { baseUrlV1, baseUrl } from './BaseRepository';

export enum enpoint {
  objectivesParent = 'objective/parent-okr',
}

export default class ObjectiveRepository {
  public static getObjectivesParent(id: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.objectivesParent}/${id}`);
  }
}
