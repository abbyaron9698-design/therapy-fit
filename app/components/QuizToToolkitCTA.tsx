// app/components/QuizToToolkitCTA.tsx
"use client";

import React, { useMemo } from "react";
import { track } from "../../lib/analytics";

type Props = {
  focus?: string;
  profileLabel?: string;
  source?: "quiz_results" | "quiz_result_card" | "page";
};

function buildToolkitHref({
  focus,
  profileLabel,
  source,
}: {
  focus?: string;
  profileLabel?: string;
  source?: string;
}) {
  const params = new URLSearchParams();
  if (focus) params.set("focus", focus);
  if (profileLabel) params.set("profile", profileLabel);
  if (source) params.set("src", source); // ✅ attribution
  const qs = params.toString();
  return qs ? `/toolkit?${qs}` : "/toolkit";
}

function buildCheckoutHref({
  focus,
  profileLabel,
  source,
}: {
  focus?: string;
  profileLabel?: string;
  source?: string;
}) {
  const params = new URLSearchParams();
  params.set("product", "toolkit");
  if (focus) params.set("focus", focus);
  if (profileLabel) params.set("profile", profileLabel);
  if (source) params.set("src", source);
  return `/checkout?${params.toString()}`;
}

export function QuizToToolkitCTA({ focus, profileLabel, source = "quiz_results" }: Props) {
  const toolkitHref = useMemo(
    () => buildToolkitHref({ focus, profileLabel, source }),
    [focus, profileLabel, source]
  );

  const checkoutHref = useMemo(
    () => buildCheckoutHref({ focus, profileLabel, source }),
    [focus, profileLabel, source]
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Optional support tool
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
          Decision Toolkit: pick a therapist with less guesswork
        </h3>

        <p className="max-w-3xl text-sm leading-relaxed text-slate-700">
          A practical toolkit that helps you <strong>choose</strong>, <strong>evaluate</strong>, and{" "}
          <strong>collaborate with your therapist</strong> — with scripts, red flags, and a short
          decision map.
          {focus ? (
            <>
              {" "}
              Tailored to what you shared about{" "}
              <strong className="capitalize">{focus.replace(/-/g, " ")}</strong>.
            </>
          ) : null}
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <a
            href={checkoutHref}
            onClick={() =>
              track("toolkit_cta_checkout_click", {
                source,
                focus: focus ?? null,
                profileLabel: profileLabel ?? null,
              })
            }
            className="
              inline-flex items-center justify-center
              rounded-2xl px-5 py-3
              text-sm font-semibold
              bg-emerald-600 text-white
              shadow-sm transition
              hover:bg-emerald-700
              focus:outline-none focus:ring-2 focus:ring-emerald-300
            "
          >
            Get the Toolkit (PWYC) →
          </a>

          <a
            href={toolkitHref}
            onClick={() =>
              track("toolkit_cta_preview_click", {
                source,
                focus: focus ?? null,
                profileLabel: profileLabel ?? null,
              })
            }
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Preview what’s inside →
          </a>
        </div>

        <p className="text-xs text-slate-600">
          PWYC = pay what you can. You’ll get the same toolkit either way.{" "}
          <span className="text-slate-500">
            Proceeds help fund Therapy Fit and support access-first improvements for the community.
          </span>
        </p>
      </div>
    </section>
  );
}
