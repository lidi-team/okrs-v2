import { baseUrlV1 } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class RoleRepository {
  public static get() {
    return baseUrlV1.get(`${ResourcesEnpoint.Role}`);
  }
}
