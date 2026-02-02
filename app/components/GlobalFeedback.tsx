// app/components/GlobalFeedback.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
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

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {isHome ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Spot something confusing, missing, or wrong?
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Send feedback — it helps us make Therapy Fit clearer.
                </p>
              </div>

              <details className="w-full sm:w-auto">
                <summary className="list-none">
                  <span className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-100 sm:w-auto">
                    Send feedback →
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
                  Educational only; this feedback form is not monitored for emergencies.
                </p>
              </details>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm sm:p-8">
            <div className="text-sm font-semibold text-slate-900">
              Help us improve this page
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Spot something confusing, missing, or wrong? Tell us — it helps improve the site.
            </p>

            <div className="mt-5">
              <FeedbackPanel
                context={{
                  page,
                  sectionId: "global-footer",
                  sectionTitle,
                  slug: pathname,
                }}
              />
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Educational only; this feedback form is not monitored for emergencies.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
