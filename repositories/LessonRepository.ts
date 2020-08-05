import { authenticatedService, unAuthenticatedservice } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { LessonDTO } from '@/constants/app.interface';
export default class LessonRepository {
  public static get(params: any) {
    const query = { params };
    return authenticatedService.get(`${ResourcesEnpoint.Lessons}`, query);
  }

  public static getPost(slug: string) {
    return authenticatedService.get(`${ResourcesEnpoint.Lessons}/${slug}`);
  }

  public static create(payload: LessonDTO) {
    return authenticatedService.post(`${ResourcesEnpoint.Lessons}`, payload);
  }

  public static update(payload: LessonDTO, id: number) {
    return authenticatedService.put(`${ResourcesEnpoint.Lessons}/${id}`, payload);
  }

  public static delete(id: number) {
    return authenticatedService.delete(`${ResourcesEnpoint.Lessons}/${id}`);
  }

  public static getMetaData() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.MetaData}/lessons`);
  }
}
