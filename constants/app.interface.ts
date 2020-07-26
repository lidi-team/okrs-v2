import { dataType, ruleTrigger, Validator, PromiseValidtor, UserRole, Gender } from './app.type';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface MailResetPassDTO {
  email: string;
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
}

export interface RegisterDTO {
  email: string;
  password: string;
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
  avatar: string;
  fullname: string;
  role: string;
  gender: Gender;
  email: string;
  dob: Date | '';
  department: string;
  position: string;
}

export interface SelectDTO {
  label: string;
  value: string;
}

export interface ResetPasswordDTO {
  email: string;
}

export interface ResetPasswordActionDTO {
  newPassword: string;
  token: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  matchPassword: string;
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

export interface ParamsTeam {
  page?: number;
  limit?: number;
  text?: string;
}
