import { dataType, ruleTrigger, Validator, PromiseValidtor, Gender } from './app.type';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  newPassword?: string;
  matchPassword?: string;
  token?: string;
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

export interface LoadingObject {
  start(): void;
  finish(): void;
}
