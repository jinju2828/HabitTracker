// dateUtils.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

/**
 * UTC 오늘 날짜 (YYYY-MM-DD) 반환
 */
export function getTodayUTC(): string {
  return dayjs.utc().format("YYYY-MM-DD");
}

/**
 * YYYY-MM-DD → UTC Date 객체
 */
export function parseDateUTC(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

/**
 * YYYY-MM-DD → 표시용 MM/dd
 */
export function formatDisplay(dateStr: string): string {
  return dayjs.utc(dateStr).format("MM/DD");
}

/**
 * YYYY-MM-DD 비교 (UTC)
 */
export function isAfterUTC(dateStr: string, compare: Date): boolean {
  const d = parseDateUTC(dateStr);
  return d.getTime() > compare.getTime();
}

/**
 * Dayjs UTC Helpers
 */
export function dayjsUTC(dateStr: string) {
  return dayjs.utc(dateStr);
}
