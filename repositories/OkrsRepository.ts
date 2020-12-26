import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';

export const enpoint = {
  listOkrByCycleId: 'objective/project-list',
  createOrUpdateOkrs: 'objective/add',
  getDetailOkrsById: 'objective/detail',
  getObjectiveCompany: 'objective/company'
};
export default class OkrsRepository {
  public static getListOkrsByCycleId(
    cycleId: string,
  ): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.listOkrByCycleId}?cycleId=${cycleId}`);
  }

  public static createOrUpdateOkrs(data): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${enpoint.createOrUpdateOkrs}`, data);
  }

  public static getDetailOkrsById(okrsId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.getDetailOkrsById}/${okrsId}`);
  }

  public static getObjectiveCompany(params: any): Promise<AxiosResponse<any>> {
    return baseUrl.get(enpoint.getObjectiveCompany, { params });
  }
}
