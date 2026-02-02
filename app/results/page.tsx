// app/results/page.tsx
import { MODALITY_LABELS, type ModalityId } from "../../lib/quizData";
import {
  ProviderFiltersBar,
  ProviderFiltersProvider,
  ProviderList,
  ProviderContactCTA,
} from "../components/ProviderDirectory";
import { QuizToToolkitCTA } from "../components/QuizToToolkitCTA";
import { decodeResultsPayload } from "../../lib/resultsPayload";

function confidenceStyles(level: "strong" | "good" | "explore") {
  if (level === "strong") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (level === "good") return "border-sky-200 bg-sky-50 text-sky-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function inferFocusFromTop(top: ModalityId[]): string | undefined {
  const first = top?.[0];
  if (!first) return undefined;

  const map: Partial<Record<ModalityId, string>> = {
    cbt: "anxiety",
    dbt: "emotion-regulation",
    act: "values",
    emdr: "trauma",
    erp: "ocd",
    psychodynamic: "insight",
  };

  return map[first] ?? "therapy-fit";
}

function buildToolkitHref({ focus, profileLabel }: { focus?: string; profileLabel?: string }) {
  const params = new URLSearchParams();
  if (focus) params.set("focus", focus);
  if (profileLabel) params.set("profile", profileLabel);
  const qs = params.toString();
  return qs ? `/toolkit?${qs}` : "/toolkit";
}

export default function ResultsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const r = typeof searchParams.r === "string" ? searchParams.r : "";
  const payload = r ? decodeResultsPayload(r) : null;

  const top: ModalityId[] = payload?.top ?? [];
  const med: "consider" | "no" = payload?.med ?? "no";
  const reasons: Partial<Record<ModalityId, string[]>> = payload?.reasons ?? {};

  const confidence =
    payload?.confidence && payload.confidence.level
      ? payload.confidence
      : null;

  const focus = inferFocusFromTop(top);
  const profileLabel = confidence?.label ?? undefined;
  const toolkitHref = buildToolkitHref({ focus, profileLabel });

  const top1 = top?.[0];
  const top2 = top?.[1];
  const top3 = top?.[2];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Your therapy matches
                </h1>
                <p className="mt-3 max-w-3xl text-slate-600">
                  This is a quick quiz — think of these as <strong>starting points</strong>, not a
                  final answer. You’re in charge: compare the options and choose what feels most
                  supportive.
                </p>
              </div>

              {confidence ? (
                <div
                  className={[
                    "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
                    confidenceStyles(confidence.level),
                  ].join(" ")}
                >
                  {confidence.label}
                </div>
              ) : null}
            </div>

            {/* Top matches strip (show even if only 1) */}
            {top1 ? (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Your top matches
                </div>

                <div className="mt-2 text-lg font-semibold text-slate-900">
                  {top2 || top3 ? (
                    <>
                      Your top three are{" "}
                      <span className="font-extrabold">{MODALITY_LABELS[top1]}</span>
                      {top2 ? (
                        <>
                          {", "}
                          <span className="font-extrabold">{MODALITY_LABELS[top2]}</span>
                        </>
                      ) : null}
                      {top3 ? (
                        <>
                          {" "}
                          and <span className="font-extrabold">{MODALITY_LABELS[top3]}</span>
                        </>
                      ) : null}
                      .
                    </>
                  ) : (
                    <>
                      Your top match is{" "}
                      <span className="font-extrabold">{MODALITY_LABELS[top1]}</span>.
                    </>
                  )}
                </div>

                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Many approaches overlap. It’s common for more than one to resonate — that’s a
                  strength, not a setback. You can also ask your provider to accommodate your style
                  and preferences.
                </div>

                {confidence?.why ? (
                  <div className="mt-3 text-sm text-slate-600">{confidence.why}</div>
                ) : null}
              </div>
            ) : null}
          </div>

          {top1 ? (
            <ProviderFiltersProvider>
              {/* What now */}
              <section className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  What you can do from here
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">1) Reach out</div>
                    <div className="mt-1 text-sm text-slate-600">Contact 2–3 providers for your top match.</div>
                  </div>

                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">2) Compare</div>
                    <div className="mt-1 text-sm text-slate-600">Read the “why this may fit” notes below.</div>
                  </div>

                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">3) Check availability</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Use the provider’s website/contact link to confirm they’re accepting new clients.
                    </div>
                  </div>
                </div>
              </section>

              {/* Main CTA */}
              <div className="mb-6">
                <ProviderContactCTA
                  modalityId={top1}
                  heading="Main next step: contact a few providers"
                  subheading={`Pick 1–3 providers for ${MODALITY_LABELS[top1]}, copy a message you can send today, and use their website/contact links when you’re ready.`}
                  scrollTargetId="providers"
                  toolkitHref={toolkitHref}
                  toolkitLabel="Want support choosing + reaching out? Toolkit →"
                />
              </div>

              {/* Toolkit CTA */}
              <div className="mb-8">
                <QuizToToolkitCTA focus={focus} profileLabel={profileLabel} source="quiz_results" />
              </div>

              {/* Filters */}
              <ProviderFiltersBar />

              {/* Results */}
              <div className="space-y-8">
                {top.map((mid, idx) => (
                  <section key={mid} className="rounded-3xl border bg-white p-6">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Match #{idx + 1}
                      </div>
                      <h2 className="mt-1 text-xl font-semibold text-slate-900">{MODALITY_LABELS[mid]}</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Use this as a hypothesis: if it resonates, try it. If it doesn’t, move to the next match.
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-900">Why this may fit you</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {(reasons[mid] ?? []).length ? (
                          (reasons[mid] ?? []).map((r: string, i: number) => <li key={i}>{r}</li>)
                        ) : (
                          <li>Matches what you’re looking for based on what you shared.</li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">What starting with this often looks like</p>
                      <p className="mt-2">
                        You’ll clarify goals, build safety and trust, and test fit over the first few sessions — not
                        committing long-term on day one.
                      </p>
                    </div>

                    <ProviderList modalityId={mid} listId={idx === 0 ? "providers" : undefined} />
                  </section>
                ))}
              </div>

              {med === "consider" && (
                <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
                  <p className="text-sm font-medium text-slate-900">A note about medication</p>
                  <p className="mt-2 text-sm text-slate-700">
                    Some answers suggest a medication consultation may be worth considering (especially if
                    sleep/energy/functioning are significantly impacted). This doesn’t replace therapy and doesn’t
                    mean medication is required.
                  </p>
                </div>
              )}

              <p className="mt-10 text-xs text-slate-500">
                Educational tool only. Provider availability changes quickly — please contact the office directly to
                confirm availability. If you’re in immediate danger, call 911 or 988 (U.S.).
              </p>
            </ProviderFiltersProvider>
          ) : (
            <div className="rounded-2xl border bg-white p-6">
              <div className="text-sm font-medium text-slate-900">Hmm — we couldn’t read your quiz results.</div>
              <p className="mt-2 text-sm text-slate-600">
                This can happen if the results link is malformed. Try taking the quiz again.
              </p>
              <a
                href="/quiz"
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Go back to the quiz →
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
