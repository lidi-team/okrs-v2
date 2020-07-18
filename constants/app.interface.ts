import { dataType, ruleTrigger, Validator, PromiseValidtor } from './app.type';

export interface LoginDTO {
  email: string;
  password: string;
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
