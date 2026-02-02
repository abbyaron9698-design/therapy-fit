// lib/languages.ts

export const LANGUAGE_OPTIONS = [
  "Any",
  "English",
  "Spanish",
  "Polish",
  "Mandarin",
  "Cantonese",
  "Hindi",
  "Urdu",
  "Arabic",
  "Russian",
  "Korean",
  "Vietnamese",
  "Tagalog",
  "French",
  "Portuguese",
  "Italian",
  "Gujarati",
  "Bengali",
  "Punjabi",
  "Japanese",
  "ASL",
] as const;

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

export function normalizeLanguage(s: string) {
  return s.trim();
}

export function providerLanguages(p: any): string[] {
  const raw = Array.isArray(p?.languages) ? p.languages : [];
  const cleaned = raw.map((x: any) => String(x)).map(normalizeLanguage).filter(Boolean);
  // Default assumption if not listed:
  return cleaned.length ? cleaned : ["English"];
}
