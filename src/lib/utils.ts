import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format = "YYYY.MM.DD") {
  return dayjs(date).format(format);
}

export function formatDateKorean(date: string | Date) {
  return dayjs(date).format("M월 D일 (dd)");
}

export function getToday() {
  return dayjs().format("YYYY-MM-DD");
}

export function formatDateISO(date: string | Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function getDaysSince(startDate: string | Date) {
  return dayjs().diff(dayjs(startDate), "day");
}

export function getCurrentWeek(programStartDate: string | Date): number {
  const days = getDaysSince(programStartDate);
  return Math.min(Math.floor(days / 7) + 1, 12);
}

export function getGreeting(): string {
  const hour = dayjs().hour();
  if (hour < 6) return "새벽에도 열심히!";
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후예요";
  return "좋은 저녁이에요";
}
