import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser, EmployeeDTO } from '@/constants/app.interface';

export default class EmployeeRepository {
  public static get(params: ParamsUser) {
    const query = { params };
    return authenticatedService.get(`${ResourcesEnpoint.Users}`, query);
  }

  public static update(payload: EmployeeDTO) {
    return authenticatedService.put(`${ResourcesEnpoint.Users}/${payload.id}`, payload);
  }
}
