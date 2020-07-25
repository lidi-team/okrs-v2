import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class JobRepository {
  public static get() {
    return authenticatedService.get(`${ResourcesEnpoint.Job}`);
  }
}
