// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy • Therapy Fit",
  description: "How Therapy Fit handles data and privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>

          <p className="mt-4 text-slate-700">
            Therapy Fit is an educational tool. We aim to collect as little personal data as possible.
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-700">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">What we collect</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Quiz answers:</strong> Your selections are used to generate your results.
                  In the current version, results are encoded in the URL (so you can share/return to them).
                </li>
                <li>
                  <strong>Optional filters:</strong> ZIP/insurance filters are used locally to filter the provider list.
                </li>
                <li>
                  <strong>Analytics (optional):</strong> If we enable analytics later, we’ll disclose what tool we use and
                  what it tracks.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">What we do not do</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>We do not provide therapy, diagnosis, or medical advice.</li>
                <li>We do not knowingly collect sensitive personal health information.</li>
                <li>We do not sell your personal data.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">Sharing</h2>
              <p>
                If you share a results link, it may include your quiz “top matches” because they’re encoded in the URL.
                If that’s not what you want, don’t share the link.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">External links</h2>
              <p>
                Therapy Fit links to external websites (provider websites, hotlines, directories). Those sites have their
                own privacy policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">Contact</h2>
              <p>
                If you add a contact email later, put it here. For now: if something is wrong with the site, use the
                directory/source links to verify information.
              </p>
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
              href="/terms"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Terms →
            </a>
          </div>

          <p className="mt-10 text-xs text-slate-500">Last updated: December 31, 2025</p>
        </div>
      </div>
    </main>
  );
}
