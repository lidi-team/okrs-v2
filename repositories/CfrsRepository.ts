import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint } from '@/constants/app.enum';

export class CfrsRepository {
  public static get(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.ListWaiting}`);
  }

  public static getRecognitions(): any {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/${CFREnpoint.Recognition}`);
  }

  public static getRankingCfrs(status: String): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${CFREnpoint.Rank}?status=${status}`);
  }

  public static getHistoryCfrs(cycleId): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.History}/${cycleId}`);
  }

  public static posRecognition(payload: any): any {
    return authenticatedService.post(`${ResourcesEnpoint.Recognition}`, payload);
  }

  public static getObjective(userId: Number | String) {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/${CFREnpoint.Objective}/${userId}`);
  }

  public static post(payload: any): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Feedback}`, payload);
  }
}
