export interface NotificationDetail {
  notificationId: number;
  type: 'TRADE' | 'BID';
  title: string;
  message: string;
  notifiedAt: string;
  isRead: boolean;
}

export interface GetUnreadNotificationsResponse {
  notifications: NotificationDetail[];
}

export interface HotKeywordResponse {
  keyword: string;
  rankNo: number;
}
