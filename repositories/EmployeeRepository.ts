import { ResourcesEnpoint, UserStatus } from '@/constants/app.enum';
import { EmployeeDTO } from '@/constants/app.interface';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrlV1, baseUrl } from './BaseRepository';

export default class EmployeeRepository {
  public static get(params: any, currentTab: UserStatus) {
    params.page = params.page - 1;
    switch (currentTab) {
      case UserStatus.Staff:
        return baseUrl.get(`${ResourcesEnpoint.Users}/list-staff-paging`, { params });
      default:
        return baseUrl.get(`${ResourcesEnpoint.Users}/all-paging`, { params });
    }
  }

  public static update(payload: EmployeeDTO) {
    // return baseUrl.put(`${ResourcesEnpoint.Users}/${payload.id}`, payload);
    return baseUrl.put(`${ResourcesEnpoint.Users}/update-infor`, payload);
  }

  public static approveAll(payload: Array<number>) {
    return baseUrlV1.put(`${ResourcesEnpoint.Users}/approve_request`, payload);
  }

  public static delete(id: number) {
    return baseUrlV1.delete(`${ResourcesEnpoint.Users}/${id}`);
  }
}
