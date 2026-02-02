// app/quiz/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QUESTIONS, type Answers, type Question, scoreAnswers } from "../../lib/quizData";
import { track } from "../../lib/analytics";
import { encodeResultsPayload, type ResultsPayloadV1 } from "../../lib/resultsPayload";

function isMulti(q: Question): q is Extract<Question, { kind: "multi" }> {
  return q.kind === "multi";
}
function isSingle(q: Question): q is Extract<Question, { kind: "single" }> {
  return q.kind === "single";
}

const STORAGE_KEY = "therapyfit_quiz_answers_v1";

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [answers, setAnswers] = useState<Answers>({});
  const didInit = useRef(false);

  // Load saved progress (dropoff reduction)
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object") {
          setAnswers(parsed as Answers);
        }
      }
    } catch {
      // ignore
    }

    track("quiz_start");
  }, []);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  const progress = useMemo(() => {
    let answered = 0;
    for (const q of QUESTIONS) {
      const v = answers[q.id];
      if (Array.isArray(v) && v.length) answered++;
      if (typeof v === "string" && v) answered++;
    }
    return { answered, total: QUESTIONS.length };
  }, [answers]);

  function toggleMulti(qid: (typeof QUESTIONS)[number]["id"], optionId: string) {
    setAnswers((prev) => {
      const cur = prev[qid];
      const curArr = Array.isArray(cur) ? cur : [];
      const next = curArr.includes(optionId)
        ? curArr.filter((x) => x !== optionId)
        : [...curArr, optionId];

      track("quiz_answer_change", {
        qid,
        kind: "multi",
        selectedCount: next.length,
      });

      return { ...prev, [qid]: next };
    });
  }

  function setSingle(qid: (typeof QUESTIONS)[number]["id"], optionId: string) {
    setAnswers((prev) => {
      track("quiz_answer_change", { qid, kind: "single" });
      return { ...prev, [qid]: optionId };
    });
  }

  function clearSavedProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setAnswers({});
    track("quiz_clear_progress");
  }

  function submit() {
    const { top3, medFlag, topReasons, confidence } = scoreAnswers(answers);

    // Capture UTM params if present (attribution = future growth)
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const v = searchParams.get(key);
      if (v) utm[key] = v;
    }

    const payload: ResultsPayloadV1 = {
      v: 1,
      top: top3,
      med: medFlag,
      reasons: topReasons,
      confidence,
      meta: {
        source: "quiz",
        utm: Object.keys(utm).length ? utm : undefined,
        ts: new Date().toISOString(),
      },
    };

    const encoded = encodeResultsPayload(payload);

    track("quiz_submit", {
      answered: progress.answered,
      total: progress.total,
      top1: top3[0] ?? null,
      top2: top3[1] ?? null,
      top3: top3[2] ?? null,
      med: medFlag,
    });

    // Important: canonical results route (shareable + stable)
    router.push(`/results?r=${encoded}`);

    // Optional: keep answers saved so user can compare; or wipe:
    // localStorage.removeItem(STORAGE_KEY);
  }

  const canSubmit = progress.answered >= 2;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
                ~1–2 minutes
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Find a therapy approach that fits you
              </h1>
              <p className="mt-2 text-slate-600">
                Answer a few questions about what you’re experiencing and how you learn. You can select
                multiple options—there’s no limit.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {progress.answered}/{progress.total} answered
              </div>

              {progress.answered > 0 ? (
                <button
                  type="button"
                  onClick={clearSavedProgress}
                  className="text-xs font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-900"
                >
                  Clear progress
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {QUESTIONS.map((q) => (
              <section key={q.id} className="rounded-2xl border bg-white p-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-semibold text-slate-900">{q.title}</h2>
                  {q.subtitle ? <p className="text-sm text-slate-600">{q.subtitle}</p> : null}
                </div>

                <div className="mt-4 grid gap-3">
                  {isMulti(q) &&
                    q.options.map((opt) => {
                      const cur = answers[q.id];
                      const selectedIds = Array.isArray(cur) ? cur : [];
                      const selected = selectedIds.includes(opt.id);

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

                  {isSingle(q) &&
                    q.options.map((opt) => {
                      const selected = answers[q.id] === opt.id;

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
              Not medical advice. If you’re in immediate danger, call 911 or 988 (US).
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className={[
                "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-medium shadow-sm transition",
                canSubmit
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              See my results →
            </button>
          </div>

          <details className="mt-6 rounded-2xl border bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-medium text-slate-900">
              (Optional) Preview how results are chosen
            </summary>
            <div className="mt-3 text-sm text-slate-700">
              We look for patterns across what you’re experiencing (e.g., avoidance, emotional overwhelm,
              trauma reminders) and how you prefer to learn (tools, exploration, creative expression).
              Then we generate a short list of therapy approaches and explain why they may fit.
            </div>
          </details>
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
