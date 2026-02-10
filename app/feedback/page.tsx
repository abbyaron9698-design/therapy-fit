// app/feedback/page.tsx
export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Early Feedback</h1>

      <p className="mt-4 text-slate-600">
        Therapy Fit is in early development. We’re collecting feedback on{" "}
        <span className="font-medium text-slate-900">
          clarity, tone, and emotional experience
        </span>{" "}
        — not feature requests.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">Helpful prompts</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>What felt confusing, unclear, or too “jargony”?</li>
          <li>What felt calming vs. overwhelming?</li>
          <li>Where did you get stuck or lose confidence?</li>
          <li>What wording would you change?</li>
        </ul>
      </div>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSe9xk0qdG0vYgFfFzxLY5NhyqWVZAPgRbMYMGieDhFzaX1Kjg/viewform?usp=sharing&ouid=101944934837895852261"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
      >
        Leave feedback →
      </a>

      <p className="mt-4 text-xs text-slate-500">
        This form is not monitored for emergencies. If you’re in immediate
        danger, call 911 (U.S.) or contact your local emergency number.
      </p>
    </main>
  );
}
