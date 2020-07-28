import { unAuthenticatedservice } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class JobRepository {
  public static get() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.Job}`);
  }

  public static getMetaData() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.MetaData}/job_positions`);
  }
}
