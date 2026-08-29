export const MAX_LEVEL = 10;

export const feedsForLevel = (level: number) => (level * (level + 1)) / 2;

export const levelForFeeds = (feeds: number) =>
  Math.min(MAX_LEVEL, Math.floor((Math.sqrt(8 * feeds + 1) - 1) / 2));

export const nextLevelFeeds = (feeds: number): number | null => {
  const level = levelForFeeds(feeds);
  if (level >= MAX_LEVEL) return null;
  return feedsForLevel(level + 1);
};

/** 北京时间（UTC+8）今天 0 点对应的 ISO 字符串 */
export function shanghaiDayStartISO(): string {
  const shifted = new Date(Date.now() + 8 * 3600 * 1000);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();
  return new Date(Date.UTC(y, m, d) - 8 * 3600 * 1000).toISOString();
}
