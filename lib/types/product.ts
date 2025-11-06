export interface Category {
  categoryId: number;
  bigCategory: string;
  smallCategory: string;
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  category: Category;
  imageUrl: string;
  sellerId: number;
  sellerNickname: string;
  createdAt: string;
  auction: AuctionInfo;
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
  productId: number;
  name: string;
  imageUrl: string;
  currentBid: number;
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
