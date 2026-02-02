export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            How Therapy Fit works
          </h1>

          <p className="mt-4 text-slate-700">
            Therapy Fit turns your answers into a few starting-point therapy
            matches, then helps you filter providers and take next steps.
          </p>

          <div className="mt-8 grid gap-6">
            <section className="rounded-2xl border bg-slate-50 p-6">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Step 1
              </div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                Answer quick Tier 1 questions
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                These focus on patterns (avoidance, overwhelm, trauma reminders,
                body-first anxiety) and preferences (tools vs. exploration,
                creative expression, group support).
              </p>
            </section>

            <section className="rounded-2xl border bg-slate-50 p-6">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Step 2 (optional)
              </div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                Go deeper with Tier 2
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                If you want, you can take an “Advanced” quiz that refines the
                signal in specific lanes (e.g., OCD/ERP vs. general anxiety,
                trauma processing readiness, body-based vs. cognitive).
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href="/quiz"
                  className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  Tier 1 quiz →
                </a>
                <a
                  href="/quiz/advanced"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Advanced (Tier 2) →
                </a>
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Step 3
              </div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">
                Get results you can act on
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Top matches (usually 3) with short reasons.</li>
                <li>
                  Provider filters like ZIP, insurance, telehealth, accepting
                  new clients.
                </li>
                <li>Helpful extras like parking/directions links when available.</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 rounded-2xl border bg-slate-50 p-6 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Important note</p>
            <p className="mt-2">
              Therapy Fit is educational. It doesn’t diagnose, treat, or replace
              professional care. If you need urgent help, use{" "}
              <a
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
                href="/crisis"
              >
                Crisis Support
              </a>
              .
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              About →
            </a>

            <a
              href="/support"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Support beyond therapy →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
