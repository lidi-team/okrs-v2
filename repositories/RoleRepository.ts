import { ResourcesEnpoint } from '@/constants/app.enum';
import { baseUrlV1 } from './BaseRepository';

export default class RoleRepository {
  public static get() {
    return baseUrlV1.get(`${ResourcesEnpoint.Role}`);
  }
}
