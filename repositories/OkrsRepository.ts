import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

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

  /**
   * When the type = 1 --> All Root Okrs
   * When the type = 2 --> All leader Okrs
   * When the type = 3 --> All Okrs, except root okrs
   */

  public static getListOkrs(
    cycleId: number,
    type: number,
  ): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(
      `${ResourcesEnpoint.Objective}/list_okrs?cycleId=${cycleId}&type=${type}`,
    );
  }

  public static getOkrsDetail(okrsId: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Objective}/detail/${okrsId}`);
  }

  public static getOkrsDashboard(
    cycleId: number,
    userId: number,
  ): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Objective}/view_list`, {
      params: { cycleId, userId },
    });
  }

  public static deleteKr(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.KeyResults}/${id}`);
  }

  public static deleteOkrs(objectiveId: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.Objective}/${objectiveId}`);
  }
}
