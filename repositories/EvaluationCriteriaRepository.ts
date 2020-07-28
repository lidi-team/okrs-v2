import { AxiosResponse } from 'axios';
import { unAuthenticatedservice, authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { EvaluationCriteriorDTTO } from '@/constants/app.interface';

export default class EvaluationCriteriorRepository {
  public static get() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.EvaluationCriterial}`);
  }

  public static update(payload: EvaluationCriteriorDTTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.EvaluationCriterial}/${payload.id}`, payload);
  }

  public static post(payload: EvaluationCriteriorDTTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.EvaluationCriterial}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.EvaluationCriterial}/${id}`);
  }
}
