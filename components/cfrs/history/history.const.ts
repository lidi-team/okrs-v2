export enum HistoryType {
  ALL = 'all',
  SENT = 'sent',
  RECEIVED = 'received',
}

export const itemCfrsDefault: Object = {
  data: {
    content: '',
    createdAt: '',
    objective: {
      title: '',
    },
    checkin: {
      objective: {},
    },
    sender: {},
    receiver: {},
    type: '',
  },
  type: '',
};
