import apiClient from "@/lib/apiClient";

export async function getServerNow(): Promise<Date | null> {
  // ✅ 아무 GET 엔드포인트나 OK (Date 헤더만 필요)
  const res = await apiClient.get("/docs");
  const dateHeader = res.headers?.date as string | undefined;
  return dateHeader ? new Date(dateHeader) : null;
}
