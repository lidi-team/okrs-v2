import { Notification } from 'element-ui';
import { NotifyType } from './app.type';
import { notifyActionSuccess } from './app.interface';

export const notifyAction = (message: string, type: NotifyType, notifyAction?: notifyActionSuccess) => {
  Notification({
    title: 'Trạng thái',
    message:
      notifyAction?.action === 'create'
        ? `Tạo ${notifyAction.name} mới thành công`
        : notifyAction?.action === 'update'
        ? `Cập nhật ${notifyAction.name} thành công`
        : notifyAction?.action === 'delete'
        ? `Xóa ${notifyAction.name} thành công`
        : message,
    type,
    duration: 2000,
  });
};

export const notifyErrorLogin = (error: any) => {
  switch (error.response.data.statusCode) {
    case 430:
      notifyAction('Email không tồn tại', 'error');
      break;
    case 409:
      notifyAction('Mât khẩu không chính xác', 'error');
      break;
    case 420:
      notifyAction('Tài khoản của bạn đã bị khóa', 'error');
      break;
    case 422:
      notifyAction('Tài khoản của bạn đang chờ phê duyệt', 'error');
      break;
    default:
      notifyAction('Có lỗi xảy ra', 'error');
  }
};

export const notifyErrorRegister = (error: any) => {
  switch (error.response.data.statusCode) {
    case 432:
      notifyAction('Email đã tồn tại', 'error');
      break;
    case 413:
      notifyAction('Token không chính xác', 'error');
      break;
    case 414:
      notifyAction('Token đã hết hạn', 'error');
      break;
    default:
      notifyAction('Có lỗi xảy ra', 'error');
  }
};

export const notifyErrorResetPassword = (error: any) => {
  switch (error.response.data.statusCode) {
    case 413:
      notifyAction('Token không chính xác', 'error');
      break;
    case 414:
      notifyAction('Token đã hết hạn', 'error');
      break;
    default:
      notifyAction('Có lỗi xảy ra', 'error');
  }
};
