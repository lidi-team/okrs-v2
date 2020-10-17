import { AxiosResponse } from 'axios';
import { baseUrl } from './BaseRepository';

export const enpoint = {
  objectives: 'objective/child-objectives',
};

export default class DrillDown {
  public static get(cycleId: Number, objectiveId: Number): Promise<AxiosResponse<any>> {
    return baseUrl.get(`${enpoint.objectives}?cycleId=${cycleId}&objectiveId=${objectiveId}`);
  }
}
