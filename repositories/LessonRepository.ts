import { baseUrlV1, baseUrl } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { LessonDTO } from '@/constants/app.interface';
export default class LessonRepository {
  public static get(params: any) {
    return baseUrlV1.get(`${ResourcesEnpoint.Lessons}`, { params });
  }

  public static getPost(slug: string) {
    return baseUrlV1.get(`${ResourcesEnpoint.Lessons}/${slug}`);
  }

  public static create(payload: LessonDTO) {
    return baseUrlV1.post(`${ResourcesEnpoint.Lessons}`, payload);
  }

  public static update(payload: LessonDTO, id: number) {
    return baseUrlV1.put(`${ResourcesEnpoint.Lessons}/${id}`, payload);
  }

  public static delete(id: number) {
    return baseUrlV1.delete(`${ResourcesEnpoint.Lessons}/${id}`);
  }

  public static getMetaData() {
    return baseUrlV1.get(`${ResourcesEnpoint.MetaData}/lessons`);
  }
}
