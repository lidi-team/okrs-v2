import { AxiosResponse } from 'axios';
import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO } from '@/constants/app.interface';
import { AdminParams } from '@/constants/DTO/common';

export enum enpoint {
  cycles = 'cycles',
}

export default class CycleRepository {
  public static get(params: AdminParams): Promise<any> {
    // return baseUrl.get(enpoint.cycles, { params });
    return new Promise(function (resolve, reject) {
      const dataExample = {
        id: 4,
        name: 'Fall 2020',
        startDate: '2020-10-01T00:00:00.000Z',
        endDate: '2020-12-31T00:00:00.000Z',
        createdAt: '2020-10-07T04:24:43.973Z',
        updatedAt: '2020-10-07T04:24:43.973Z',
      };
      resolve(dataExample);
    });
  }

  public static getMetadata(): Promise<AxiosResponse<any>> {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/cycles`);
  }

  public static getCurrentCycle(): Promise<any> {
    return new Promise(function (resolve, reject) {
      const dataExample = {
        id: 4,
        name: 'Fall 2020',
        startDate: '2020-10-01T00:00:00.000Z',
        endDate: '2020-12-31T00:00:00.000Z',
        createdAt: '2020-10-07T04:24:43.973Z',
        updatedAt: '2020-10-07T04:24:43.973Z',
      };
      resolve(dataExample);
    });
  }

  public static update(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.put(`${ResourcesEnpoint.CycleOKRs}/${payload.id}`, payload);
  }

  public static post(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return baseUrlV1.post(`${ResourcesEnpoint.CycleOKRs}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return baseUrlV1.delete(`${ResourcesEnpoint.CycleOKRs}/${id}`);
  }
}
