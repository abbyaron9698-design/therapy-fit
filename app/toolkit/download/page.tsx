// app/toolkit/download/page.tsx
import { Suspense } from "react";
import ToolkitDownloadClient from "./client";

export default function ToolkitDownloadPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Toolkit delivery
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Loading…
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Preparing your download.
              </p>
            </div>
          </div>
        </main>
      }
    >
      <ToolkitDownloadClient />
    </Suspense>
  );
}
