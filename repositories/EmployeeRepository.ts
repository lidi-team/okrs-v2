import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ParamsUser, EmployeeDTO } from '@/constants/app.interface';

export default class EmployeeRepository {
  public static get(params: ParamsUser) {
    return authenticatedService.get(`${ResourcesEnpoint.Users}`, { params });
  }

  public static update(payload: EmployeeDTO) {
    return authenticatedService.put(`${ResourcesEnpoint.Users}/${payload.id}`, payload);
  }

  public static approveAll(payload: Array<number>) {
    return authenticatedService.put(`${ResourcesEnpoint.Users}/approve_request`, payload);
  }

  public static delete(id: number) {
    return authenticatedService.delete(`${ResourcesEnpoint.Users}/${id}`);
  }
}
