// app/toolkit/download/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "../../../lib/analytics"; // ✅ FIXED PATH

function normalizeEmail(s: string) {
  return (s ?? "").trim().toLowerCase();
}

function safeStr(v: string | null) {
  return (v ?? "").toString();
}

export default function ToolkitDownloadPage() {
  const sp = useSearchParams();

  const unlocked = sp.get("unlocked") === "1";
  const amountStr = safeStr(sp.get("amount"));
  const focus = safeStr(sp.get("focus"));
  const profile = safeStr(sp.get("profile"));
  const src = safeStr(sp.get("src")) || "toolkit_download";

  const amount = amountStr ? Number(amountStr) : null;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const downloadHref = useMemo(() => {
    return "/toolkit/TherapyFit-Decision-Toolkit.pdf";
  }, []);

  useEffect(() => {
    track("toolkit_download_view", {
      src,
      unlocked,
      amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
      focus: focus || null,
      profile: profile || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goSuccess(method: "email" | "skip") {
    const q = new URLSearchParams();
    q.set("method", method);
    if (typeof amount === "number" && Number.isFinite(amount)) q.set("amount", String(amount));
    if (focus) q.set("focus", focus);
    if (profile) q.set("profile", profile);
    if (src) q.set("src", src);
    window.location.href = `/toolkit/success?${q.toString()}`;
  }

  async function submitEmail() {
    const e = normalizeEmail(email);

    track("toolkit_email_submit_attempt", {
      src,
      unlocked,
      amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
    });

    if (!e || !e.includes("@")) {
      setStatus("error");
      track("toolkit_email_submit_failed", { src, reason: "invalid_email" });
      return;
    }

    setStatus("saving");
    try {
      const res = await fetch("/api/toolkit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e,
          unlocked,
          amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
          focus: focus || null,
          profile: profile || null,
          source: src || "toolkit_download",
        }),
      });

      if (!res.ok) throw new Error("bad_status");

      setStatus("saved");
      track("toolkit_email_submit_success", {
        src,
        unlocked,
        amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
      });

      goSuccess("email");
    } catch {
      setStatus("error");
      track("toolkit_email_submit_failed", { src, reason: "request_failed" });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Toolkit delivery
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            Your toolkit is ready.
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Download it now. If you want, enter your email and we’ll send you a copy so you don’t lose it.
          </p>

          {(focus || profile || amountStr) && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
              {focus ? (
                <div>
                  <strong>Focus:</strong> {focus.replace(/-/g, " ")}
                </div>
              ) : null}
              {profile ? (
                <div>
                  <strong>Style:</strong> {profile}
                </div>
              ) : null}
              {amountStr ? (
                <div className="text-slate-600">
                  PWYC selected: <strong>${amountStr}</strong>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Decision Toolkit (PDF)
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Scripts • Red flags • Consult questions • Decision map
                </div>
              </div>

              <a
                href={downloadHref}
                className="
                  inline-flex items-center justify-center
                  rounded-2xl px-5 py-3
                  text-sm font-semibold
                  bg-emerald-700 text-white
                  shadow-sm transition
                  hover:bg-emerald-800
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                "
                download
                onClick={() =>
                  track("toolkit_download_click", {
                    src,
                    amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
                  })
                }
              >
                Download now →
              </a>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="text-sm font-semibold text-slate-900">Send me a copy</div>
              <p className="mt-2 text-sm text-slate-700">
                Optional. You’ll also receive occasional updates if you opt in later.
              </p>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  inputMode="email"
                  autoComplete="email"
                />
                <button
                  type="button"
                  onClick={submitEmail}
                  disabled={status === "saving" || status === "saved"}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Send"}
                </button>
              </div>

              {status === "error" ? (
                <p className="mt-2 text-xs text-red-600">
                  Something didn’t work — double-check the email and try again.
                </p>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    track("toolkit_email_skip", { src });
                    goSuccess("skip");
                  }}
                  className="text-xs font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-900"
                >
                  Skip this step →
                </button>

                <div className="text-[11px] text-slate-500">
                  Please don’t include personal details in the email field.
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-500">
            Educational only; not medical advice. If you’re in crisis, use the Crisis page for urgent options.
          </p>
        </div>
      </div>
    </main>
  );
}
