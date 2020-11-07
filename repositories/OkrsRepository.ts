import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { PayloadOkrs } from '@/constants/app.interface';

export const enpoint = {
  listOkrByCycleId: 'objective/project-list',
};
export default class OkrsRepository {
  public static getListOkrsByCycleId(cycleId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.listOkrByCycleId}?cycleId=${cycleId}`);
  }
  /**
   * When the type = 1 --> All Root Okrs
   * When the type = 2 --> All leader Okrs
   * When the type = 3 --> All Okrs, except root okrs
   */

  public static getListOkrs(cycleId: number, type: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Objective}/list_okrs?cycleId=${cycleId}&type=${type}`);
  }

  public static getOkrsDetail(okrsId: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Objective}/detail/${okrsId}`);
  }

  public static getOkrsDashboard(cycleId: number, userId: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Objective}/view_list`, { params: { cycleId, userId } });
  }

  public static createOrUpdateOkrs(payload: PayloadOkrs): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.Objective}`, payload);
  }

  public static deleteKr(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.KeyResults}/${id}`);
  }

  public static deleteOkrs(objectiveId: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.Objective}/${objectiveId}`);
  }
}
