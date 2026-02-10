// app/components/ProviderBrowser.tsx
"use client";

import { useMemo, useState } from "react";
import { PROVIDERS, type Provider } from "../../lib/providerData";
import {
  LANGUAGE_OPTIONS,
  type LanguageOption,
  providerLanguages,
} from "../../lib/languages";

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function normalizeZipInput(raw: string) {
  return (raw ?? "").replace(/[^\d]/g, "").slice(0, 5);
}

export default function ProviderBrowser({ title }: { title?: string }) {
  const [zip, setZip] = useState("");
  const [insurance, setInsurance] = useState("Any");
  const [language, setLanguage] = useState<LanguageOption>("Any");
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [acceptingOnly, setAcceptingOnly] = useState(true);

  const insuranceOptions = useMemo(() => {
    const ins = PROVIDERS.flatMap((p: Provider) => p.insurance ?? []);
    return ["Any", ...uniq(ins).sort((a, b) => a.localeCompare(b))];
  }, []);

  const languageOptions = useMemo(() => {
    const known = new Set<string>(LANGUAGE_OPTIONS as readonly string[]);
    const providerLangs = PROVIDERS.flatMap((p: Provider) => providerLanguages(p));
    const extras = uniq(providerLangs)
      .filter((l): l is string => Boolean(l))
      .filter((l) => !known.has(l))
      .sort((a, b) => a.localeCompare(b));

    return [...LANGUAGE_OPTIONS, ...(extras as unknown as LanguageOption[])] as LanguageOption[];
  }, []);

  const filtered = useMemo(() => {
    const z = normalizeZipInput(zip);
    const z3 = z.length >= 3 ? z.slice(0, 3) : "";

    return PROVIDERS.filter((p: Provider) => {
      if (acceptingOnly && !p.acceptingNewClients) return false;
      if (telehealthOnly && !p.telehealth) return false;

      if (insurance !== "Any" && !(p.insurance ?? []).includes(insurance)) return false;

      if (language !== "Any") {
        const langs = providerLanguages(p);
        if (!langs.includes(language)) return false;
      }

      if (z.length >= 3) {
        if (!String(p.zip ?? "").startsWith(z3)) return false;
      }

      return true;
    }).slice(0, 12);
  }, [zip, insurance, language, telehealthOnly, acceptingOnly]);

  function clear() {
    setZip("");
    setInsurance("Any");
    setLanguage("Any");
    setTelehealthOnly(false);
    setAcceptingOnly(true);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title ?? "Browse providers"}</h1>
            <p className="mt-1 text-sm text-slate-600">
              Filters are best effort while we grow the directory. ZIP uses first 3 digits (e.g., 606xx).
            </p>
          </div>

          <button
            type="button"
            onClick={clear}
            className="w-fit rounded-xl border px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Clear filters
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">ZIP</span>
            <input
              value={zip}
              onChange={(e) => setZip(normalizeZipInput(e.target.value))}
              placeholder="e.g., 60614"
              className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
              inputMode="numeric"
            />
            <span className="text-[11px] text-slate-500">Type 3–5 digits</span>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Insurance</span>
            <select
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              {insuranceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageOption)}
              className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              {languageOptions.map((opt) => (
                <option key={String(opt)} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
            <input
              type="checkbox"
              checked={telehealthOnly}
              onChange={(e) => setTelehealthOnly(e.target.checked)}
            />
            <span className="text-sm text-slate-700">Telehealth only</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
            <input
              type="checkbox"
              checked={acceptingOnly}
              onChange={(e) => setAcceptingOnly(e.target.checked)}
            />
            <span className="text-sm text-slate-700">Accepting new clients</span>
          </label>
        </div>

        <div className="mt-4 grid gap-3">
          {filtered.length ? (
            filtered.map((p: Provider) => (
              <div key={p.id} className="rounded-xl border bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">{p.name}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {p.city} • {p.zip} • {p.telehealth ? "Telehealth" : "In-person"}
                  {p.acceptingNewClients ? "" : " • Not accepting"}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Insurance: {(p.insurance ?? []).join(", ") || "Not listed"}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Language: {providerLanguages(p).join(", ")}
                </div>

                {p.website ? (
                  <a
                    className="mt-2 inline-block text-sm underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                    href={p.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Website →
                  </a>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
              No matches with these filters yet. Try removing insurance, language, or ZIP filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
