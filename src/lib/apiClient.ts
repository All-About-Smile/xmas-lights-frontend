import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import refreshClient from "./refreshClient";
import {tokenStorage} from "./tokenStorage"; 

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================
   요청 인터셉터
====================== */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * -------------------------
 * ✅ 응답 인터셉터 (401 → refresh → retry)
 * - 동시 401이 와도 refresh 1번만 수행
 * - refresh가 성공하면 대기 중이던 요청들 재시도
 * - refresh 실패하면 토큰 삭제 + 로그인 상태 초기화(여기는 훅으로 연결)
 * -------------------------
 */

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// TS에서 originalRequest에 _retry 붙이기 위한 타입 확장
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    // 네트워크 오류 / config 없음이면 그대로 throw
    if (!originalRequest) return Promise.reject(error);

    // 401 아니면 그대로 throw
    if (status !== 401) return Promise.reject(error);

    // refresh 요청 자체가 401이면 무한루프 방지 위해 바로 실패 처리
    // (refreshClient를 쓰면 보통 필요 없지만, 안전장치)
    if (originalRequest.url?.includes("/auth/refresh")) {
      tokenStorage.removeAccessToken();
      return Promise.reject(error);
    }

    // 이미 재시도 한 요청이면 더 이상 반복하지 않기
    if (originalRequest._retry) {
      tokenStorage.removeAccessToken();
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // 이미 refresh 중이면, queue에 넣고 새 토큰 받으면 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    // refresh 시작
    isRefreshing = true;

    try {
      // ✅ refresh 호출 (서버가 쿠키 기반 refresh_token을 읽어 access_token 재발급)
      const res = await refreshClient.post("/auth/refresh");
      const newAccessToken = (res.data as any).access_token;

      if (!newAccessToken) {
        tokenStorage.removeAccessToken();
        processQueue(null);
        return Promise.reject(error);
      }

      // 새 토큰 저장
      tokenStorage.setAccessToken(newAccessToken);

      // 대기 중이던 요청들 처리
      processQueue(newAccessToken);

      // 원래 요청에도 새 토큰 붙이고 재시도
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.removeAccessToken();
      processQueue(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;