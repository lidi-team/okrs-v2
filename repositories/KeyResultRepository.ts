import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';

export enum enpoint {
  keyResultOfParent = 'objective/parent-key_result',
}

export default class ObjectiveRepository {
  public static getKeyResultOfParent(id: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.keyResultOfParent}/${id}`);
  }
}
