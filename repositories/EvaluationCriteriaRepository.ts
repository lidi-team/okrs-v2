import { AxiosResponse } from 'axios';
import { ResourcesEnpoint, EvaluationCriteriaEnum } from '@/constants/app.enum';
import { EvaluationCriteriorDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';
import { baseUrlV1, baseUrl } from './BaseRepository';

export default class EvaluationCriteriorRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${ResourcesEnpoint.EvaluationCriterial}`, { params });
  }

  public static update(payload: EvaluationCriteriorDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.put(`${ResourcesEnpoint.EvaluationCriterial}/${payload.id}`, payload);
  }

  public static post(payload: EvaluationCriteriorDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.EvaluationCriterial}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.EvaluationCriterial}/${id}`);
  }

  public static getCombobox(type: EvaluationCriteriaEnum): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/${EvaluationCriteriaEnum.EvaluationCriteria}`, { params: { type } });
  }
}
