// lib/providerFilter.ts
import type { Provider } from "./providerData";
import type { LanguageOption } from "./languages";

export type ProviderFilters = {
  zip: string; // "" or 3–5 digits
  insurance: string[]; // [] means Any
  telehealthOnly: boolean;
  acceptingOnly: boolean;
  language: LanguageOption; // for now, only used if Provider has languages later
};

export function normalizeZip(z: string) {
  return (z ?? "").replace(/[^\d]/g, "").slice(0, 5);
}

function includesInsensitive(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function filterProviders(
  providers: Provider[],
  filters: ProviderFilters,
  opts?: { limit?: number }
) {
  const zip = normalizeZip(filters.zip);
  const wantInsurance = (filters.insurance ?? []).filter(Boolean);
  const limit = opts?.limit ?? 6;

  const out = providers.filter((p) => {
    if (filters.telehealthOnly && !p.telehealth) return false;
    if (filters.acceptingOnly && !p.acceptingNewClients) return false;

    // ZIP match: allow 3-digit prefix match; 4–5 digits must match exact
    if (zip) {
      if (zip.length <= 3) {
        if (!p.zip.startsWith(zip)) return false;
      } else {
        if (p.zip !== zip) return false;
      }
    }

    // Insurance: any overlap
    if (wantInsurance.length) {
      const ok = wantInsurance.some((want) =>
        p.insurance.some((have) => includesInsensitive(have, want))
      );
      if (!ok) return false;
    }

    // Language: only enforce if/when Provider includes languages in the dataset.
    // Right now Provider doesn't have languages, so we ignore it to avoid blocking matches.
    return true;
  });

  return out.slice(0, limit);
}
