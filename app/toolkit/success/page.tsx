// app/toolkit/success/page.tsx
import { Suspense } from "react";
import ToolkitSuccessClient from "./client";

export default function ToolkitSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <h1 className="text-2xl font-semibold text-slate-900">Loading…</h1>
              <p className="mt-2 text-sm text-slate-700">Preparing your next steps.</p>
            </div>
          </div>
        </main>
      }
    >
      <ToolkitSuccessClient />
    </Suspense>
  );
}
