import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint, EvaluationCriteriaEnum } from '@/constants/app.enum';
import { HistoryCfrsParams, ParamsQuery, CfrsDTO } from '@/constants/app.interface';

export default class CfrsRepository {
  public static getListWaitingFeedback(params: ParamsQuery): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.ListWaiting}`, { params });
  }

  public static getRankingCfrs(cycleId?: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${CFREnpoint.Rank}`, { params: { cycleId } });
  }

  public static getHistoryCfrs(params: HistoryCfrsParams, type: 1 | 2 | 3): Promise<AxiosResponse<any>> {
    params = Object.assign(params, { type });
    return authenticatedService.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.History}`, { params });
  }

  public static getUserObjectives(userId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${CFREnpoint.Objective}/${userId}`);
  }

  public static postRecognition(payload: CfrsDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.CFRs}`, payload);
  }

  public static postFeedback(payload: CfrsDTO, type: EvaluationCriteriaEnum): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.CFRs}`, payload, { params: { type } });
  }
}
