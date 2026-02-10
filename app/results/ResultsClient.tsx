// app/results/ResultsClient.tsx
"use client";

import type { ReactNode } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MODALITY_LABELS, type ModalityId } from "../../lib/quizData";
import {
  ProviderFiltersBar,
  ProviderFiltersProvider,
  ProviderList,
  ProviderContactCTA,
} from "../components/ProviderDirectory";
import { QuizToToolkitCTA } from "../components/QuizToToolkitCTA";
import {
  decodeResultsPayload,
  type ResultsGates,
} from "../../lib/resultsPayload";

const LS_KEY = "tf_results_r";

function inferFocusFromTop(top: ModalityId[]): string | undefined {
  const first = top?.[0];
  if (!first) return undefined;

  const map: Partial<Record<ModalityId, string>> = {
    cbt: "anxiety",
    dbt: "emotion-regulation",
    act: "values",
    emdr: "trauma",
    erp: "exposure",
    psychodynamic: "insight",
  };

  return map[first] ?? "therapy-fit";
}

function modalityDisplayName(id: ModalityId) {
  const base = MODALITY_LABELS[id] ?? String(id);

  const expansions: Partial<Record<ModalityId, string>> = {
    cbt: "Cognitive Behavioral Therapy (CBT)",
    dbt: "Dialectical Behavior Therapy (DBT)",
    act: "Acceptance and Commitment Therapy (ACT)",
    emdr: "Eye Movement Desensitization and Reprocessing (EMDR)",
    erp: "Exposure and Response Prevention (ERP)",
  };

  return expansions[id] ?? base;
}

function buildToolkitHref({
  focus,
  profileLabel,
  src,
}: {
  focus?: string;
  profileLabel?: string;
  src?: string;
}) {
  const params = new URLSearchParams();
  if (focus) params.set("focus", focus);
  if (profileLabel) params.set("profile", profileLabel);
  if (src) params.set("src", src);
  const qs = params.toString();
  return qs ? `/toolkit?${qs}` : "/toolkit";
}

function pickSkillsFirstModality(top: ModalityId[], gates: ResultsGates): ModalityId | null {
  const certaintyLoop = Boolean(gates.certaintyLoopSignal || gates.ocdStrongSignal);
  if (certaintyLoop) return "erp";

  const preferredOrder: ModalityId[] = ["dbt", "cbt", "act", "somatic", "erp"];
  for (const id of preferredOrder) {
    if (top.includes(id)) return id;
  }
  return null;
}

function HelpfulNoteShort({
  gates,
  top,
}: {
  gates: ResultsGates;
  top: ModalityId[];
}) {
  const items: { title: string; body: ReactNode }[] = [];

  if (gates.stabilizationFirst) {
    const skillsFirst = pickSkillsFirstModality(top, gates);
    const skillsFirstHref = skillsFirst
      ? `/therapies/${skillsFirst}`
      : "/toolkit?focus=stabilization";
    const skillsFirstLabel = skillsFirst
      ? modalityDisplayName(skillsFirst)
      : "coping and grounding tools";

    items.push({
      title: "If you feel overwhelmed: start with coping skills first",
      body: (
        <>
          Grounding and emotion regulation skills can make deeper therapy feel
          more doable. You can still go deeper later.
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <a
              href={skillsFirstHref}
              className="inline-flex rounded-2xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 hover:bg-slate-50"
            >
              Coping skills: {skillsFirstLabel} →
            </a>
            <a
              href="/support"
              className="inline-flex rounded-2xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900 hover:bg-slate-50"
            >
              Support resources →
            </a>
          </div>
        </>
      ),
    });
  }

  const certaintyLoop = Boolean(gates.certaintyLoopSignal || gates.ocdStrongSignal);
  if (certaintyLoop) {
    items.push({
      title: "If you feel stuck in a certainty/relief loop: consider ERP-style work",
      body: (
        <>
          Some people notice a pattern like: intrusive thoughts → urges to
          check/reassure/mentally review → short relief → thoughts come back
          stronger. ERP (Exposure and Response Prevention) is designed to break
          that loop.
          <div className="mt-2 text-sm">
            A quick provider question:{" "}
            <span className="font-medium">
              “Do you use ERP-style exposure practice, and do you support
              between-session practice at a manageable pace?”
            </span>
          </div>
        </>
      ),
    });
  }

  if (gates.considerHigherSupport) {
    items.push({
      title: "If day-to-day functioning is sliding: consider more support",
      body: (
        <>
          Short-term structure (IOP/PHP, skills groups, more frequent sessions)
          can help.
          <div className="mt-2">
            <a
              href="/support"
              className="inline-flex rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Explore support options →
            </a>
          </div>
        </>
      ),
    });
  }

  if (gates.traumaProcessingReady && !gates.stabilizationFirst) {
    items.push({
      title: "If trauma feels central: explore trauma-focused therapy",
      body: (
        <>
          Look for someone who collaborates on pacing and keeps grounding tools
          in the mix.
        </>
      ),
    });
  }

  if (!items.length) return null;
  const compact = items.slice(0, 2);

  return (
    <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium uppercase tracking-wide text-amber-800">
          Helpful note
        </div>
        <h2 className="text-base font-semibold text-amber-900">
          A quick “where to start” guide
        </h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {compact.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl border border-amber-200 bg-white p-4"
          >
            <div className="text-sm font-semibold text-slate-900">{it.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">
              {it.body}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-amber-900/70">
        This is just a guide — your lived experience matters more than any quiz
        result.
      </p>
    </section>
  );
}

export default function ResultsClient() {
  const searchParams = useSearchParams();

  const [resolvedR, setResolvedR] = useState<string>("");
  const [source, setSource] = useState<"url" | "localStorage" | "none">("none");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const r = (searchParams?.get("r") ?? "").trim();

    if (r.length > 10) {
      try {
        localStorage.setItem(LS_KEY, r);
      } catch {}
      setResolvedR(r);
      setSource("url");
      setReady(true);
      return;
    }

    try {
      const fromLS = (localStorage.getItem(LS_KEY) ?? "").trim();
      if (fromLS.length > 10) {
        setResolvedR(fromLS);
        setSource("localStorage");
        setReady(true);
        return;
      }
    } catch {}

    setResolvedR("");
    setSource("none");
    setReady(true);
  }, [searchParams]);

  const payload = useMemo(() => {
    if (!resolvedR || resolvedR.length <= 10) return null;
    try {
      return decodeResultsPayload(resolvedR);
    } catch {
      return null;
    }
  }, [resolvedR]);

  const top: ModalityId[] = payload?.top ?? [];
  const med: "consider" | "no" = payload?.med ?? "no";
  const reasons: Partial<Record<ModalityId, string[]>> = payload?.reasons ?? {};
  const gates = payload?.gates ?? null;

  const confidence =
    payload?.confidence && payload.confidence.level ? payload.confidence : null;

  const focus = inferFocusFromTop(top);
  const profileLabel = confidence?.label ?? undefined;

  const toolkitHref = buildToolkitHref({
    focus,
    profileLabel,
    src: "quiz_results",
  });

  const resultsContactHref = (() => {
    const params = new URLSearchParams();
    if (resolvedR) params.set("r", resolvedR);
    params.set("contact", "1");
    return `/results?${params.toString()}#contact-cta`;
  })();

  const top1 = top?.[0];
  const top2 = top?.[1];
  const top3 = top?.[2];

  const showDebug = process.env.NODE_ENV !== "production";
  const debug = {
    ready,
    source,
    hasR: Boolean(resolvedR),
    rLen: resolvedR?.length ?? 0,
    hasPayload: payload ? "ok" : null,
    urlKeys: Array.from(searchParams?.keys?.() ?? []),
  };

  if (!ready) {
    // Note: Suspense fallback usually catches first paint, but keep this too.
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="rounded-3xl border bg-white p-10 shadow-sm">
            <div className="text-sm text-slate-600">Loading your results…</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          {top1 ? (
            <ProviderFiltersProvider>
              <div className="mb-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                      Your results
                    </h1>
                    <p className="mt-3 max-w-3xl text-slate-600">
                      These are starting points — not rules. Use them to guide your
                      provider search.
                    </p>
                    {source === "localStorage" ? (
                      <div className="mt-2 text-xs text-slate-500">
                        Loaded from this device’s saved results.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Your top matches
                  </div>

                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {top2 || top3 ? (
                      <>
                        Your top three are{" "}
                        <span className="font-extrabold">
                          {modalityDisplayName(top1)}
                        </span>
                        {top2 ? (
                          <>
                            {", "}
                            <span className="font-extrabold">
                              {modalityDisplayName(top2)}
                            </span>
                          </>
                        ) : null}
                        {top3 ? (
                          <>
                            {" "}
                            and{" "}
                            <span className="font-extrabold">
                              {modalityDisplayName(top3)}
                            </span>
                          </>
                        ) : null}
                        .
                      </>
                    ) : (
                      <>
                        Your top match is{" "}
                        <span className="font-extrabold">
                          {modalityDisplayName(top1)}
                        </span>
                        .
                      </>
                    )}
                  </div>

                  <div className="mt-2 text-sm leading-relaxed text-slate-700">
                    It’s normal for more than one therapy type to fit. Fit with the
                    therapist matters too.
                  </div>

                  {confidence?.why ? (
                    <div className="mt-3 text-sm text-slate-600">
                      {confidence.why}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mb-8 grid gap-4 md:grid-cols-3">
                {top.slice(0, 3).map((mid, idx) => (
                  <div
                    key={mid}
                    className="rounded-3xl border border-slate-200 bg-white p-5"
                  >
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Result #{idx + 1}
                    </div>

                    <div className="mt-1 text-base font-semibold text-slate-900">
                      {modalityDisplayName(mid)}
                    </div>

                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-900">
                        Why this may fit
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {(reasons[mid] ?? []).length ? (
                          (reasons[mid] ?? [])
                            .slice(0, 4)
                            .map((rr: string, i: number) => <li key={i}>{rr}</li>)
                        ) : (
                          <li>A good place to start based on what you shared.</li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
                      Tip: look for someone who explicitly offers{" "}
                      <span className="font-medium">
                        {modalityDisplayName(mid)}
                      </span>{" "}
                      and supports your main concerns.
                    </div>

                    <a
                      href="#provider-search"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                    >
                      Find providers →
                    </a>
                  </div>
                ))}
              </div>

              <section className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  What you can do next
                </div>

                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      1) Reach out
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Pick 2–3 providers for{" "}
                      <span className="font-medium">
                        {modalityDisplayName(top1)}
                      </span>
                      .
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={resultsContactHref}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Contact script →
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      2) Compare
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Use the “why this may fit” bullets above to compare.
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      3) Confirm
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Confirm they’re accepting new clients and take your insurance.
                    </div>
                  </div>
                </div>
              </section>

              <div className="mb-8" id="contact-cta">
                <ProviderContactCTA
                  modalityId={top1}
                  scrollTargetId="provider-search"
                  toolkitHref={toolkitHref}
                  hideInline
                />
              </div>

              {gates ? <HelpfulNoteShort gates={gates} top={top} /> : null}

              <section id="provider-search" className="scroll-mt-24">
                <div className="mb-4 flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Provider search
                  </h2>
                  <p className="text-sm text-slate-600">
                    Add your ZIP code and insurance to see the best matches.
                  </p>
                </div>

                <ProviderFiltersBar />

                <div className="mt-8 space-y-6">
                  {top.map((mid, idx) => (
                    <section
                      key={mid}
                      id={`providers-${mid}`}
                      className="rounded-3xl border bg-white p-6"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Providers for result #{idx + 1}
                          </div>
                          <h3 className="mt-1 text-lg font-semibold text-slate-900">
                            {modalityDisplayName(mid)}
                          </h3>
                        </div>
                      </div>

                      <ProviderList
                        modalityId={mid}
                        listId={idx === 0 ? "providers" : undefined}
                      />
                    </section>
                  ))}
                </div>

                {med === "consider" && (
                  <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
                    <p className="text-sm font-medium text-slate-900">
                      Medication consult (optional)
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      If sleep, energy, or daily functioning feels strongly impacted,
                      a medication consult can be one more support alongside therapy.
                    </p>
                  </div>
                )}
              </section>

              <div className="mt-10">
                <QuizToToolkitCTA
                  focus={focus}
                  profileLabel={profileLabel}
                  source="quiz_results"
                />
              </div>

              <p className="mt-10 text-xs text-slate-500">
                Provider availability changes quickly — please confirm availability
                directly. If you’re in immediate danger, call 911 or 988 (U.S.).
              </p>
            </ProviderFiltersProvider>
          ) : (
            <div className="rounded-2xl border bg-white p-6">
              <div className="text-sm font-medium text-slate-900">
                We couldn’t find results on this page yet.
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Take the quiz once to generate results. After that, the Results tab
                will work here on this device.
              </p>

              {showDebug ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  <div className="font-semibold">Debug</div>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {JSON.stringify(debug, null, 2)}
                  </pre>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/quiz"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Take the quiz →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
