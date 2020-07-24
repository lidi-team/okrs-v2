import { dataType, ruleTrigger, Validator, PromiseValidtor, UserRole } from './app.type';

export interface LoginDTO {
  email: string;
  password: string;
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

export interface ResetPasswordDTO {
  email: string;
}

export interface ResetPasswordActionDTO {
  newPassword: string;
  token: string;
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

export interface AuthResponse {
  data: {
    token: string;
    user: UserInfo;
  };
}

export interface UserInfo {
  name: string;
  role: UserRole;
  gravatar?: string | null;
}

export interface PromiseUserInfo {
  data: {
    user: UserInfo;
  };
}

export interface LinkName {
  link: string;
  name: string;
}
