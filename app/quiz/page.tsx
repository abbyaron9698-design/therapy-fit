// app/quiz/page.tsx
import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
                Loading…
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Preparing the quiz
              </h1>
              <p className="mt-2 text-slate-600">One moment.</p>
            </div>
          </div>
        </main>
      }
    >
      <QuizClient />
    </Suspense>
  );
}
