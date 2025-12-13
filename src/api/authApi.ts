// src/api/authApi.ts
import apiClient from "../lib/apiClient";
import type { LoginRequest, RegisterRequest, MeResponse, LoginResponse } from "../types/auth";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post("/auth/register", data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/auth/login", data),

  me: () =>
    apiClient.get<MeResponse>("/auth/me"),

  refresh: () =>
    apiClient.post<LoginResponse>("/auth/refresh", {}),

  logout: () =>
    apiClient.post("/auth/logout", {}),
};
