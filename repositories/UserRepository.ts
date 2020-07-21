import { AxiosResponse } from 'axios';
import RepositoryService from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { AuthResponse, RegisterDTO, LoginDTO } from '@/constants/app.interface';

export default class UserRepository {
  public static changePassword(oldPassword: string, newPassword: string) {}
}
