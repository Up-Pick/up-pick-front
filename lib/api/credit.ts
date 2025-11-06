import axiosInstance from './axios-instance';
import { CreditResponse, CreditChargeRequest, CreditChargeResponse } from '../types/credit';

export const creditApi = {
  // 크레딧 조회
  getCredit: async (): Promise<CreditResponse> => {
    const response = await axiosInstance.get<CreditResponse>('/main/api/v1/members/me/credit');
    return response.data;
  },

  // 크레딧 충전
  chargeCredit: async (data: CreditChargeRequest): Promise<CreditChargeResponse> => {
    const response = await axiosInstance.post<CreditChargeResponse>(
      '/main/api/v1/members/me/credit/charge',
      data
    );
    return response.data;
  },
};
