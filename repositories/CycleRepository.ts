import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO } from '@/constants/app.interface';

export default class CycleRepository {
  public static getCycles(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.CycleOKRs}`);
  }

  public static postCycle(cycleOkrs: CycleDTO): Promise<AxiosResponse<void>> {
    return authenticatedService.post(`${ResourcesEnpoint.CycleOKRs}`, cycleOkrs);
  }
}
