import axiosInstance from './axios-instance';
import { GetUnreadNotificationsResponse, HotKeywordResponse } from '../types/notification';

export const notificationsApi = {
  // 읽지 않은 알림 조회
  getUnreadNotifications: async (): Promise<GetUnreadNotificationsResponse> => {
    const response = await axiosInstance.get<GetUnreadNotificationsResponse>(
      '/main/api/v1/notifications/me'
    );
    return response.data;
  },

  // 인기 검색어 조회
  getHotKeywords: async (): Promise<HotKeywordResponse[]> => {
    const response = await axiosInstance.get<HotKeywordResponse[]>(
      '/main/api/v1/rankings/search-keywords'
    );
    return response.data;
  },
};
