import axiosInstance from './axios-instance';
import {
  Product,
  ProductSimpleInfo,
  ProductRegisterRequest,
  SearchProductRequest,
  StandardPageResponse,
  Category,
} from '../types/product';

export const productsApi = {
  // 상품 검색
  searchProducts: async (
    params: SearchProductRequest
  ): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.post<StandardPageResponse<ProductSimpleInfo>>(
      '/api/v1/products/search',
      params
    );
    return response.data;
  },

  // 상품 상세 조회
  getProduct: async (productId: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/api/v1/products/${productId}`);
    return response.data;
  },

  // 상품 간단 정보 조회
  getProductSimpleInfo: async (productId: number): Promise<ProductSimpleInfo> => {
    const response = await axiosInstance.get<ProductSimpleInfo>(
      `/api/v1/products/${productId}/simple-info`
    );
    return response.data;
  },

  // 상품 등록
  registerProduct: async (data: ProductRegisterRequest): Promise<void> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId.toString());
    formData.append('startBid', data.startBid.toString());
    formData.append('endAt', data.endAt);
    formData.append('image', data.image);

    await axiosInstance.post('/api/v1/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 내 판매중 상품
  getMySoldProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<StandardPageResponse<ProductSimpleInfo>>(
      '/api/v1/products/sold/me',
      { params: { page, size } }
    );
    return response.data;
  },

  // 내 판매완료 상품
  getMyPurchasedProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<StandardPageResponse<ProductSimpleInfo>>(
      '/api/v1/products/purchased/me',
      { params: { page, size } }
    );
    return response.data;
  },

  // 내 입찰중 상품
  getMyBiddingProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<StandardPageResponse<ProductSimpleInfo>>(
      '/api/v1/products/bidding/me',
      { params: { page, size } }
    );
    return response.data;
  },

  // 내 판매중 상품
  getMySellingProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<StandardPageResponse<ProductSimpleInfo>>(
      '/api/v1/products/selling/me',
      { params: { page, size } }
    );
    return response.data;
  },

  // 카테고리 목록
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/api/v1/categories');
    return response.data;
  },
};
