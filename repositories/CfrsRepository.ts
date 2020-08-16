import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint } from '@/constants/app.enum';

export class CfrsRepository {
  public static get(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.ListWaiting}`);
  }

  public static getRecognition(): any {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/${CFREnpoint.Recognition}`);
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

export class HistoryRepository {
  public static get(cycleId): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.History}/${cycleId}`);
  }
}

export class RankRepository {
  public static get(status: String): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${CFREnpoint.Rank}?status=${status}`);
  }
}
