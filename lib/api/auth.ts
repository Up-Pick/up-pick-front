import axiosInstance from './axios-instance';
import { SignupRequest, LoginRequest, LoginResponse } from '../types/auth';
import { ApiResponse } from '../types/api';

export const authApi = {
  signup: async (data: SignupRequest): Promise<void> => {
    await axiosInstance.post('/main/api/v1/members/signup', data);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/main/api/v1/members/login',
      data
    );
    return response.data.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },
};
