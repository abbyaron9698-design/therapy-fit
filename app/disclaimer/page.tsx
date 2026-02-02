// app/disclaimer/page.tsx
export const metadata = {
  title: "Disclaimer • Therapy Fit",
  description: "Medical/legal disclaimer for Therapy Fit.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Disclaimer</h1>

          <div className="mt-6 space-y-5 text-sm text-slate-700">
            <p>
              Therapy Fit is an <strong>educational tool</strong>. It does not provide medical advice, diagnosis, or
              treatment, and it is not a substitute for professional care.
            </p>

            <p>
              The quiz results are general recommendations based on patterns in your answers and cannot account for your
              full history, risk factors, or clinical needs.
            </p>

            <p>
              Provider listings are informational. We do not verify licensing, quality, availability, or insurance
              coverage in real time. Always verify credentials and fit directly with any provider.
            </p>

            <div className="rounded-2xl border bg-slate-50 p-5">
              <div className="font-medium text-slate-900">Emergency</div>
              <p className="mt-2">
                If you’re in immediate danger, call <strong>911</strong> (U.S.) or your local emergency number. If you
                are experiencing a crisis or thinking about harming yourself, you can call/text <strong>988</strong> in
                the U.S., or visit the <a className="underline" href="/crisis">Crisis Support</a> page for more options.
              </p>
            </div>

            <p>
              By using Therapy Fit, you acknowledge you understand these limitations and accept responsibility for how
              you use the information.
            </p>
          </div>

          <div className="mt-10 flex gap-3">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Back to home
            </a>
            <a
              href="/crisis"
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700"
            >
              Crisis Support →
            </a>
          </div>

          <p className="mt-10 text-xs text-slate-500">Last updated: December 31, 2025</p>
        </div>
      </div>
    </main>
  );
}
