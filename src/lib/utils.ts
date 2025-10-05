import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithCommas(value: number): string {
  return value.toLocaleString("en-US");
}

export function parseIsoToDateTime(isoString: string): { date: string; time: string } {
  const dateObj = new Date(isoString);

  // Format date: YYYY Mon DD
  const date = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // Dec
    day: "2-digit",
  });

  // Format time: HH:MM (24h or 12h)
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // set to true if you want AM/PM
  });

  return { date, time };
}