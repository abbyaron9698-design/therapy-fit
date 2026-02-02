// app/toolkit/success/page.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "../../../lib/analytics";

function safeStr(v: string | null) {
  return (v ?? "").toString();
}

export default function ToolkitSuccessPage() {
  const sp = useSearchParams();

  const method = safeStr(sp.get("method")) || "skip"; // "email" | "skip"
  const amountStr = safeStr(sp.get("amount"));
  const focus = safeStr(sp.get("focus"));
  const profile = safeStr(sp.get("profile"));
  const src = safeStr(sp.get("src")) || "toolkit_success";

  const amount = amountStr ? Number(amountStr) : null;

  const downloadHref = useMemo(() => {
    return "/toolkit/TherapyFit-Decision-Toolkit.pdf";
  }, []);

  const backToToolkitHref = useMemo(() => {
    const q = new URLSearchParams();
    if (focus) q.set("focus", focus);
    if (profile) q.set("profile", profile);
    if (src) q.set("src", src);
    const qs = q.toString();
    return qs ? `/toolkit?${qs}` : "/toolkit";
  }, [focus, profile, src]);

  useEffect(() => {
    track("toolkit_success_view", {
      src,
      method,
      amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
      focus: focus || null,
      profile: profile || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Success
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            You’re all set.
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {method === "email"
              ? "We saved your email and sent you a copy (if delivery is enabled)."
              : "You can always download it again here anytime."}
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
            <div className="text-sm font-semibold text-slate-900">Download again</div>
            <p className="mt-2 text-sm text-slate-700">
              If you’re on mobile, it may open in a new tab. Save it to Files/Drive for later.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={downloadHref}
                download
                className="
                  inline-flex items-center justify-center
                  rounded-2xl px-5 py-3
                  text-sm font-semibold
                  bg-emerald-700 text-white
                  shadow-sm transition
                  hover:bg-emerald-800
                  focus:outline-none focus:ring-2 focus:ring-emerald-300
                "
                onClick={() =>
                  track("toolkit_success_download_click", {
                    src,
                    amount: typeof amount === "number" && Number.isFinite(amount) ? amount : null,
                  })
                }
              >
                Download the PDF →
              </a>

              <Link
                href={backToToolkitHref}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Back to toolkit page
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Next step (recommended)</div>
            <p className="mt-2 text-sm text-slate-700">
              Pick 3 questions from the toolkit and bring them to your next consult. That’s enough to make progress.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                onClick={() => track("toolkit_success_click_quiz", { src })}
              >
                Take the quiz →
              </Link>

              <Link
                href="/providers"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
                onClick={() => track("toolkit_success_click_providers", { src })}
              >
                Browse providers →
              </Link>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-500">
            Educational only; not medical or crisis support.
          </p>
        </div>
      </div>
    </main>
  );
}
