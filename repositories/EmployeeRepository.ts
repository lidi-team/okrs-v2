import { ResourcesEnpoint, UserStatus } from '@/constants/app.enum';
import { EmployeeDTO } from '@/constants/app.interface';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrl } from './BaseRepository';

export default class EmployeeRepository {
  public static get(params: ParamsUser, currentTab: UserStatus) {
    switch (currentTab) {
      case UserStatus.Staff:
        return baseUrl.get(`${ResourcesEnpoint.Users}/list-staff-paging`, {
          params,
        });
      default:
        return baseUrl.get(`${ResourcesEnpoint.Users}/all-paging`, {
          params,
        });
    }
  }

  public static update(payload: EmployeeDTO) {
    return baseUrl.put(`${ResourcesEnpoint.Users}/${payload.id}`, payload);
  }

  public static create(payload: any) {
    return baseUrl.put(`${ResourcesEnpoint.Users}/add-staff`, payload);
  }
}
