import { unAuthenticatedservice } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class TeamRepository {
  public static get() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.Team}`);
  }
}
