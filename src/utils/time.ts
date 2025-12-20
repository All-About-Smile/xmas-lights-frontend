// Server Date gate: unlock after Dec 25 00:00 (KST)
// const FORCE_UNLOCK = true; // helper for local unlock testing

const KST_OFFSET_MINUTES = 9 * 60;
const KST_OFFSET_MS = KST_OFFSET_MINUTES * 60 * 1000;

type KstOpenAtGroups = {
  month: string;
  day: string;
  hour: string;
  minute: string;
};

const DEFAULT_OPEN_AT_KST = {
  month: 12,
  day: 25,
  hour: 0,
  minute: 0,
};

function toUtcFromKst(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - KST_OFFSET_MS;
  return new Date(utcMs);
}

function parseOpenAtFromEnv(year: number): Date | null {
  const envValue = import.meta.env.VITE_OPEN_AT_KST;
  if (!envValue) return null;

  // Preferred: ISO with timezone, e.g. 2024-12-25T00:00:00+09:00
  const isoCandidate = new Date(envValue);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate;
  }

  // Fallback: "MM/DD HH:mm" or "MM-DD HH:mm" treated as KST for the given year.
  const match = envValue
    .trim()
    .match(
      /^(?<month>\d{1,2})[/-](?<day>\d{1,2})\s+(?<hour>\d{1,2}):(?<minute>\d{2})$/
    );
  const groups = match?.groups as KstOpenAtGroups | undefined;
  if (!groups) return null;

  return toUtcFromKst(
    year,
    Number(groups.month),
    Number(groups.day),
    Number(groups.hour),
    Number(groups.minute)
  );
}

function getOpenAtUTC(year: number): Date {
  const envOpen = parseOpenAtFromEnv(year);
  if (envOpen) return envOpen;

  return toUtcFromKst(
    year,
    DEFAULT_OPEN_AT_KST.month,
    DEFAULT_OPEN_AT_KST.day,
    DEFAULT_OPEN_AT_KST.hour,
    DEFAULT_OPEN_AT_KST.minute
  );
}

export function isUnlockedByServerDate(serverNow: Date): boolean {
  // if (FORCE_UNLOCK) return true; // force unlock for testing
  const openAtUTC = getOpenAtUTC(serverNow.getUTCFullYear());
  return serverNow.getTime() >= openAtUTC.getTime();
}

export function toKoreanTime(date: Date): Date {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcTime + KST_OFFSET_MINUTES * 60000);
}

export function getDaysUntilOpen(now: Date = new Date()): number {
  const openAtUTC = getOpenAtUTC(now.getUTCFullYear());
  const diffMs = openAtUTC.getTime() - now.getTime();
  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
