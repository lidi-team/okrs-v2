import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class TeamRepository {
  public static get() {
    return authenticatedService.get(`${ResourcesEnpoint.Team}`);
  }
}
