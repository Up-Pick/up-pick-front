import axiosInstance from './axios-instance';
import { GetUnreadNotificationsResponse, HotKeywordResponse } from '../types/notification';
import { ApiResponse } from '../types/api';

export const notificationsApi = {
  // 읽지 않은 알림 조회
  getUnreadNotifications: async (): Promise<GetUnreadNotificationsResponse> => {
    const response = await axiosInstance.get<ApiResponse<GetUnreadNotificationsResponse>>(
      '/main/api/v1/notifications/me'
    );
    return response.data.data;
  },

  // 인기 검색어 조회
  getHotKeywords: async (): Promise<HotKeywordResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<HotKeywordResponse[]>>(
      '/main/api/v1/rankings/search-keywords'
    );
    return response.data.data;
  },
};
