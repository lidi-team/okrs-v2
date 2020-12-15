import moment from 'moment';

export function formatDate(data: any) {
  return moment(data).format('L');
}
