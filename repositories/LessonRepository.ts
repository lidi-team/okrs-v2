import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { LessonDTO } from '@/constants/app.interface';
export default class LessonRepository {
  public static get(params: any) {
    const query = { params };
    return authenticatedService.get(`${ResourcesEnpoint.Lessons}`, query);
  }

  public static create(payload: LessonDTO) {
    return authenticatedService.post(`${ResourcesEnpoint.Lessons}`, payload);
  }

  public static update(payload: LessonDTO) {
    return authenticatedService.put(`${ResourcesEnpoint.Lessons}/`, payload);
  }

  public static delete(id: number) {
    return authenticatedService.delete(`${ResourcesEnpoint.Lessons}/${id}`);
  }
}
