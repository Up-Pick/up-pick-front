import axiosInstance from './axios-instance';
import { AuctionBidRequest } from '../types/auction';

export const auctionsApi = {
  // 입찰하기
  placeBid: async (auctionId: number, data: AuctionBidRequest): Promise<void> => {
    await axiosInstance.post(`/auction/api/v1/auctions/${auctionId}/bid`, data);
  },
};
