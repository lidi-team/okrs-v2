import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';

export enum enpoint {
  keyResult = 'objective/key_result',
}

export default class ObjectiveRepository {
  public static getKeyResult(id: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.keyResult}/${id}`);
  }
}
