import { dataType, ruleTrigger, Validator, PromiseValidtor } from './app.type';
import { EvaluationCriteriaEnum } from './app.enum';

export interface LinkMeta {
  rel: string;
  href: string;
}

export interface LessonDTO {
  id?: number;
  index: number;
  title: string;
  content: string;
}

// export interface IEmployeeDepartment {
//   id?: number;
//   name?: string;
// }
export interface EmployeeDTO {
  id?: number;
  fullName: string;
  email: string;
  roles: String[];
  departmentId: number;
  gender: number;
  dob: string;
  // isLeader: boolean;
  isActive?: boolean;
  isApproved?: boolean;
}

export interface ProjectDTO {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  pm?: string | Object;
  staffs?: Object[];
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
  dateOfBirth: any;
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
  present: string;
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
  pattern?: RegExp;
}

export interface SelectOptionDTO {
  label: string;
  value: any;
}

export interface FormFeedback {
  circle?: string;
  date?: Date;
  user?: string;
  objective?: number;
  criteria?: string;
  content?: string;
}

/**
 * Dialog type = 1 -> Open updating dialog
 * Dialog type = 2 -> Open aligning dialog
 */
export interface DialogTooltipAction {
  okrs: any;
  dialogType: number;
}

export interface CfrsDTO {
  type: 'feedback' | 'recognition';
  senderId?: Number;
  receiverId?: Number | null;
  content: String;
  evaluationCriteriaId: Number | null;
  objectiveId?: Number | null;
  checkinId?: Number;
}
