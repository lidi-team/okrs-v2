import { AxiosResponse } from 'axios';
import {
  ResourcesEnpoint,
  CFREnpoint,
  EvaluationCriteriaEnum,
} from '@/constants/app.enum';
import { CfrsDTO } from '@/constants/app.interface';
import { HistoryCfrsParams, ParamsQuery } from '@/constants/DTO/common';
import { baseUrl, baseUrlV1 } from './BaseRepository';

export default class CfrsRepository {
  public static getListWaitingFeedback(
    params: ParamsQuery,
  ): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.ListWaiting}`, {
      params,
    });
  }

  public static getRankingCfrs(cycleId?: number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.Rank}`, {
      params: { cycleId },
    });
  }

  public static getHistoryCfrs(
    params: HistoryCfrsParams,
    type: 1 | 2 | 3,
  ): Promise<AxiosResponse<any>> {
    params = Object.assign(params, { type });
    return baseUrl.get(`${ResourcesEnpoint.CFRs}/${CFREnpoint.History}`, {
      params,
    });
  }

  public static getUserObjectives(userId: number): Promise<AxiosResponse<any>> {
    return baseUrl.get(
      `${ResourcesEnpoint.Objective}/${CFREnpoint.Objective}`,
      { params: { userId } },
    );
  }

  public static postRecognition(payload: CfrsDTO): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${ResourcesEnpoint.CFRs}`, payload);
  }

  public static postFeedback(
    payload: CfrsDTO,
    type: EvaluationCriteriaEnum,
  ): Promise<AxiosResponse<any>> {
    return baseUrl.post(`${ResourcesEnpoint.CFRs}`, payload, {
      params: { type },
    });
  }
}
