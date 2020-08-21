import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint, EvaluationCriteriaEnum } from '@/constants/app.enum';
import { FeedbackDTO, RecognitionDTO } from '@/constants/app.interface';

export class CfrsRepository {
  public static getListWaitingFeedback(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.ListWaiting}`);
  }

  /**
   * @param status -> Have 2 status: 'all' and 'current'
   */
  public static getRankingCfrs(cycleId?: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${CFREnpoint.Rank}`, { params: { cycleId } });
  }

  public static getHistoryCfrs(cycleId: number, userId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.History}`, { params: { cycleId, userId } });
  }

  public static getUserObjectives(userId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${CFREnpoint.Objective}/${userId}`);
  }

  public static postRecognition(payload: RecognitionDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Recognition}`, payload);
  }

  public static postFeedback(payload: FeedbackDTO, type: EvaluationCriteriaEnum): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Feedback}`, payload, { params: { type } });
  }
}
