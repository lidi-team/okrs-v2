import { ElMessageBoxOptions } from 'element-ui/types/message-box';

export const pageLimit = 10;

export const notificationConfig = {
  title: 'Thông báo',
  duration: 2500,
};

export const statusCheckin = {
  DRAFT: 'Draft', // Luu nhap => Staff co the tiep tuc sua lai checkin
  PENDING: 'Pending', // Ca nhan checkin xong, gui request checkin cho leader => Staff ko duoc tao checkin moi, phai cho checkin xong cai cu
  OVERDUE: 'Overdue', // Qua han check in, hien thi text qua han => Van cho checkin
  DONE: 'Done', // Leader checkin xong => Staff co the tao checkin moi
  COMPLETED: 'Completed', // OKRs da hoan thanh => Khong checkin duoc
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
