export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Early Feedback</h1>
      <p className="mt-4 text-slate-600">
        Therapy Fit is in early development. We’re collecting feedback on
        clarity, tone, and emotional experience — not feature requests.
      </p>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSe9xk0qdG0vYgFfFzxLY5NhyqWVZAPgRbMYMGieDhFzaX1Kjg/viewform?usp=sharing&ouid=101944934837895852261"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white"
      >
        Leave feedback →
      </a>
    </main>
  );
}
