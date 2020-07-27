import { Notification } from 'element-ui';

export const logErrorLogin = (error: any) => {
  switch (error.response.data.statusCode) {
    case 430:
      Notification({
        title: 'Trạng thái',
        message: 'Email không tồn tại',
        type: 'error',
        duration: 2000,
      });
      break;
    case 409:
      Notification({
        title: 'Trạng thái',
        message: 'Mât khẩu không chính xác',
        type: 'error',
        duration: 2000,
      });
      break;
    case 420:
      Notification({
        title: 'Trạng thái',
        message: 'Tài khoản của bạn đã bị khóa',
        type: 'error',
        duration: 2000,
      });
      break;
    case 422:
      Notification({
        title: 'Trạng thái',
        message: 'Tài khoản của bạn đang chờ phê duyệt',
        type: 'error',
        duration: 2000,
      });
      break;
    default:
      Notification({
        title: 'Trạng thái',
        message: 'Có lỗi xảy ra',
        type: 'error',
        duration: 2000,
      });
  }
};
