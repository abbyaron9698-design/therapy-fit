// app/toolkit/components/PWYCPriceCard.tsx
"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type PWYCPreset = {
  label: string;
  value: number;
  helper?: string;
};

export function PWYCPriceCard({
  title,
  subtitle,
  presets,
  defaultValue = 0,
  ctaLabel = "Continue →",
  onContinue,
  onSelect, // optional analytics hook
}: {
  title: string;
  subtitle?: string;
  presets: PWYCPreset[];
  defaultValue?: number;
  ctaLabel?: string;
  onContinue: (amount: number) => void;
  onSelect?: (amount: number, mode: "preset" | "custom") => void;
}) {
  const [mode, setMode] = React.useState<"preset" | "custom">("preset");
  const [selected, setSelected] = React.useState<number>(defaultValue);
  const [custom, setCustom] = React.useState<string>(String(defaultValue));
  const [error, setError] = React.useState<string | null>(null);

  function parseAmount(raw: string): number | null {
    const cleaned = (raw ?? "").replace(/[^\d]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.floor(n));
  }

  function currentAmount(): number {
    if (mode === "preset") return Number.isFinite(selected) ? selected : 0;
    const parsed = parseAmount(custom);
    return parsed ?? 0;
  }

  function choosePreset(v: number) {
    setSelected(v);
    setCustom(String(v)); // keep in sync
    setError(null);
    onSelect?.(v, "preset");
  }

  function switchMode(next: "preset" | "custom") {
    setMode(next);
    setError(null);

    // if switching to custom and custom is empty, seed it
    if (next === "custom") {
      const parsed = parseAmount(custom);
      if (parsed == null) setCustom(String(currentAmount()));
    }
  }

  function handleContinue() {
    if (mode === "custom") {
      const parsed = parseAmount(custom);
      if (parsed == null) {
        setError("Enter an amount (or choose a tier).");
        return;
      }
      onSelect?.(parsed, "custom");
      setError(null);
      onContinue(parsed);
      return;
    }

    // preset
    setError(null);
    onContinue(currentAmount());
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
          Pay what you can
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => switchMode("preset")}
          className={cn(
            "rounded-2xl border px-3 py-2 text-sm font-medium transition",
            mode === "preset"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          )}
          aria-pressed={mode === "preset"}
        >
          Choose a tier
        </button>

        <button
          type="button"
          onClick={() => switchMode("custom")}
          className={cn(
            "rounded-2xl border px-3 py-2 text-sm font-medium transition",
            mode === "custom"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          )}
          aria-pressed={mode === "custom"}
        >
          Enter custom
        </button>
      </div>

      {mode === "preset" ? (
        <div className="mt-5 grid gap-2">
          {presets.map((p) => {
            const active = p.value === selected;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => choosePreset(p.value)}
                className={cn(
                  "w-full rounded-3xl border p-4 text-left shadow-sm transition",
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                )}
                aria-pressed={active}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className={cn("text-xs", active ? "text-white/80" : "text-slate-500")}>
                    {p.helper ?? ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Custom amount</span>
            <div className="mt-2 flex items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                $
              </div>
              <input
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setError(null);
                  const parsed = parseAmount(e.target.value);
                  if (parsed != null) onSelect?.(parsed, "custom");
                }}
                inputMode="numeric"
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </label>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            $0 is always okay. If you can pay more, you help fund access for others.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-700">Your choice</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">${currentAmount()}</div>

        {error ? <p className="mt-3 text-xs font-medium text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleContinue}
          className="
            mt-4 inline-flex w-full items-center justify-center
            rounded-2xl px-4 py-3
            text-sm font-semibold text-white
            bg-emerald-600 shadow-sm transition
            hover:bg-emerald-700
            focus:outline-none focus:ring-2 focus:ring-emerald-300
          "
        >
          {ctaLabel}
        </button>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Educational only; not medical or legal advice.
        </p>
      </div>
    </div>
  );
}

export default PWYCPriceCard;
