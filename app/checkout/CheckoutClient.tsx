// app/checkout/CheckoutClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { track } from "../../lib/analytics";

function dollars(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n}`;
  }
}

type Preset = { label: string; value: number; helper?: string };

const PRESETS: Preset[] = [
  { label: "$0", value: 0, helper: "Free access" },
  { label: "$5", value: 5, helper: "Low budget" }, // ✅ changed from $9
  { label: "$10", value: 10, helper: "Standard" },
  { label: "$20", value: 20, helper: "Sponsor access" },
];

type Attrib = {
  product?: string;
  src?: string;
  focus?: string;
  profile?: string;
  amount?: number;
  utm?: Record<string, string>;
  ts?: string;
};

function readAttrib(): Attrib | null {
  try {
    const raw = sessionStorage.getItem("tf_attrib");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Attrib;
  } catch {
    return null;
  }
}

function writeAttrib(patch: Partial<Attrib>) {
  try {
    const cur = readAttrib() ?? {};
    const next: Attrib = {
      ...cur,
      ...patch,
      ts: new Date().toISOString(),
    };
    sessionStorage.setItem("tf_attrib", JSON.stringify(next));
  } catch {
    // no-op
  }
}

export default function CheckoutClient({
  product,
  focus,
  profile,
  src,
  initialAmount = 19,
}: {
  product: string;
  focus?: string;
  profile?: string;
  src?: string;
  initialAmount?: number;
}) {
  // Pull fallback attribution if params are missing
  const attrib = React.useMemo(() => readAttrib(), []);
  const effSrc = (src && src.trim()) || attrib?.src || "unknown";
  const effFocus = (focus && focus.trim()) || attrib?.focus || "";
  const effProfile = (profile && profile.trim()) || attrib?.profile || "";

  const [amount, setAmount] = React.useState<number>(() => {
    // Prefer query param initialAmount; otherwise fall back to attrib amount; else default
    if (Number.isFinite(initialAmount)) return initialAmount;
    if (typeof attrib?.amount === "number" && Number.isFinite(attrib.amount)) return attrib.amount;
    return 19;
  });

  const title = product === "toolkit" ? "TherapyFit Decision Toolkit" : "TherapyFit";

  const subtitle = React.useMemo(() => {
    const bits: string[] = [];
    if (effFocus) bits.push(`Focus: ${effFocus.replace(/-/g, " ")}`);
    if (effProfile) bits.push(`Style: ${effProfile}`);
    return bits.length ? bits.join(" • ") : "Pay what you can. Same toolkit either way.";
  }, [effFocus, effProfile]);

  const backToToolkitHref = React.useMemo(() => {
    const q = new URLSearchParams();
    if (effFocus) q.set("focus", effFocus);
    if (effProfile) q.set("profile", effProfile);
    if (effSrc) q.set("src", effSrc);
    const qs = q.toString();
    return qs ? `/toolkit?${qs}` : "/toolkit";
  }, [effFocus, effProfile, effSrc]);

  // Track view once
  React.useEffect(() => {
    track("checkout_view", {
      product,
      src: effSrc,
      focus: effFocus || null,
      profile: effProfile || null,
      initialAmount,
      hasAttrib: Boolean(attrib),
      hasUtm: Boolean(attrib?.utm && Object.keys(attrib.utm).length),
    });

    // Persist effective attribution forward
    writeAttrib({
      product,
      src: effSrc,
      focus: effFocus || undefined,
      profile: effProfile || undefined,
      amount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep latest amount in attribution
  React.useEffect(() => {
    writeAttrib({ amount });
  }, [amount]);

  function goToDownload(unlockedAmount: number) {
    track("checkout_unlock_click", {
      product,
      src: effSrc,
      focus: effFocus || null,
      profile: effProfile || null,
      amount: unlockedAmount,
    });

    const q = new URLSearchParams();
    q.set("unlocked", "1");
    q.set("amount", String(unlockedAmount));
    if (effFocus) q.set("focus", effFocus);
    if (effProfile) q.set("profile", effProfile);
    if (effSrc) q.set("src", effSrc);

    // Persist final chosen amount before leaving
    writeAttrib({ amount: unlockedAmount });

    window.location.href = `/toolkit/download?${q.toString()}`;

    track("checkout_unlock_redirect", {
      product,
      src: effSrc,
      amount: unlockedAmount,
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Checkout
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm font-semibold text-slate-900">Choose your price</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Pay what you can. You’ll get the same toolkit either way.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PRESETS.map((p) => {
                const active = amount === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      setAmount(p.value);
                      track("checkout_select_preset", {
                        product,
                        src: effSrc,
                        preset: p.value,
                      });
                    }}
                    className={[
                      "rounded-2xl border p-4 text-left transition shadow-sm",
                      active
                        ? "border-slate-900 bg-white"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font note-semibold text-slate-900">{p.label}</div>
                      <div className="text-sm text-slate-700">{dollars(p.value)}</div>
                    </div>
                    {p.helper ? (
                      <div className="mt-2 text-xs text-slate-600">{p.helper}</div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="text-sm text-slate-700">Custom:</label>
              <input
                type="number"
                min={0}
                step={1}
                value={Number.isFinite(amount) ? amount : 0}
                onChange={(e) => {
                  const next = Math.max(0, Math.floor(Number(e.target.value) || 0));
                  setAmount(next);
                  track("checkout_custom_change", {
                    product,
                    src: effSrc,
                    amount: next,
                  });
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 sm:w-40"
              />
              <div className="text-xs text-slate-600">USD</div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => goToDownload(amount)}
                className="
                  inline-flex items-center justify-center
                  rounded-2xl px-5 py-3
                  text-sm font-semibold
                  bg-emerald-700 text-white
                  shadow-sm transition
                  hover:bg-emerald-800
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                "
              >
                Unlock &amp; download →
              </button>

              <Link
                href={backToToolkitHref}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Back to toolkit
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Educational only; not medical or legal advice.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
