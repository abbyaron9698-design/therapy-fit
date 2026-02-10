// app/page.tsx
import Link from "next/link";
import { StickyQuizCTA } from "./components/StickyQuizCTA";

export default function HomePage() {
  const chipClass =
    [
      "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold",
      "bg-white/90 text-slate-900 border-slate-200 shadow-sm",
      "transition hover:bg-slate-50 hover:border-slate-300",
      "focus:outline-none focus:ring-2 focus:ring-emerald-200",
    ].join(" ");

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-sky-50/40 to-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-10 shadow-sm backdrop-blur-sm sm:p-12">
          <div className="flex flex-col gap-10">
            {/* Top meta */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm font-semibold tracking-tight text-slate-900">
                  TherapyFit
                </div>

                <span className="h-4 w-px bg-slate-200" />

                <div className="text-xs text-slate-700">
                  Built for Illinois to keep credentials + local resources accurate.
                  <span className="text-slate-500"> Expansion planned.</span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="grid gap-6">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-900">
                Understand your therapy options — then choose a therapy style that fits.
              </h1>

              <p className="max-w-3xl text-lg leading-relaxed text-slate-700">
                Answer a quick questionnaire about your goals, preferences, and thought patterns.
                You’ll get 1–3 therapy approaches (CBT, DBT, EMDR, Somatic, Art Therapy) plus a clear
                next step for finding providers in Illinois.
              </p>

              {/* Primary action panel */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                {/* subtle “landmark” bar + glow so it’s visually easy to find */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300 opacity-80" />
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                      Start with the quiz (1–2 minutes).
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      This quiz doesn’t diagnose you — it gives direction. You’ll see a few strong
                      options and why they may fit.
                    </p>

                    {/* Softer steps */}
                    <ol className="mt-4 grid gap-2 text-sm text-slate-800 sm:grid-cols-3">
                      <li className="rounded-2xl bg-emerald-50/60 px-4 py-3 ring-1 ring-emerald-100">
                        <span className="font-semibold text-slate-900">1.</span> Answer a few questions
                      </li>
                      <li className="rounded-2xl bg-sky-50/60 px-4 py-3 ring-1 ring-sky-100">
                        <span className="font-semibold text-slate-900">2.</span> Get 1–3 matches + “why”
                      </li>
                      <li className="rounded-2xl bg-amber-50/60 px-4 py-3 ring-1 ring-amber-100">
                        <span className="font-semibold text-slate-900">3.</span> Contact providers (scripts included)
                      </li>
                    </ol>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <Link
                      href="/quiz"
                      className={[
                        "inline-flex items-center justify-center",
                        "rounded-2xl bg-emerald-700 px-7 py-4",
                        "text-base font-semibold text-white shadow-sm",
                        "transition hover:bg-emerald-800",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-300",
                      ].join(" ")}
                    >
                      Start the quiz →
                    </Link>

                    <div className="text-xs text-slate-600">
                      No account. No email. No commitment.
                    </div>

                    {/* Chips */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link href="/therapies" className={chipClass}>
                        Browse therapy types
                      </Link>
                      <Link href="/questions" className={chipClass}>
                        Common questions
                      </Link>
                      <Link href="/credentials" className={chipClass}>
                        Credentials &amp; licensing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div id="home-hero-end" />

              {/* Support panel */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-200 via-sky-200 to-emerald-200 opacity-80" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-3xl">
                    <div className="text-sm font-semibold text-slate-900">
                      Need support beyond therapy?
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-slate-700">
                      If life stressors, safety concerns, or access barriers are driving distress,
                      start here.
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/support"
                      className={[
                        "inline-flex items-center justify-center",
                        "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2",
                        "text-sm font-semibold text-slate-900",
                        "transition hover:bg-slate-100",
                        "focus:outline-none focus:ring-2 focus:ring-slate-200",
                      ].join(" ")}
                    >
                      Support &amp; services →
                    </Link>

                    <Link
                      href="/crisis"
                      className={[
                        "inline-flex items-center justify-center",
                        "rounded-2xl border border-red-200 bg-red-50 px-4 py-2",
                        "text-sm font-semibold text-red-800",
                        "transition hover:bg-red-100",
                        "focus:outline-none focus:ring-2 focus:ring-red-200",
                      ].join(" ")}
                    >
                      Crisis support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Value props */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-emerald-200/80" />
                <div className="text-base font-semibold text-slate-900">Fast</div>
                <div className="mt-1 text-sm leading-relaxed text-slate-700">
                  2–4 minutes. No account. No email. Minimal data.
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-sky-200/80" />
                <div className="text-base font-semibold text-slate-900">Personalized</div>
                <div className="mt-1 text-sm leading-relaxed text-slate-700">
                  Based on goals, preferences, and how you learn.
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-amber-200/80" />
                <div className="text-base font-semibold text-slate-900">Actionable</div>
                <div className="mt-1 text-sm leading-relaxed text-slate-700">
                  Clear next steps, including provider links and support resources.
                </div>
              </div>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Not medical advice. If you’re in immediate danger or considering self-harm, call 911 or
              988 (U.S.).
            </p>
          </div>
        </div>
      </div>

      <StickyQuizCTA
        afterElementId="home-hero-end"
        abLabels={["Start the quiz", "Continue with the quiz"]}
        secondaryHref="/toolkit"
        secondaryLabel="Decision Toolkit"
        secondaryShowAfterPx={1200}
      />
    </main>
  );
}
