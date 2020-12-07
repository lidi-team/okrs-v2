import { FormRule, ConfigMaps } from './app.interface';

export type dataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'data'
  | 'url'
  | 'hex'
  | 'email';
export type ruleTrigger = 'blur' | 'change' | Array<'blur' | 'change'>;
export type Validator = (
  rule: any,
  value: any,
  callback: (message?: string) => any,
) => (message?: string) => any;
export type PromiseValidtor = (
  rule: any,
  value: any,
  callback: (message?: string) => any,
) => Promise<(message?: string) => any>;
export type Maps<T> = ConfigMaps<T>;
export type Rule = FormRule;
export type Rules = Maps<FormRule[]>;

export type UserRole = 'ROLE_ADMIN' | 'ROLE_ADMIN_HR' | 'ROLE_USER' | null;
