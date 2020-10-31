import { ResourcesEnpoint } from '@/constants/app.enum';
import { EmployeeDTO } from '@/constants/app.interface';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrlV1 } from './BaseRepository';

export default class EmployeeRepository {
  public static get(params: ParamsUser) {
    return baseUrlV1.get(`${ResourcesEnpoint.Users}`, { params });
  }

  public static update(payload: EmployeeDTO) {
    return baseUrlV1.put(`${ResourcesEnpoint.Users}/${payload.id}`, payload);
  }

  public static approveAll(payload: Array<number>) {
    return baseUrlV1.put(`${ResourcesEnpoint.Users}/approve_request`, payload);
  }

  public static delete(id: number) {
    return baseUrlV1.delete(`${ResourcesEnpoint.Users}/${id}`);
  }
}
