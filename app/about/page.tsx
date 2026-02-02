// app/about/page.tsx
export const metadata = {
  title: "About Therapy Fit",
  description:
    "What Therapy Fit is, how the quiz works, and how it helps you find a therapy path that fits.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white">
      <div className="mx-auto max-w-4xl px-8 py-16">
        <div className="rounded-[28px] border border-slate-200 bg-white px-10 py-12 shadow-lg">
          <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                About Therapy Fit
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
                Therapy Fit is a practical, effortless tool that helps you
                understand different therapy approaches and streamline your search for
                providers who may match the therapy style that works best for you.
              </p>

              {/* ✅ Scope disclaimer */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                TherapyFit currently supports <strong>Illinois-based providers</strong> to ensure accurate,
                state-specific licensing and services. Expansion to additional states is planned.
              </div>
            </div>

            {/* What this is */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                What Therapy Fit is
              </h2>

              <div className="space-y-3 text-slate-700">
                <p>
                  Therapy Fit was built to solve a common problem: most people are asked
                  to choose a therapist before they understand how therapy actually works.
                </p>

                <p>
                  Instead of starting with long directories or trial-and-error appointments,
                  Therapy Fit helps you:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Learn how different therapy modalities work (not just what they’re called)
                  </li>
                  <li>
                    Get personalized insight into how you tend to process information,
                    emotions, and change
                  </li>
                  <li>
                    See which therapy approaches may align with your learning style,
                    preferences, and goals
                  </li>
                  <li>
                    Find providers who practice those approaches
                  </li>
                  <li>
                    Access educational guides, common therapy questions, and community
                    resources for when therapy alone isn’t enough
                  </li>
                </ul>

                <p>
                  The goal is not to tell you what you <em>should</em> do — it’s to help you
                  make a more informed starting choice.
                </p>
              </div>
            </section>

            {/* About the quiz */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                About the quiz
              </h2>

              <div className="space-y-4 text-slate-700">
                <p>
                  The Therapy Fit quiz is designed to identify patterns in how you tend
                  to think, feel, learn, and respond to stress — not to diagnose you or
                  label you.
                </p>

                <p>
                  The questions draw from well-established research in psychology,
                  neuroscience, and psychotherapy, including:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Learning style and information-processing research</li>
                  <li>Emotion regulation and stress-response models</li>
                  <li>Trauma-informed and somatic frameworks</li>
                  <li>Cognitive, behavioral, experiential, and body-based therapy theory</li>
                  <li>Clinical research on treatment engagement and therapy fit</li>
                </ul>

                <p>Rather than asking about symptoms alone, the quiz focuses on:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    How you prefer to work through problems (structured tools vs.
                    exploration, body-based vs. cognitive)
                  </li>
                  <li>
                    What helps you feel safe, engaged, and motivated in learning or change
                  </li>
                  <li>How you tend to respond under stress or overwhelm</li>
                  <li>
                    Your openness to different therapeutic formats (talk-based,
                    experiential, creative, skills-focused)
                  </li>
                </ul>

                <p>
                  Your results don’t define you — they offer a starting lens.
                  Many people discover that therapy hasn’t helped in the past simply
                  because the approach didn’t match how they learn or process.
                </p>

                <p>
                  Therapy Fit helps surface those mismatches earlier, so your next step
                  can be more intentional.
                </p>
              </div>
            </section>

            {/* What this is not */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                What Therapy Fit is not
              </h2>

              <div className="space-y-3 text-slate-700">
                <p>
                  Therapy Fit is an educational tool. It does not provide diagnosis,
                  treatment, or medical advice.
                </p>

                <p>
                  It does not replace working with a licensed mental health professional,
                  and it does not determine what therapy you must pursue.
                </p>

                <p>
                  Think of it as a guide — one that helps you ask better questions,
                  understand your options, and approach therapy with more clarity.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/quiz"
                className="
                  inline-flex items-center justify-center
                  rounded-2xl bg-emerald-100 px-6 py-3
                  text-base font-semibold text-emerald-900
                  transition hover:bg-emerald-200
                "
              >
                Take the quiz →
              </a>

              <a
                href="/questions"
                className="
                  inline-flex items-center justify-center
                  rounded-2xl border border-slate-300 bg-white
                  px-6 py-3 text-base font-medium text-slate-800
                  transition hover:bg-slate-50
                "
              >
                Common therapy questions →
              </a>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-sm text-slate-500">
              Therapy Fit is educational only and does not provide medical advice.
              If you are in immediate danger, call 911 or your local emergency number.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
