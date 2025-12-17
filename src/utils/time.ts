// 서버 Date 기준으로 12/25 00:00(KST) 이후인지 판단
const FORCE_UNLOCK = false;//.편지 열리는 테스트용
export function isUnlockedByServerDate(serverNow: Date): boolean {

  if (FORCE_UNLOCK) return true; // ✅ 개발 테스트용 강제 오픈
  // KST 12/25 00:00 == UTC 12/24 15:00
  const year = serverNow.getUTCFullYear();
  const openAtUTC = new Date(Date.UTC(year, 11, 24, 15, 0, 0));

  return serverNow.getTime() >= openAtUTC.getTime();
}
