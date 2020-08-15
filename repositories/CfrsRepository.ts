import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint, CFREnpoint } from '@/constants/app.enum';

export default class CfrsRepository {
  public static get(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Feedback}/${CFREnpoint.ListWaiting}`);
  }
}
