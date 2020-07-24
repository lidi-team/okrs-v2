import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/app.interface';

export default class EmployeeRepository {
  public static get(params: ParamsUser) {
    const query = { params };
    return authenticatedService.get(`${ResourcesEnpoint.Users}`, query);
  }
}
