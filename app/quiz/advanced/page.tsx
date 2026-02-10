// app/quiz/advanced/page.tsx
import { Suspense } from "react";
import AdvancedQuizClient from "./AdvancedQuizClient";

export default function AdvancedQuizPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
                Advanced • Tier 2 • ~2–4 minutes
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Loading…
              </h1>
              <p className="mt-2 text-slate-600">Preparing the advanced quiz.</p>
            </div>
          </div>
        </main>
      }
    >
      <AdvancedQuizClient />
    </Suspense>
  );
}
