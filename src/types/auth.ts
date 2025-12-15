// src/types/auth.ts

export type RegisterRequest = {
  userid: string;
  email: string;
  password: string;
};

// register / me data (네 서버 응답 기준 동일)
export type RegisterResponse = {
  id: number;
  userid: string;
  email: string;
  created_at: string;
};

export type MeResponse = RegisterResponse;

export type LoginRequest = {
  userid: string;
  password: string;
};

// ✅ login 성공 시 data 구조
export type LoginResponse = {
  access_token: string;
  token_type: "bearer" | string;
};

// refresh도 같은 구조면 그대로 재사용 가능
export type RefreshResponse = LoginResponse;
