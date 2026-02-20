import readingTime from "reading-time";

/**
 * Calculate reading time in minutes for Korean text
 */
export function getReadingTime(content: string): number {
  const stats = readingTime(content);
  return Math.max(1, Math.ceil(stats.minutes));
}

/**
 * Get excerpt from content (first N characters, stripped of markdown)
 */
export function getExcerpt(content: string, maxLength = 200): string {
  // Strip markdown syntax
  const stripped = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/>\s(.+)/g, "$1")
    .replace(/[-*+]\s/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).trim() + "...";
}

/**
 * Split content for gated access
 * Returns the visible portion of content based on access percentage
 */
export function getGatedContent(
  content: string,
  visiblePercent: number
): { visible: string; hasMore: boolean } {
  const lines = content.split("\n");
  const visibleLineCount = Math.ceil(lines.length * (visiblePercent / 100));
  const visible = lines.slice(0, visibleLineCount).join("\n");
  const hasMore = visibleLineCount < lines.length;

  return { visible, hasMore };
}
