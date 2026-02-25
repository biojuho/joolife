/**
 * 한국 시간(KST, UTC+9) 기준 날짜 유틸리티
 */

/** KST 기준 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환 */
export function getKSTDateString(date: Date = new Date()): string {
  return date
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  // sv-SE locale은 ISO 8601 형식(YYYY-MM-DD)을 반환
}

/** KST 기준 어제 날짜를 "YYYY-MM-DD" 형식으로 반환 */
export function getKSTYesterdayString(): string {
  const now = new Date();
  // KST 기준 현재 시각
  const kstNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  kstNow.setDate(kstNow.getDate() - 1);
  return kstNow.toLocaleDateString("sv-SE");
}
