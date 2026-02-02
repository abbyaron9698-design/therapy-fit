// app/terms/page.tsx
export const metadata = {
  title: "Terms of Use • Therapy Fit",
  description: "Terms for using Therapy Fit.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms of Use</h1>

          <p className="mt-4 text-slate-700">
            By using Therapy Fit, you agree to these terms. If you don’t agree, please don’t use the site.
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-700">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">Educational tool only</h2>
              <p>
                Therapy Fit provides general educational information and suggestions for exploring therapy approaches.
                It is not medical advice and does not establish a therapist-client relationship.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">No guarantees</h2>
              <p>
                We do not guarantee accuracy, completeness, or suitability. Provider information may be incomplete or
                outdated. Always verify credentials, availability, and fit directly with providers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">External resources</h2>
              <p>
                We link to external websites and directories. We are not responsible for their content, policies,
                availability, or services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">Acceptable use</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Don’t attempt to disrupt, scrape, or abuse the site.</li>
                <li>Don’t submit harmful, illegal, or misleading content.</li>
                <li>Don’t represent Therapy Fit as a clinical service.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">Changes</h2>
              <p>We may update these terms at any time. Continued use means you accept updates.</p>
            </section>
          </div>

          <div className="mt-10 flex gap-3">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Back to home
            </a>
            <a
              href="/disclaimer"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Disclaimer →
            </a>
          </div>

          <p className="mt-10 text-xs text-slate-500">Last updated: December 31, 2025</p>
        </div>
      </div>
    </main>
  );
}
