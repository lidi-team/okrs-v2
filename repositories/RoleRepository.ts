import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class RoleRepository {
  public static get() {
    return authenticatedService.get(`${ResourcesEnpoint.Role}`);
  }
}
