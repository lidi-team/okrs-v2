import { dataType, ruleTrigger, Validator, PromiseValidtor } from './app.type';
import { EvaluationCriteriaEnum } from './app.enum';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface MailResetPassDTO {
  email: string;
}

export interface LessonDTO {
  id?: number;
  index: number;
  title: string;
  content: string;
}
export interface EmployeeDTO {
  id?: number;
  fullName: string;
  email: string;
  roleId: number;
  teamId: number;
  jobPositionId: number;
  isLeader: boolean;
  isActive?: boolean;
  isApproved?: boolean;
}

export interface RegisterDTO {
  email: string;
  password: string;
  matchPassword?: string;
  fullName: string;
  gender: boolean | null;
  teamId: number | null;
  jobPositionId: number | null;
  token: string | null;
}

export interface RegisterOption {
  lable?: string;
  value?: number;
}

export interface ProfileDTO {
  role: string;
  fullName: string;
  email: string;
  gender: boolean;
  dateOfBirth: Date | '';
  department: string;
  position: string;
}

export interface TeamDTO {
  id?: number | any;
  name?: string;
  description?: string;
  updatedAt?: Date | null | string;
}

export interface JobPositionDTO {
  id?: number | any;
  name?: string;
  description?: string;
  updatedAt?: Date | null | string;
}

export interface MeasureUnitDTO {
  id?: number | any;
  preset: string;
  type: string;
  index: number;
}

export interface EvaluationCriteriorDTO {
  id?: number | any;
  content: string;
  numberOfStar: number;
  type: EvaluationCriteriaEnum | any;
}

export interface SelectDTO {
  label: string;
  value: string;
}

export interface ResetPasswordDTO {
  email: string;
}

export interface ResetPasswordActionDTO {
  password: string;
  matchPassword?: string;
  token: string;
}

export interface ChangePasswordDTO {
  password: string;
  newPassword: string;
  matchPassword?: string;
}

export interface CycleDTO {
  id?: number | any;
  name?: string | any;
  startDate?: Date | string | any;
  endDate?: Date | string | any;
}
export interface Map<T> {
  key: string;
  name: T;
}

export interface ConfigMaps<T> extends Record<string, T> {}

export interface FormRule {
  type?: dataType;
  required?: true | false;
  message?: string;
  validator?: Validator | PromiseValidtor;
  trigger?: ruleTrigger;
  min?: number;
  max?: number;
}

/**
 * Store
 */
export interface ParamsUser {
  status?: number;
  text?: string;
  page?: number;
  limit?: number;
}

export interface AdminParams {
  tab?: string;
  text?: string;
  page?: number;
  limit?: number;
}

export interface ParamsTeam {
  page?: number;
  limit?: number;
  text?: string;
}

export interface MetaPagination {
  totalItems?: number | any;
  itemCount?: number | any;
  itemsPerPage?: number | string | any;
  totalPages?: number | any;
  currentPage?: number | string | any;
}
