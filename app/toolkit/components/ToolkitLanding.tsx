// app/toolkit/components/ToolkitLanding.tsx
"use client";

import * as React from "react";
import Link from "next/link";

export default function ToolkitLanding({
  focus,
  profile,
}: {
  focus?: string;
  profile?: string;
}) {
  const focusLabel = (focus ?? "").replace(/-/g, " ").trim();
  const profileLabel = (profile ?? "").trim();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Decision Toolkit
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        Preview what’s inside
      </h1>

      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Scripts • red flags • consult questions • decision map — designed to help you
        choose and collaborate with a therapist with less guesswork.
      </p>

      {(focusLabel || profileLabel) ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          {focusLabel ? (
            <div>
              <strong>Focus:</strong> {focusLabel}
            </div>
          ) : null}
          {profileLabel ? (
            <div>
              <strong>Style:</strong> {profileLabel}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="/checkout?product=toolkit"
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Get the Toolkit (PWYC) →
        </a>

        <Link
          href="/toolkit/download?unlocked=1&amount=0"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
        >
          See the download flow →
        </Link>
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Educational only; not medical, legal, or crisis support.
      </p>
    </div>
  );
}
