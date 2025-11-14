import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https:///up-pick.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: JWT 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // 토큰이 이미 'Bearer '로 시작하는지 확인
        config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
