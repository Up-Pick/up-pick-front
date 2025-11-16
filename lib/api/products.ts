import axiosInstance from './axios-instance';
import {
  Product,
  ProductSimpleInfo,
  ProductRegisterRequest,
  SearchProductRequest,
  StandardPageResponse,
  Category,
} from '../types/product';
import { ApiResponse } from '../types/api';

export const productsApi = {
  // 상품 검색
  searchProducts: async (
    params: SearchProductRequest
  ): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    // undefined 값 제거
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const response = await axiosInstance.post<ApiResponse<StandardPageResponse<ProductSimpleInfo>>>(
      '/auction/api/v1/products/search',
      cleanParams
    );
    return response.data.data;
  },

  // 상품 상세 조회
  getProduct: async (productId: number): Promise<Product> => {
    const response = await axiosInstance.get<ApiResponse<Product>>(
      `/auction/api/v1/products/${productId}`
    );
    return response.data.data;
  },

  // 상품 간단 정보 조회
  getProductSimpleInfo: async (productId: number): Promise<ProductSimpleInfo> => {
    const response = await axiosInstance.get<ApiResponse<ProductSimpleInfo>>(
      `/auction/api/v1/products/${productId}/simple-info`
    );
    return response.data.data;
  },

  // 상품 등록
  registerProduct: async (data: ProductRegisterRequest): Promise<void> => {
    const formData = new FormData();
    
    // 백엔드 @RequestPart("product")에 맞게 상품 정보를 JSON으로 추가
    const productData = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      startBid: data.startBid,
      endAt: data.endAt,
    };
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    
    // 백엔드 @RequestPart("image")에 맞게 이미지 추가
    formData.append('image', data.image);

    await axiosInstance.post('/auction/api/v1/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 내 판매중 상품
  getMySoldProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<ApiResponse<StandardPageResponse<ProductSimpleInfo>>>(
      '/auction/api/v1/products/sold/me',
      { params: { page, size } }
    );
    return response.data as unknown as StandardPageResponse<ProductSimpleInfo>;
  },

  // 내 판매완료 상품
  getMyPurchasedProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<ApiResponse<StandardPageResponse<ProductSimpleInfo>>>(
      '/auction/api/v1/products/purchased/me',
      { params: { page, size } }
    );
     return response.data as unknown as StandardPageResponse<ProductSimpleInfo>;
  },

  // 내 입찰중 상품
  getMyBiddingProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<ApiResponse<StandardPageResponse<ProductSimpleInfo>>>(
      '/auction/api/v1/products/bidding/me',
      { params: { page, size } }
    );
     return response.data as unknown as StandardPageResponse<ProductSimpleInfo>;
  },

  // 내 판매중 상품
  getMySellingProducts: async (page: number = 0, size: number = 10): Promise<StandardPageResponse<ProductSimpleInfo>> => {
    const response = await axiosInstance.get<ApiResponse<StandardPageResponse<ProductSimpleInfo>>>(
      '/auction/api/v1/products/selling/me',
      { params: { page, size } }
    );
     return response.data as unknown as StandardPageResponse<ProductSimpleInfo>;
  },

  // 카테고리 목록
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<ApiResponse<Category[]>>('/auction/api/v1/categories');
    return response.data.data;
  },
};
