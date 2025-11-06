export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface Member {
  id: number;
  email: string;
  nickname: string;
  credit: number;
}
