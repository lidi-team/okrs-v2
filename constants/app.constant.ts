import { ElMessageBoxOptions } from 'element-ui/types/message-box';

export const pageLimit = 10;

export const notificationConfig = {
  title: 'Thông báo',
  duration: 2500,
};

export const statusCheckin = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  DONE: 'Done',
  COMPLETED: 'Completed',
};

export const confidentLevel = [
  {
    value: 1.1,
    label: 'Tự tin',
  },
  {
    value: 1.0,
    label: 'Bình thường',
  },
  {
    value: 0.9,
    label: 'Không tự tin lắm',
  },
];

export const confirmWarningConfig: ElMessageBoxOptions = {
  type: 'warning',
  confirmButtonText: 'Đồng ý',
  cancelButtonText: 'Hủy',
};

export const environment = process.env.NODE_ENV;
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'development');
