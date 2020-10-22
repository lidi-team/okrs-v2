import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';

export const employeeRules: Maps<Rule[]> = {
  fullName: [
    {
      required: true,
      pattern: /^[^-\s]/,
      message: 'Họ và tên không được bỏ trống',
      trigger: 'blur',
    },
    {
      // eslint-disable-next-line no-useless-escape
      pattern: /^[^\@\#\^\{\}\<\>\~\+\`\/\*\[\]]+$/,
      message: 'Họ và tên không được chứa ký tự đặc biệt',
      trigger: 'blur',
    },
    max255Char,
  ],
  email: [
    { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
    { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
    max255Char,
  ],
  teamId: [
    {
      required: true,
      message: 'Phòng ban không được bỏ trống',
      trigger: 'blur',
    },
  ],
  jobPositionId: [
    {
      required: true,
      message: 'Vị trí công việc không được bỏ trống',
      trigger: 'blur',
    },
  ],
  roleId: [
    {
      required: true,
      message: 'Vai trò không được bỏ trống',
      trigger: 'blur',
    },
  ],
};
