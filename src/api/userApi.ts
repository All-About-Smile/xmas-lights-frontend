// src/api/userApi.ts
import apiClient from "@/lib/apiClient";
import axios from "axios";

/**
 * 존재하면 true, 없으면 false(404) 반환
 * 그 외(500 등)는 throw 해서 상위에서 에러 처리
 */
export async function checkUserExists(userid: string): Promise<boolean> {
  try {
    await apiClient.get(`/users/${encodeURIComponent(userid)}`);
    return true;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) return false;
    throw e;
  }
}
