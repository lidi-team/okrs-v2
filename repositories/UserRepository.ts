import RepositoryService from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/app.interface';

export default class UserRepository {
  public static get(params: ParamsUser) {
    const query = { params };
    return RepositoryService.get(`${ResourcesEnpoint.Users}`, query);
  }
}
