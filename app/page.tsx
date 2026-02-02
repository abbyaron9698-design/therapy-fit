// app/page.tsx
import Link from "next/link";
import { StickyQuizCTA } from "./components/StickyQuizCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white">
      <div className="mx-auto max-w-6xl px-8 py-20 pb-32 sm:pb-20">
        <div className="rounded-[28px] border border-slate-200 bg-white px-12 py-14 shadow-lg">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Chicagoland beta
              </div>

              <div className="text-sm font-semibold tracking-tight text-slate-900">
                TherapyFit
              </div>

              <div className="inline-flex w-fit flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Built for Illinois to keep credentials + local resources accurate — expanding
                state-by-state.
              </div>
            </div>

            <div className="grid gap-6">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-900">
                Understand your therapy options — then choose a therapy style that fits you.
              </h1>

              <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
                Answer a quick questionnaire about your goals, preferences, and thought processes.
                You’ll get a short list of therapy approaches (CBT, DBT, EMDR, Somatic, Art Therapy)
                plus a clear path to finding providers in Illinois.
              </p>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-3xl">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Main next step
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                      Start with the quiz (1–2 minutes).
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      This quiz doesn’t “diagnose” you — it gives direction. You’ll see a few
                      strong options — and the reasons they may fit.
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        Answer a few questions
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        Get 1–3 matches + “why”
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        Contact providers (scripts included)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <Link
                      href="/quiz"
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl
                        bg-emerald-700
                        px-7 py-4
                        text-base font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-emerald-800
                        focus:outline-none focus:ring-2 focus:ring-emerald-300
                      "
                    >
                      Start the quiz →
                    </Link>

                    <div className="text-xs text-slate-500">
                      No account. No email. No commitment.
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/therapies"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        Browse therapy types →
                      </Link>
                      <Link
                        href="/questions"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        Common questions →
                      </Link>
                      <Link
                        href="/credentials"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        Credentials &amp; licensing →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div id="home-hero-end" />

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Need support beyond therapy?
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      If life stressors, urgent safety concerns, or barriers to accessing therapy are
                      driving distress, start here.
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/support"
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl border border-slate-300
                        bg-slate-50 px-4 py-2
                        text-sm font-medium text-slate-800
                        transition hover:bg-slate-100
                      "
                    >
                      Support &amp; services →
                    </Link>

                    <Link
                      href="/crisis"
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl border border-red-300
                        bg-red-50 px-4 py-2
                        text-sm font-semibold text-red-700
                        transition hover:bg-red-100
                      "
                    >
                      Crisis support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-base font-semibold text-slate-900">Fast</div>
                <div className="mt-1 text-sm text-slate-600">
                  2–4 minutes. No account. No email. Minimal data.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-base font-semibold text-slate-900">Personalized</div>
                <div className="mt-1 text-sm text-slate-600">
                  Based on goals, preferences, and how you learn.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-base font-semibold text-slate-900">Actionable</div>
                <div className="mt-1 text-sm text-slate-600">
                  Clear next steps, including provider links and support resources.
                </div>
              </div>
            </div>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
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
