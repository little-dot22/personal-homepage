export const MAX_LEVEL = 100;

/** 北京时间（UTC+8）今天 0 点对应的 ISO 字符串 */
export function shanghaiDayStartISO(): string {
  const shifted = new Date(Date.now() + 8 * 3600 * 1000);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();
  return new Date(Date.UTC(y, m, d) - 8 * 3600 * 1000).toISOString();
}

/** 北京时间今天的日期字符串（YYYY-MM-DD），用于比较 last_levelup_date */
export function shanghaiToday(): string {
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}
