import { dataType, ruleTrigger } from './app.type';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface FormRules {
  type?: dataType;
  required?: true | false;
  message?: string;
  validator?: void;
  trigger: ruleTrigger;
  min?: number;
  max?: number;
}

export interface LoadingObject {
  start(): void;
  finish(): void;
}
