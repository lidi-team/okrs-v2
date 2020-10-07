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

export interface MailResetPassDTO {
  email: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordActionDTO {
  password: string;
  matchPassword?: string;
  token: string;
}
