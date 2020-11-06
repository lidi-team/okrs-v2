import { ResourcesEnpoint, UserStatus } from '@/constants/app.enum';
import { EmployeeDTO } from '@/constants/app.interface';
import { ParamsUser } from '@/constants/DTO/common';
import { baseUrlV1, baseUrl } from './BaseRepository';

export default class EmployeeRepository {
  public static get(params: ParamsUser, currentTab: UserStatus) {
    const paramsResize: ParamsUser = Object.assign({}, params);
    paramsResize.page = paramsResize.page ? --paramsResize.page : 0;
    switch (currentTab) {
      case UserStatus.Staff:
        return baseUrl.get(`${ResourcesEnpoint.Users}/list-staff-paging`, { params: paramsResize });
      default:
        return baseUrl.get(`${ResourcesEnpoint.Users}/all-paging`, { params: paramsResize });
    }
  }

  public static update(payload: EmployeeDTO) {
    return baseUrl.put(`${ResourcesEnpoint.Users}/${payload.id}`, payload);
  }

  public static approveAll(payload: Array<number>) {
    return baseUrlV1.put(`${ResourcesEnpoint.Users}/approve_request`, payload);
  }

  public static delete(id: number) {
    return baseUrlV1.delete(`${ResourcesEnpoint.Users}/${id}`);
  }
}
