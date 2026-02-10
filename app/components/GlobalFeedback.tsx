// app/components/GlobalFeedback.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FeedbackPanel } from "./FeedbackPanel";

function sectionTitleFromPath(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/therapies")) return "Therapy styles";
  if (pathname.startsWith("/credentials")) return "Credentials & training";
  if (pathname.startsWith("/support")) return "Support & services";
  if (pathname.startsWith("/questions")) return "Common therapy questions";
  if (pathname.startsWith("/quiz")) return "Therapy quiz";
  if (pathname.startsWith("/providers")) return "Provider directory";
  if (pathname.startsWith("/toolkit")) return "Decision toolkit";
  if (pathname.startsWith("/checkout")) return "Checkout";
  if (pathname.startsWith("/results")) return "Results";
  if (pathname.startsWith("/feedback")) return "Feedback";
  return "Page";
}

function pageKeyFromPath(pathname: string) {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "").split("/")[0] || "page";
}

export function GlobalFeedback() {
  const pathname = usePathname() || "/";
  const page = pageKeyFromPath(pathname);
  const sectionTitle = sectionTitleFromPath(pathname);
  const isHome = pathname === "/";

  const headerTitle = isHome
    ? "Help us make Therapy Fit clearer"
    : "Quick page feedback";

  const bodyText = isHome
    ? "We’re collecting feedback on clarity, tone, and emotional experience — not feature requests."
    : "Spot something confusing or emotionally “off”? We’re collecting clarity + tone notes (not feature requests).";

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold text-slate-900">
                {headerTitle}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {bodyText}
              </p>

              <div className="mt-3 text-xs text-slate-600">
                Prefer a longer form?{" "}
                <Link
                  href="/feedback"
                  className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                >
                  Use the /feedback page →
                </Link>
              </div>
            </div>

            {/* On home we keep the "details" pattern; on other pages we just show the panel */}
            {isHome ? (
              <details className="w-full sm:w-auto">
                <summary className="list-none">
                  <span className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-100 sm:w-auto">
                    Send quick feedback →
                  </span>
                </summary>

                <div className="mt-4">
                  <FeedbackPanel
                    context={{
                      page,
                      sectionId: "global-footer",
                      sectionTitle,
                      slug: pathname,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Educational only; not monitored for emergencies.
                </p>
              </details>
            ) : (
              <div className="mt-2 w-full sm:mt-0 sm:max-w-md">
                <FeedbackPanel
                  context={{
                    page,
                    sectionId: "global-footer",
                    sectionTitle,
                    slug: pathname,
                  }}
                />

                <p className="mt-3 text-xs text-slate-500">
                  Educational only; not monitored for emergencies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
