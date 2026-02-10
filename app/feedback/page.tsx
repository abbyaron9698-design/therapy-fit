export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Early Feedback</h1>
      <p className="mt-4 text-slate-600">
        Therapy Fit is in early development. We’re collecting feedback on
        clarity, tone, and emotional experience — not feature requests.
      </p>

      <a
        href="PASTE_YOUR_GOOGLE_FORM_LINK_HERE"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white"
      >
        Leave feedback →
      </a>
    </main>
  );
}
