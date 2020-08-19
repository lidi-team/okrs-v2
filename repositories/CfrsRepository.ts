import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint } from '@/constants/app.enum';

export class CfrsRepository {
  public static getListWaitingFeedback(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.ListWaiting}`);
  }

  public static getRecognitions(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/${CFREnpoint.Recognition}`);
  }

  /**
   * @param status -> Have 2 status: 'all' and 'current'
   */
  public static getRankingCfrs(status: String): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${CFREnpoint.Rank}?status=${status}`);
  }

  public static getHistoryCfrs(cycleId): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.History}/${cycleId}`);
  }

  public static getObjective(userId: Number | String): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${CFREnpoint.Objective}/${userId}`);
  }

  public static postRecognition(payload: any): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Recognition}`, payload);
  }

  public static postFeedback(payload: any): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Feedback}`, payload);
  }
}
