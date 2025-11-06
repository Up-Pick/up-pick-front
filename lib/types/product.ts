export interface Category {
  categoryId: number;
  bigCategory: string;
  smallCategory: string;
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  imageUrl: string;
  sellerId: number;
  sellerNickname: string;
  sellerName: string;
  createdAt: string;
  registeredAt: string;
  viewCount: number;
  category: string;
  minPrice: number;
  currentBid: number | null;
  endAt: string;
  auction?: AuctionInfo; // 기존 호환성을 위해 유지
}

export interface AuctionInfo {
  auctionId: number;
  startBid: number;
  currentBid: number;
  status: 'IN_PROGRESS' | 'FINISHED' | 'EXPIRED';
  endAt: string;
  winnerNickname?: string;
}

export interface ProductSimpleInfo {
  id: number;
  name: string;
  imageUrl: string;
  currentBid?: number;
  minBidPrice: number;
  endAt: string;
}

export interface ProductRegisterRequest {
  name: string;
  description: string;
  categoryId: number;
  startBid: number;
  endAt: string; // ISO 8601 format
  image: File;
}

export interface SearchProductRequest {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sortBy?: 'REGISTERED_AT_DESC' | 'END_AT' | 'CURRENT_BID';
  endAtFrom?: string;
}

export interface StandardPageResponse<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  contents: T[];
}
