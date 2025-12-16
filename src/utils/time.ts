// 서버 Date 기준으로 12/25 00:00(KST) 이후인지 판단
export function isUnlockedByServerDate(serverNow: Date): boolean {
  // KST 12/25 00:00 == UTC 12/24 15:00
  const year = serverNow.getUTCFullYear();
  const openAtUTC = new Date(Date.UTC(year, 11, 24, 15, 0, 0));

  return serverNow.getTime() >= openAtUTC.getTime();
}
