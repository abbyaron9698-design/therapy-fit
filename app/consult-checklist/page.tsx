// app/consult-checklist/page.tsx
import { ConsultChecklistCard } from "../components/ConsultChecklistCard";

export const metadata = {
  title: "Therapy Consult Checklist • Therapy Fit",
  description:
    "A quick, practical checklist for a 10–15 minute therapy consult (fit, approach, and cost).",
};

export default function ConsultChecklistPage() {
  return (
    <main className="min-h-screen bg-brand-gradient">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Checklist
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Consult checklist
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Early therapy can feel awkward—this is just a quick check for fit, clarity, and enough safety to continue.
          </p>

          <div className="mt-8">
            <ConsultChecklistCard variant="interactive" density="normal" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/consult-checklist/print"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Print / Save as PDF →
            </a>
            <a
              href="/questions"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Back to questions →
            </a>
          </div>

          <p className="mt-10 text-xs text-slate-500">
            Educational only.
          </p>
        </div>
      </div>
    </main>
  );
}
