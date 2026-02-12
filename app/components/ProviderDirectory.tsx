// app/components/ProviderDirectory.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PROVIDERS, type Provider } from "../../lib/providerData";
import type { ModalityId } from "../../lib/quizData";
import { MODALITY_LABELS } from "../../lib/quizData";
import { track } from "../../lib/analytics";
import {
  LANGUAGE_OPTIONS,
  type LanguageOption,
  providerLanguages,
} from "../../lib/languages";

type Filters = {
  zip: string; // "" or 3–5 digits
  insurance: string[]; // [] means Any
  telehealthOnly: boolean;
  acceptingOnly: boolean;
  language: LanguageOption;
};

type Ctx = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  insuranceOptions: string[];
  languageOptions: LanguageOption[];
  hydrated: boolean;
};

const ProviderFiltersContext = createContext<Ctx | null>(null);

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function normalizeZipInput(raw: string) {
  return (raw ?? "").replace(/[^\d]/g, "").slice(0, 5);
}

function zipPrefix3(zip: string) {
  const z = normalizeZipInput(zip);
  return z.length >= 3 ? z.slice(0, 3) : "";
}

function zipMode(zip: string): "none" | "prefix3" | "exact5" {
  const z = normalizeZipInput(zip);
  if (!z) return "none";
  if (z.length === 5) return "exact5";
  if (z.length >= 3) return "prefix3";
  return "none";
}

/* -----------------------------
   Persist filters across /results?contact=1
------------------------------ */

const FILTERS_STORAGE_KEY = "tf_provider_filters_v1";

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function sanitizeFilters(input: any): Filters | null {
  if (!input || typeof input !== "object") return null;

  const zip = typeof input.zip === "string" ? normalizeZipInput(input.zip) : "";

  const insurance =
    Array.isArray(input.insurance) &&
    input.insurance.every((x: any) => typeof x === "string")
      ? (input.insurance as string[])
      : [];

  const telehealthOnly = Boolean(input.telehealthOnly);

  const acceptingOnly =
    typeof input.acceptingOnly === "boolean" ? input.acceptingOnly : true;

  const language =
    typeof input.language === "string"
      ? (input.language as LanguageOption)
      : ("Any" as LanguageOption);

  return {
    zip,
    insurance,
    telehealthOnly,
    acceptingOnly,
    language,
  };
}

function loadStoredFilters(): Filters | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(FILTERS_STORAGE_KEY);
  return sanitizeFilters(safeParseJSON<any>(raw));
}

function storeFilters(filters: Filters) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // ignore
  }
}

function clearStoredFilters() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(FILTERS_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * ✅ Define when the user has actually "searched"
 * (So we don't auto-populate providers on page load.)
 */
function hasUserSearched(filters: Filters) {
  const z = normalizeZipInput(filters.zip);
  const zipReady = z.length >= 3; // 606 or 60611
  const insuranceReady = filters.insurance.length > 0;
  const languageReady = filters.language !== "Any";
  return zipReady || insuranceReady || languageReady;
}

/**
 * IMPORTANT: ZIP is NOT a filter. It only affects SORT order and badges.
 * Rank meanings:
 * 0 = exact 5-digit match
 * 1 = same 3-digit prefix (606xx)
 * 2 = same state (IL)
 * 3 = everything else / unknown
 */
function proximityRank(provider: Provider, userZipRaw: string) {
  const uz = normalizeZipInput(userZipRaw);
  if (!uz) return 2;

  const pz = normalizeZipInput(provider.zip ?? "");
  const pState = (provider.state ?? "").toUpperCase();

  if (uz.length === 5 && pz && pz === uz) return 0;

  const pref = zipPrefix3(uz);
  if (pref && pz && pz.startsWith(pref)) return 1;

  if (pState === "IL") return 2;
  return 3;
}

export function ProviderFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const DEFAULTS: Filters = {
    zip: "",
    insurance: [],
    telehealthOnly: false,
    acceptingOnly: true,
    language: "Any",
  };

  // ✅ SSR-safe: server + first client render match
  const [filters, setFilters] = useState<Filters>(DEFAULTS);

  // ✅ Prevent writing defaults into storage before we’ve read storage
  const [hydrated, setHydrated] = useState(false);

  // ✅ After mount (client only), load stored filters
  useEffect(() => {
    setHydrated(true);
    const stored = loadStoredFilters();
    if (stored) setFilters(stored);
  }, []);

  // ✅ Persist filters only after hydration
  useEffect(() => {
    if (!hydrated) return;
    storeFilters(filters);
  }, [filters, hydrated]);

  const insuranceOptions = useMemo(() => {
    const ins = PROVIDERS.flatMap((p) => p.insurance ?? []);
    return uniq(ins).sort((a, b) => a.localeCompare(b));
  }, []);

  const languageOptions = useMemo(() => {
    const known = new Set<string>(LANGUAGE_OPTIONS as readonly string[]);
    const providerLangs = PROVIDERS.flatMap((p) => providerLanguages(p));
    const extras = uniq(providerLangs)
      .filter((l): l is string => Boolean(l))
      .filter((l) => !known.has(l))
      .sort((a, b) => a.localeCompare(b));

    return [
      ...LANGUAGE_OPTIONS,
      ...(extras as unknown as LanguageOption[]),
    ] as LanguageOption[];
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, insuranceOptions, languageOptions, hydrated }),
    [filters, insuranceOptions, languageOptions, hydrated]
  );

  return (
    <ProviderFiltersContext.Provider value={value}>
      {children}
    </ProviderFiltersContext.Provider>
  );
}

function useProviderFilters() {
  const ctx = useContext(ProviderFiltersContext);
  if (!ctx) {
    throw new Error(
      "useProviderFilters must be used inside ProviderFiltersProvider"
    );
  }
  return ctx;
}

function InsuranceMultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(opt: string) {
    const next = selected.includes(opt)
      ? selected.filter((x) => x !== opt)
      : [...selected, opt];
    onChange(next);
  }

  function clear() {
    onChange([]);
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-700">Insurance</span>
        <button
          type="button"
          onClick={clear}
          className="text-[11px] font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
        >
          Clear
        </button>
      </div>

      {selected.length ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s}
              className="rounded-full border bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
            >
              {s}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-slate-500">Any insurance</div>
      )}

      <div className="max-h-40 overflow-auto rounded-xl border bg-white p-2">
        <div className="grid gap-2">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-slate-500">
        Select one or more (OR logic)
      </div>
    </div>
  );
}

export function ProviderFiltersBar() {
  const {
    filters,
    setFilters,
    insuranceOptions,
    languageOptions,
    hydrated,
  } = useProviderFilters();

  // ✅ During hydration, force UI to render the same markup as SSR
  const uiFilters: Filters = hydrated
    ? filters
    : {
        zip: "",
        insurance: [],
        telehealthOnly: false,
        acceptingOnly: true,
        language: "Any",
      };

  function clearAll() {
    const next: Filters = {
      zip: "",
      insurance: [],
      telehealthOnly: false,
      acceptingOnly: true,
      language: "Any",
    };
    setFilters(next);
    clearStoredFilters();
    track("filters_clear_all");
  }

  return (
    <div className="mb-10 rounded-2xl border bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-900">
            Provider filters
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Add ZIP (3–5 digits) and/or insurance to show providers. ZIP also
            sorts by proximity (closer first).
          </div>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="w-fit rounded-xl border px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
        >
          Clear all filters
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-700">ZIP</span>
          <input
            value={uiFilters.zip}
            onChange={(e) => {
              if (!hydrated) return;
              const nextZip = normalizeZipInput(e.target.value);
              setFilters((f) => ({ ...f, zip: nextZip }));
              track("filter_zip_change", {
                zipLen: nextZip.length,
                zipMode: zipMode(nextZip),
                zipPrefix3: zipPrefix3(nextZip) || null,
              });
            }}
            placeholder="e.g., 60611 (or 606)"
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
            inputMode="numeric"
          />
          <span className="text-[11px] text-slate-500">Type 3–5 digits</span>
        </label>

        <InsuranceMultiSelect
          options={insuranceOptions}
          selected={uiFilters.insurance}
          onChange={(next) => {
            if (!hydrated) return;
            setFilters((f) => ({ ...f, insurance: next }));
            track("filter_insurance_change", { count: next.length });
          }}
        />

        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-700">Language</span>
          <select
            value={uiFilters.language}
            onChange={(e) => {
              if (!hydrated) return;
              const next = e.target.value as LanguageOption;
              setFilters((f) => ({ ...f, language: next }));
              track("filter_language_change", { language: next });
            }}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            {languageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500">
            We’ll expand language coverage as the directory grows.
          </span>
        </label>

        <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <input
            type="checkbox"
            checked={uiFilters.telehealthOnly}
            onChange={(e) => {
              if (!hydrated) return;
              setFilters((f) => ({ ...f, telehealthOnly: e.target.checked }));
              track("filter_telehealth_toggle", { on: e.target.checked });
            }}
          />
          <span className="text-sm text-slate-700">Telehealth only</span>
        </label>

        <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <input
            type="checkbox"
            checked={uiFilters.acceptingOnly}
            onChange={(e) => {
              if (!hydrated) return;
              setFilters((f) => ({ ...f, acceptingOnly: e.target.checked }));
              track("filter_accepting_toggle", { on: e.target.checked });
            }}
          />
          <span className="text-sm text-slate-700">Accepting new clients</span>
        </label>
      </div>
    </div>
  );
}

function matchesInsurance(
  providerInsurance: string[] | undefined,
  selected: string[]
) {
  if (!selected.length) return true;
  const ins = providerInsurance ?? [];
  return selected.some((s) => ins.includes(s));
}

function matchesLanguage(provider: Provider, selected: LanguageOption) {
  if (selected === "Any") return true;
  const langs = providerLanguages(provider);
  return langs.includes(selected);
}

function isFeaturedActive(p: Provider) {
  if (!p.featured) return false;
  if (!p.featuredUntil) return true;
  const t = Date.parse(p.featuredUntil);
  if (!Number.isFinite(t)) return true;
  return Date.now() <= t;
}

function ProximityBadge({ p, userZip }: { p: Provider; userZip: string }) {
  const mode = zipMode(userZip);
  if (mode === "none") return null;

  const rank = proximityRank(p, userZip);
  const pref = zipPrefix3(userZip);

  if (rank === 0) {
    return (
      <span className="rounded-full border bg-white px-2 py-1 text-[11px] font-medium text-slate-700">
        Same ZIP
      </span>
    );
  }

  if (rank === 1 && pref) {
    return (
      <span className="rounded-full border bg-white px-2 py-1 text-[11px] font-medium text-slate-700">
        Near {pref}xx
      </span>
    );
  }

  return (
    <span className="rounded-full border bg-white px-2 py-1 text-[11px] font-medium text-slate-700">
      In Illinois
    </span>
  );
}

function ProviderCard({
  p,
  modalityId,
  userZip,
}: {
  p: Provider;
  modalityId: ModalityId;
  userZip: string;
}) {
  const featured = isFeaturedActive(p);
  const langs = providerLanguages(p);

  return (
    <div
      className={[
        "rounded-xl border p-3",
        featured ? "bg-amber-50 border-amber-200" : "bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-slate-900">{p.name}</div>
          <div className="mt-1 text-sm text-slate-600">
            {p.city}, {p.state} • {p.zip} •{" "}
            {p.telehealth ? "Telehealth" : "In-person"}
            {p.acceptingNewClients ? "" : " • Not accepting"}
          </div>

          {p.address ? (
            <div className="mt-1 text-xs text-slate-500">
              Address: {p.address}
            </div>
          ) : null}

          <div className="mt-1 text-xs text-slate-500">
            Insurance: {(p.insurance ?? []).join(", ") || "Not listed"}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Language: {langs.join(", ")}
          </div>

          {p.notes ? (
            <div className="mt-2 text-xs text-slate-600">{p.notes}</div>
          ) : null}

          {featured ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-2 py-1 text-[11px] font-medium text-amber-800">
              Featured
              {p.featuredTagline ? (
                <span className="font-normal text-amber-700">
                  {" "}
                  • {p.featuredTagline}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-end gap-2">
          <ProximityBadge p={p} userZip={userZip} />
          {p.verified ? (
            <div className="rounded-full border bg-white px-2 py-1 text-[11px] font-medium text-slate-700">
              Verified
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {p.intakeUrl ? (
          <a
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            href={p.intakeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("provider_click_intake", { providerId: p.id, modalityId })
            }
          >
            Intake →
          </a>
        ) : null}

        {p.website ? (
          <a
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            href={p.website}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              track("provider_click_website", { providerId: p.id, modalityId });
              track("provider_website_clicked", {
                providerId: p.id,
                modalityId,
                source: "card",
              });
            }}
          >
            Website →
          </a>
        ) : null}

        {p.directionsUrl ? (
          <a
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            href={p.directionsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("provider_click_directions", {
                providerId: p.id,
                modalityId,
              })
            }
          >
            Directions →
          </a>
        ) : null}

        {p.parkingUrl ? (
          <a
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            href={p.parkingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("provider_click_parking", { providerId: p.id, modalityId })
            }
          >
            Parking →
          </a>
        ) : null}

        <a
          className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
          href={`/claim?providerId=${encodeURIComponent(p.id)}`}
          onClick={() =>
            track("provider_click_claim", { providerId: p.id, modalityId })
          }
        >
          Claim listing →
        </a>
      </div>

      {p.sourceUrl ? (
        <div className="mt-2 text-[11px] text-slate-500">
          Source:{" "}
          <a
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            href={p.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("provider_click_source", { providerId: p.id, modalityId })
            }
          >
            directory link
          </a>
        </div>
      ) : null}
    </div>
  );
}

/** ---------- Fallback tiers so we never show 0-of-0 ---------- */

type FallbackLevel =
  | "none"
  | "relaxed_insurance"
  | "relaxed_accepting"
  | "relaxed_telehealth"
  | "starter_list";

function sortProviders(list: Provider[], userZip: string) {
  const z = normalizeZipInput(userZip);
  return [...list].sort((a, b) => {
    const ra = proximityRank(a, z);
    const rb = proximityRank(b, z);
    if (ra !== rb) return ra - rb;

    const fa = isFeaturedActive(a) ? 0 : 1;
    const fb = isFeaturedActive(b) ? 0 : 1;
    if (fa !== fb) return fa - fb;

    return String(a.name ?? "").localeCompare(String(b.name ?? ""));
  });
}

function computeProvidersForModality(modalityId: ModalityId, filters: Filters) {
  const modalityOnly = PROVIDERS.filter((p) =>
    p.modalities?.includes(modalityId)
  );

  const z = normalizeZipInput(filters.zip);
  const mode = zipMode(z);

  // ✅ don't show starter lists until user "searches"
  const searchReady = hasUserSearched(filters);
  if (!searchReady) {
    return {
      filtered: [] as Provider[],
      featured: [] as Provider[],
      shown: [] as Provider[],
      zipMode: mode,
      hasExactZip: false,
      fallbackLevel: "none" as FallbackLevel,
      fallbackShown: [] as Provider[],
      effectiveTotal: 0,
      effectiveShownCount: 0,
      searchReady: false as const,
    };
  }

  function strictMatch(p: Provider) {
    if (filters.acceptingOnly && !p.acceptingNewClients) return false;
    if (filters.telehealthOnly && !p.telehealth) return false;
    if (!matchesInsurance(p.insurance, filters.insurance)) return false;
    if (!matchesLanguage(p, filters.language)) return false;
    return true;
  }

  const strictBase = modalityOnly.filter(strictMatch);
  const strictSorted = sortProviders(strictBase, z);

  let hasExactZip = false;
  if (mode === "exact5") {
    const z5 = normalizeZipInput(z);
    hasExactZip = strictSorted.some((p) => normalizeZipInput(p.zip) === z5);
  }

  const featured = strictSorted
    .filter((p) => isFeaturedActive(p))
    .sort((a, b) => (a.featuredRank ?? 9999) - (b.featuredRank ?? 9999))
    .slice(0, 3);

  const featuredIds = new Set(featured.map((p) => p.id));
  const organic = strictSorted.filter((p) => !featuredIds.has(p.id));
  const shown = organic.slice(0, 10);

  let fallbackLevel: FallbackLevel = "none";
  let fallbackSorted: Provider[] = [];

  if (strictSorted.length === 0) {
    const relaxedInsurance = modalityOnly.filter((p) => {
      if (filters.acceptingOnly && !p.acceptingNewClients) return false;
      if (filters.telehealthOnly && !p.telehealth) return false;
      if (!matchesLanguage(p, filters.language)) return false;
      return true;
    });
    fallbackSorted = sortProviders(relaxedInsurance, z);
    fallbackLevel = "relaxed_insurance";

    if (fallbackSorted.length === 0) {
      const relaxedAccepting = modalityOnly.filter((p) => {
        if (filters.telehealthOnly && !p.telehealth) return false;
        if (!matchesLanguage(p, filters.language)) return false;
        return true;
      });
      fallbackSorted = sortProviders(relaxedAccepting, z);
      fallbackLevel = "relaxed_accepting";
    }

    if (fallbackSorted.length === 0) {
      const relaxedTele = modalityOnly.filter((p) => {
        if (!matchesLanguage(p, filters.language)) return false;
        return true;
      });
      fallbackSorted = sortProviders(relaxedTele, z);
      fallbackLevel = "relaxed_telehealth";
    }

    if (fallbackSorted.length === 0) {
      fallbackSorted = sortProviders(modalityOnly, z);
      fallbackLevel = "starter_list";
    }
  }

  const fallbackShown = fallbackSorted.slice(0, 10);

  return {
    filtered: strictSorted,
    featured,
    shown,
    zipMode: mode,
    hasExactZip,
    fallbackLevel,
    fallbackShown,
    effectiveTotal: strictSorted.length || fallbackSorted.length,
    effectiveShownCount: strictSorted.length
      ? shown.length + featured.length
      : fallbackShown.length,
    searchReady: true as const,
  };
}

/* -----------------------------
   Email modal (simple + safe)
------------------------------ */

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

// ✅ FIX: make close button fixed so it cannot be clipped/hidden
function CloseXButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      title="Close"
      className="fixed right-6 top-6 z-[10002] grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-2xl leading-none font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
    >
      ×
    </button>
  );
}

function EmailShortlistModal({
  onClose,
  selectedCount,
}: {
  onClose: () => void;
  selectedCount: number;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function submit() {
    const e = email.trim();
    if (!e) {
      setErrorMsg("Please enter an email address.");
      setStatus("error");
      return;
    }
    if (!isValidEmail(e)) {
      setErrorMsg("That email doesn’t look quite right.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e,
          consent: true,
          source: "provider_shortlist",
          tag: "source:provider_shortlist",
          meta: { selectedCount },
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      track("provider_shortlist_email_submit_success", { selectedCount });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      track("provider_shortlist_email_submit_failed", { selectedCount });
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl">
        <CloseXButton onClick={onClose} />

        <div className="border-b px-6 py-5 pr-16">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Save for later
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              Email me this shortlist
            </div>
            <div className="mt-1 text-sm text-slate-600">
              We’ll email you when this feature ships. (No clinical info.)
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {status === "success" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              You’re in. If confirmation emails are enabled, check your inbox.
            </div>
          ) : (
            <>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-900">
                  Email address
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                  inputMode="email"
                  autoComplete="email"
                />
              </label>

              {status === "error" && errorMsg ? (
                <div className="mt-3 text-sm text-rose-700">{errorMsg}</div>
              ) : null}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "submitting"}
                  className={[
                    "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm",
                    status === "submitting"
                      ? "bg-slate-300 text-slate-700"
                      : "bg-emerald-700 text-white hover:bg-emerald-800",
                  ].join(" ")}
                >
                  {status === "submitting" ? "Saving…" : "Notify me"}
                </button>

                <div className="text-xs text-slate-500">
                  You can unsubscribe anytime.
                </div>
              </div>

              <div className="mt-4 text-[11px] text-slate-500">
                This is for product updates only. Please don’t include personal
                details in the email field.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProviderContactCTA({
  modalityId,
  heading = "Ready to reach out?",
  subheading,
  scrollTargetId = "providers",
  toolkitHref,
  toolkitLabel = "Need help deciding? Toolkit →",
  hideInline = false,
}: {
  modalityId: ModalityId;
  heading?: string;
  subheading?: string;
  scrollTargetId?: string;
  toolkitHref?: string;
  toolkitLabel?: string;
  hideInline?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters } = useProviderFilters();
  const [open, setOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  function stripContactParamAndHash() {
    const url = new URL(window.location.href);
    url.searchParams.delete("contact");
    url.hash = "";
    router.replace(url.pathname + (url.search ? url.search : ""), {
      scroll: false,
    });
  }

  function closeModal() {
    setOpen(false);
    setEmailModalOpen(false);
    stripContactParamAndHash();
    track("providers_contact_close", { modalityId });
  }

  useEffect(() => {
    const shouldOpen = searchParams?.get("contact") === "1";
    if (!shouldOpen) return;

    setOpen(true);
    track("providers_contact_open_from_url", { modalityId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, modalityId]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const computed = useMemo(
    () => computeProvidersForModality(modalityId, filters),
    [
      modalityId,
      filters.acceptingOnly,
      filters.telehealthOnly,
      filters.insurance,
      filters.zip,
      filters.language,
    ]
  );

  const candidates = useMemo(() => {
    if (!computed.searchReady) return [] as Provider[];
    const strict = [...computed.featured, ...computed.shown].slice(0, 10);
    if (strict.length) return strict;
    return computed.fallbackShown.slice(0, 10);
  }, [
    computed.searchReady,
    computed.featured,
    computed.shown,
    computed.fallbackShown,
  ]);

  const defaultSelected = useMemo(() => {
    if (!computed.searchReady) return [] as string[];
    return candidates.slice(0, 2).map((p) => p.id);
  }, [computed.searchReady, candidates]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(defaultSelected);
  }, [defaultSelected]);

  const selectedProviders = useMemo(() => {
    if (!computed.searchReady) return [] as Provider[];
    const set = new Set(selectedIds);
    return candidates.filter((p) => set.has(p.id));
  }, [computed.searchReady, candidates, selectedIds]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function openModal() {
    setOpen(true);
    track("providers_contact_open", {
      modalityId,
      preselectedCount: selectedIds.length,
    });
  }

  function scrollToProviders() {
    const el = document.getElementById(scrollTargetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    track("providers_contact_scroll_to_list", { modalityId, scrollTargetId });
  }

  const modalityLabel = MODALITY_LABELS[modalityId] ?? String(modalityId);

  const inquiryText = useMemo(() => {
    const lines: string[] = [];
    lines.push("Hi [Therapist/Office Name],");
    lines.push("");
    lines.push(
      `I’m looking for therapy in the Chicagoland area and I’m interested in ${modalityLabel}.`
    );

    if (filters.telehealthOnly) {
      lines.push("I’m currently looking for telehealth only.");
    } else {
      lines.push("I’m open to telehealth or in-person (whichever you offer).");
    }

    if (filters.zip) {
      const z = normalizeZipInput(filters.zip);
      if (z.length >= 3)
        lines.push(`My ZIP is ${z}${z.length === 3 ? "xx" : ""}.`);
    }

    if (filters.insurance.length) {
      lines.push(`Insurance: ${filters.insurance.join(", ")}.`);
    }

    lines.push("");
    lines.push(
      "My availability is generally [weekday mornings / evenings / flexible], and I’m open to [telehealth / in-person / either]."
    );
    lines.push("");
    lines.push(
      "Do you have openings? If so, I’d love to schedule a brief consultation."
    );
    lines.push("");
    lines.push("Thank you,");
    lines.push("[Your name]");
    return lines.join("\n");
  }, [filters.insurance, filters.telehealthOnly, filters.zip, modalityLabel]);

  const phoneScript = useMemo(() => {
    const lines: string[] = [];
    lines.push("Hi — my name is [Your name].");
    lines.push(
      `I’m calling to ask about therapy availability. I’m interested in ${modalityLabel}.`
    );
    if (filters.telehealthOnly)
      lines.push("I’m currently looking for telehealth only.");
    else lines.push("I’m open to telehealth or in-person.");
    if (filters.zip) {
      const z = normalizeZipInput(filters.zip);
      if (z.length >= 3)
        lines.push(`I’m near ZIP ${z}${z.length === 3 ? "xx" : ""}.`);
    }
    if (filters.insurance.length) {
      lines.push(`I have ${filters.insurance.join(", ")} insurance.`);
    }
    lines.push(
      "Are you accepting new clients? If so, what’s the best next step?"
    );
    lines.push("");
    lines.push("(It’s okay to read this word-for-word.)");
    return lines.join(" ");
  }, [filters.insurance, filters.telehealthOnly, filters.zip, modalityLabel]);

  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(inquiryText);
      track("providers_contact_copy_message", {
        modalityId,
        selectedCount: selectedIds.length,
      });
    } catch {
      track("providers_contact_copy_message_failed", { modalityId });
    }
  }

  async function copyPhoneScript() {
    try {
      await navigator.clipboard.writeText(phoneScript);
      track("providers_contact_copy_phone_script", {
        modalityId,
        selectedCount: selectedIds.length,
      });
    } catch {
      track("providers_contact_copy_phone_script_failed", { modalityId });
    }
  }

  const fallbackNote =
    !computed.searchReady
      ? "Add a ZIP (3–5 digits) and/or choose insurance to generate a shortlist."
      : computed.fallbackLevel === "none"
      ? null
      : computed.fallbackLevel === "relaxed_insurance"
      ? "No matches with insurance applied yet — showing nearby providers who offer this therapy style."
      : computed.fallbackLevel === "relaxed_accepting"
      ? "No matches with “accepting new clients” applied — showing nearby providers to help you get started."
      : computed.fallbackLevel === "relaxed_telehealth"
      ? "No matches with telehealth preference applied — showing nearby providers who offer this therapy style."
      : "Showing a starter list to help you get started.";

  return (
    <>
      {!hideInline ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Main next step
              </div>

              <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                {heading}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {subheading ??
                  `Pick 1–3 providers for ${modalityLabel}, copy a message you can send today, and use their website/contact links when you’re ready.`}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  scrollToProviders();
                  openModal();
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Contact providers →
              </button>

              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Copy inquiry script
              </button>
            </div>
          </div>

          {toolkitHref ? (
            <div className="mt-3">
              <a
                href={toolkitHref}
                className="text-xs font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-900"
                onClick={() =>
                  track("toolkit_click_inline", {
                    source: "provider_contact_cta",
                    modalityId,
                  })
                }
              >
                {toolkitLabel}
              </a>
            </div>
          ) : null}

          <div className="mt-3 text-xs text-slate-500">
            Tip: it’s normal to reach out to 2–3 providers. Response rates vary.
          </div>
        </section>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-xl">
            <CloseXButton onClick={closeModal} />

            <div className="border-b px-6 py-5 pr-16">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contact plan
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  Reach out to providers for {modalityLabel}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Step 1: choose 1–3 • Step 2: copy script • Step 3: use the
                  contact link
                </div>
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Choose providers
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Showing a short list based on your filters.
                </div>

                {fallbackNote ? (
                  <div className="mt-3 rounded-2xl border bg-slate-50 p-3 text-xs text-slate-700">
                    {fallbackNote}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-2">
                  {candidates.length ? (
                    candidates.map((p) => {
                      const checked = selectedIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={[
                            "flex items-start gap-3 rounded-2xl border p-3 transition",
                            checked
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-slate-200 bg-white hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(p.id)}
                            className="mt-1"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900">
                              {p.name}
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              {p.city}, {p.state} •{" "}
                              {p.telehealth ? "Telehealth" : "In-person"}
                              {p.acceptingNewClients ? "" : " • Not accepting"}
                            </div>
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
                      Add a ZIP (3–5 digits) and/or choose insurance to see
                      providers here.
                    </div>
                  )}
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  You can still copy the scripts even if you don’t select
                  anyone.
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Scripts to copy
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Paste into email, a contact form, or use the phone script.
                  Edit anything you want.
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-900">
                    Email script
                  </div>
                  <textarea
                    value={inquiryText}
                    readOnly
                    className="mt-2 h-36 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={copyInquiry}
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
                    >
                      Copy email
                    </button>

                    <button
                      type="button"
                      onClick={scrollToProviders}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                      View provider list
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-900">
                    Phone script
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {phoneScript}
                  </div>
                  <button
                    type="button"
                    onClick={copyPhoneScript}
                    className="mt-3 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Copy phone script
                  </button>
                </div>

                {selectedProviders.length ? (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Quick links for selected
                    </div>

                    <div className="mt-3 grid gap-2">
                      {selectedProviders.map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-col gap-2 rounded-2xl border bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900">
                              {p.name}
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              {p.city}, {p.state}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {p.intakeUrl ? (
                              <a
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                                href={p.intakeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() =>
                                  track("providers_contact_open_intake", {
                                    providerId: p.id,
                                    modalityId,
                                  })
                                }
                              >
                                Intake →
                              </a>
                            ) : null}
                            {p.website ? (
                              <a
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                                href={p.website}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                  track("providers_contact_open_website", {
                                    providerId: p.id,
                                    modalityId,
                                  });
                                  track("provider_website_clicked", {
                                    providerId: p.id,
                                    modalityId,
                                    source: "contact_modal",
                                  });
                                }}
                              >
                                Website →
                              </a>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailModalOpen(true);
                      track("provider_shortlist_email_open", {
                        modalityId,
                        selectedCount: selectedProviders.length,
                      });
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Email me this shortlist
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Back to results
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-slate-500">
                  Tip: Press <span className="font-medium">Esc</span> or click
                  outside this box to exit.
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-5">
              <div className="text-xs text-slate-500">
                Educational tool only. Provider availability changes quickly —
                please contact the office directly to confirm availability.
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {emailModalOpen ? (
        <EmailShortlistModal
          onClose={() => setEmailModalOpen(false)}
          selectedCount={selectedProviders.length}
        />
      ) : null}
    </>
  );
}

export function ProviderList({
  modalityId,
  title = "Providers",
  listId,
}: {
  modalityId: ModalityId;
  title?: string;
  listId?: string;
}) {
  const { filters } = useProviderFilters();

  const computed = useMemo(
    () => computeProvidersForModality(modalityId, filters),
    [
      modalityId,
      filters.acceptingOnly,
      filters.telehealthOnly,
      filters.insurance,
      filters.zip,
      filters.language,
    ]
  );

  // ✅ HOOK SAFETY: declare hooks BEFORE any conditional returns
  const lastNoMatchSig = useRef<string | null>(null);

  const filtered = computed.filtered;
  const featured = computed.featured;
  const shown = computed.shown;

  const usingFallback = computed.fallbackLevel !== "none";
  const fallbackShown = computed.fallbackShown;

  // Track snapshot only once user has "searched"
  useEffect(() => {
    if (!computed.searchReady) return;

    track("providers_list_snapshot", {
      modalityId,
      totalFiltered: filtered.length,
      featuredCount: featured.length,
      shownCount: Math.min(10, shown.length),
      usingFallback,
      fallbackLevel: computed.fallbackLevel,
      insuranceCount: filters.insurance.length,
      telehealthOnly: filters.telehealthOnly,
      acceptingOnly: filters.acceptingOnly,
      language: filters.language,
      zipLen: normalizeZipInput(filters.zip).length,
      zipMode: zipMode(filters.zip),
      zipPrefix3: zipPrefix3(filters.zip) || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    computed.searchReady,
    modalityId,
    filtered.length,
    featured.length,
    shown.length,
    usingFallback,
    computed.fallbackLevel,
    filters.insurance.length,
    filters.telehealthOnly,
    filters.acceptingOnly,
    filters.language,
    filters.zip,
  ]);

  useEffect(() => {
    if (!computed.searchReady) return;

    if (filtered.length !== 0) {
      lastNoMatchSig.current = null;
      return;
    }

    const sig = JSON.stringify({
      modalityId,
      acceptingOnly: filters.acceptingOnly,
      telehealthOnly: filters.telehealthOnly,
      insuranceCount: filters.insurance.length,
      language: filters.language,
      zipMode: zipMode(filters.zip),
      zipPrefix3: zipPrefix3(filters.zip) || "",
    });

    if (lastNoMatchSig.current === sig) return;
    lastNoMatchSig.current = sig;

    track("providers_no_matches_strict", {
      modalityId,
      insuranceCount: filters.insurance.length,
      telehealthOnly: filters.telehealthOnly,
      acceptingOnly: filters.acceptingOnly,
      language: filters.language,
      zipLen: normalizeZipInput(filters.zip).length,
      zipMode: zipMode(filters.zip),
      zipPrefix3: zipPrefix3(filters.zip) || null,
      fallbackLevel: computed.fallbackLevel,
      fallbackShownCount: fallbackShown.length,
    });
  }, [
    computed.searchReady,
    filtered.length,
    modalityId,
    filters.acceptingOnly,
    filters.telehealthOnly,
    filters.insurance.length,
    filters.language,
    filters.zip,
    computed.fallbackLevel,
    fallbackShown.length,
  ]);

  // ✅ If no search yet, show prompt (safe: after hooks)
  if (!computed.searchReady) {
    return (
      <div id={listId} className="mt-6 rounded-2xl border bg-white p-4">
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="mt-3 rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
          Add a ZIP (3–5 digits) and/or choose insurance to see providers for
          this therapy style.
        </div>
      </div>
    );
  }

  const effectiveList = filtered.length ? shown : fallbackShown;
  const effectiveTotal = computed.effectiveTotal;

  const fallbackBanner =
    computed.fallbackLevel === "none"
      ? null
      : computed.fallbackLevel === "relaxed_insurance"
      ? "No matches with your insurance filter yet. Showing nearby providers who offer this therapy style."
      : computed.fallbackLevel === "relaxed_accepting"
      ? "No matches with “accepting new clients” applied. Showing nearby providers to help you get started."
      : computed.fallbackLevel === "relaxed_telehealth"
      ? "No matches with telehealth preference applied. Showing nearby providers who offer this therapy style."
      : "Showing a starter list to help you get started.";

  return (
    <div id={listId} className="mt-6 rounded-2xl border bg-white p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">
          Showing{" "}
          {Math.min(
            effectiveList.length + (filtered.length ? featured.length : 0),
            10 + (filtered.length ? featured.length : 0)
          )}{" "}
          of {effectiveTotal}
        </div>
      </div>

      {fallbackBanner ? (
        <div className="mt-3 rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
          {fallbackBanner}
        </div>
      ) : null}

      <div className="mt-3 grid gap-3">
        {filtered.length && featured.length ? (
          <div className="rounded-xl border bg-white p-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Featured
            </div>
            <div className="mt-2 grid gap-3">
              {featured.map((p) => (
                <ProviderCard
                  key={p.id}
                  p={p}
                  modalityId={modalityId}
                  userZip={filters.zip}
                />
              ))}
            </div>
          </div>
        ) : null}

        {effectiveList.length ? (
          effectiveList.map((p) => (
            <ProviderCard
              key={p.id}
              p={p}
              modalityId={modalityId}
              userZip={filters.zip}
            />
          ))
        ) : (
          // ✅ Clean, intentional empty-state when directory has 0 providers
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="text-sm font-medium text-slate-900">
              Provider directory launching soon
            </div>

            <div className="mt-2 text-sm text-slate-700">
              TherapyFit is building a verified Chicagoland provider network.
              Listings are being reviewed for accuracy and availability.
            </div>

            <div className="mt-3 text-xs text-slate-500">
              In the meantime, you can still use the contact scripts above to
              reach out to providers independently.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
