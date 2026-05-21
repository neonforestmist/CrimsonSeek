import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function faviconFor(url: string, fallback?: string | null): string {
  if (fallback) return fallback;
  const host = hostnameOf(url);
  return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
}
