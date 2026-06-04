const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

interface FormatRelativeTimeOptions {
  emptyLabel?: string;
  dateFallbackDays?: number;
}

export function formatRelativeTime(
  dateStr: string | null | undefined,
  referenceTimeMs: number | null,
  options: FormatRelativeTimeOptions = {}
) {
  if (!dateStr) {
    return options.emptyLabel ?? "";
  }

  const timestamp = new Date(dateStr).getTime();
  if (Number.isNaN(timestamp)) {
    return options.emptyLabel ?? "";
  }

  const diff = Math.max(0, (referenceTimeMs ?? timestamp) - timestamp);
  const minutes = Math.floor(diff / MINUTE_MS);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(diff / HOUR_MS);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(diff / DAY_MS);
  if (options.dateFallbackDays && days >= options.dateFallbackDays) {
    return new Date(dateStr).toLocaleDateString("ko-KR");
  }

  return `${days}일 전`;
}
