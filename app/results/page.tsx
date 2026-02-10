// app/results/page.tsx
import React, { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-4xl px-6 py-14">
            <div className="rounded-3xl border bg-white p-10 shadow-sm">
              <div className="text-sm text-slate-600">Loading your results…</div>
            </div>
          </div>
        </main>
      }
    >
      <ResultsClient />
    </Suspense>
  );
}
