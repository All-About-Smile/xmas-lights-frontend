// src/api/authApi.ts
import apiClient from "../lib/apiClient";
import type { ApiResponse } from "../types/api";
import type {
  LoginRequest,
  RegisterRequest,
  MeResponse,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
} from "../types/auth";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<RegisterResponse>>("/auth/register", data),

  // ✅ login도 ApiResponse<LoginResponse>
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data),

  // ✅ me도 ApiResponse<MeResponse>
  me: () =>
    apiClient.get<ApiResponse<MeResponse>>("/users/me"),

  // refresh도 네 서버가 래퍼면 이렇게
  refresh: () =>
    apiClient.post<ApiResponse<RefreshResponse>>("/auth/refresh", {}),

  logout: () =>
    apiClient.post("/auth/logout", {}),
};
