import { AxiosResponse } from 'axios';
import { baseUrlV1 } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint, EvaluationCriteriaEnum } from '@/constants/app.enum';
import { CfrsDTO } from '@/constants/app.interface';
import { HistoryCfrsParams, ParamsQuery } from '@/constants/DTO/common';

export default class CfrsRepository {
  public static getListWaitingFeedback(params: ParamsQuery): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.ListWaiting}`, { params });
  }

  public static getRankingCfrs(cycleId?: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${CFREnpoint.Rank}`, { params: { cycleId } });
  }

  public static getHistoryCfrs(params: HistoryCfrsParams, type: 1 | 2 | 3): Promise<AxiosResponse<any>> {
    params = Object.assign(params, { type });
    return baseUrlV1.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.History}`, { params });
  }

  public static getUserObjectives(userId: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.Objective}/${CFREnpoint.Objective}/${userId}`);
  }

  public static postRecognition(payload: CfrsDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.CFRs}`, payload);
  }

  public static postFeedback(payload: CfrsDTO, type: EvaluationCriteriaEnum): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.CFRs}`, payload, { params: { type } });
  }
}
