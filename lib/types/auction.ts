export interface AuctionBidRequest {
  biddingPrice: number;
}

export interface BidHistory {
  biddingDetailId: number;
  bidderId: number;
  bidderNickname: string;
  biddingPrice: number;
  biddingAt: string;
}
