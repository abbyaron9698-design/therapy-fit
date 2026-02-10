// app/quiz/advanced/AdvancedQuizClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ModalityId } from "../../../lib/quizData";
import {
  TIER2_QUESTIONS,
  type Tier2Answers,
  scoreTier2,
} from "../../../lib/quizTier2";
import {
  encodeResultsPayload,
  type ResultsPayloadV1,
} from "../../../lib/resultsPayload";
import { track } from "../../../lib/analytics";

function isMulti(q: (typeof TIER2_QUESTIONS)[number]) {
  return q.kind === "multi";
}

function arr<T>(x: T | T[] | undefined): T[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

function computeTier2Gates(answers: Tier2Answers): ResultsPayloadV1["gates"] {
  const ocd = arr(answers.ocdSignal as any);
  const traumaReadiness = (answers.traumaReadiness as string | undefined) ?? "";
  const supportLevel = (answers.supportLevel as string | undefined) ?? "";

  const gates: NonNullable<ResultsPayloadV1["gates"]> = {};

  if (ocd.includes("rituals") || ocd.includes("avoidTriggers"))
    gates.ocdStrongSignal = true;
  if (traumaReadiness === "stabilize") gates.stabilizationFirst = true;
  if (traumaReadiness === "ready") gates.traumaProcessingReady = true;
  if (supportLevel === "more_than_weekly") gates.considerHigherSupport = true;

  return Object.keys(gates).length ? gates : undefined;
}

export default function AdvancedQuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<Tier2Answers>({});
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => {
    let answered = 0;
    for (const q of TIER2_QUESTIONS) {
      const v = answers[q.id];
      if (Array.isArray(v) && v.length) answered++;
      if (typeof v === "string" && v) answered++;
    }
    return { answered, total: TIER2_QUESTIONS.length };
  }, [answers]);

  function toggleMulti(qid: keyof Tier2Answers, optionId: string) {
    setAnswers((prev) => {
      const cur = (prev[qid] as string[] | undefined) ?? [];
      const next = cur.includes(optionId)
        ? cur.filter((x) => x !== optionId)
        : [...cur, optionId];
      return { ...prev, [qid]: next };
    });
  }

  function setSingle(qid: keyof Tier2Answers, optionId: string) {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  }

  function submit() {
    if (submitting) return;
    setSubmitting(true);

    const { scores, reasons } = scoreTier2(answers);

    const ranked = (Object.entries(scores) as [ModalityId, number][])
      .filter(([id]) => id !== "med")
      .sort((a, b) => b[1] - a[1]);

    const top3 = ranked.slice(0, 3).map(([id]) => id);
    const medFlag: "no" | "consider" =
      (scores.med ?? 0) >= 1.4 ? "consider" : "no";

    const topReasons: Record<ModalityId, string[]> = Object.fromEntries(
      top3.map((id) => [id, (reasons[id] ?? []).slice(0, 3)])
    ) as Record<ModalityId, string[]>;

    const gates = computeTier2Gates(answers);

    // UTM attribution passthrough
    const utm: Record<string, string> = {};
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ]) {
      const v = searchParams.get(key);
      if (v) utm[key] = v;
    }

    // Confidence: gap between top 2
    const topScore = ranked[0]?.[1] ?? 0;
    const secondScore = ranked[1]?.[1] ?? 0;
    const gap12 = topScore - secondScore;

    const confidenceLevel: "strong" | "good" | "explore" =
      gap12 >= 1.0 ? "strong" : gap12 >= 0.5 ? "good" : "explore";

    const confidenceLabel =
      confidenceLevel === "strong"
        ? "Strong match"
        : confidenceLevel === "good"
        ? "Good fit"
        : "Worth exploring";

    const confidenceWhy =
      confidenceLevel === "strong"
        ? "Your top match stood out clearly on the Tier 2 discriminators you answered."
        : confidenceLevel === "good"
        ? "Your top match was consistent, with another approach close behind."
        : "Several approaches were close on Tier 2 — comparing fit with a provider will matter most.";

    const payload: ResultsPayloadV1 = {
      v: 1,
      top: top3,
      med: medFlag,
      reasons: topReasons,
      confidence: {
        level: confidenceLevel,
        label: confidenceLabel,
        why: confidenceWhy,
        details: { topScore, secondScore, gap12, tier: 2 },
      },
      gates,
      meta: {
        source: "quiz_tier2",
        utm: Object.keys(utm).length ? utm : undefined,
        ts: new Date().toISOString(),
      },
    };

    let encoded = "";
    try {
      encoded = encodeResultsPayload(payload);
    } catch {
      encoded = "";
    }

    track("quiz_tier2_submit", {
      answered: progress.answered,
      total: progress.total,
      top1: top3[0] ?? null,
      top2: top3[1] ?? null,
      top3: top3[2] ?? null,
      med: medFlag,
      gates: gates ? Object.keys(gates) : [],
    });

    if (!encoded || encoded.length < 10) {
      router.push("/quiz?err=tier2_results_encode_failed");
      return;
    }

    router.push(`/results?r=${encodeURIComponent(encoded)}`);
  }

  const canSubmit = progress.answered >= 2;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
                Advanced • Tier 2 • ~2–4 minutes
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Refine your matches
              </h1>
              <p className="mt-2 text-slate-600">
                This optional quiz narrows down therapy fit in specific lanes.
                You can still keep it light — skip anything you don’t want to
                answer.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {progress.answered}/{progress.total} answered
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {TIER2_QUESTIONS.map((q) => (
              <section key={q.id} className="rounded-2xl border bg-white p-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-semibold text-slate-900">
                    {q.title}
                  </h2>
                  {q.subtitle ? (
                    <p className="text-sm text-slate-600">{q.subtitle}</p>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3">
                  {isMulti(q) &&
                    q.options.map((opt) => {
                      const selected = (
                        (answers[q.id] as string[] | undefined) ?? []
                      ).includes(opt.id);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => toggleMulti(q.id, opt.id)}
                          className={[
                            "rounded-2xl border px-4 py-3 text-left transition",
                            selected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "bg-white hover:bg-slate-50 text-slate-900",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      );
                    })}

                  {q.kind === "single" &&
                    q.options.map((opt) => {
                      const selected =
                        (answers[q.id] as string | undefined) === opt.id;
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setSingle(q.id, opt.id)}
                          className={[
                            "rounded-2xl border px-4 py-3 text-left transition",
                            selected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "bg-white hover:bg-slate-50 text-slate-900",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Not medical advice. If you’re in immediate danger, call 911 or 988
              (US).
            </div>

            <button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={submit}
              className={[
                "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-medium shadow-sm transition",
                canSubmit && !submitting
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              {submitting ? "Generating results…" : "See my refined results →"}
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <a
              className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
              href="/quiz"
            >
              Back to Tier 1
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <a
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            href="/"
          >
            Back to home
          </a>
        </div>
      </div>
    </main>
  );
}
