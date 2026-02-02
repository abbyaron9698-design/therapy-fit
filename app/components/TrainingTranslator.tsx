// app/components/TrainingTranslator.tsx
"use client";

import React, { useMemo, useState } from "react";

type PhraseKey =
  | "certified"
  | "trained"
  | "informed"
  | "level1"
  | "level2"
  | "intensive"
  | "consultation"
  | "certificateProgram"
  | "member"
  | "supervision";

type TranslatorEntry = {
  label: string;
  whatItCanMean: string[];
  whatItDoesNotGuarantee: string[];
  questionsToAsk: string[];
  bestNextStep?: { label: string; href: string };
};

const ENTRIES: Record<PhraseKey, TranslatorEntry> = {
  certified: {
    label: "“Certified in…”",
    whatItCanMean: [
      "They completed a defined training pathway (sometimes with consultation hours).",
      "They may have passed a test or met requirements set by a specific organization.",
    ],
    whatItDoesNotGuarantee: [
      "It does not automatically mean lots of real-world experience with your exact issue.",
      "Some “certifications” are not regulated — quality depends on who issued it.",
    ],
    questionsToAsk: [
      "Which organization issued the certification?",
      "How many training hours + consultation hours were required?",
      "How often do you use this approach with clients like me?",
    ],
    bestNextStep: {
      label: "How licenses vs certifications differ →",
      href: "/credentials#licenses-vs-certifications",
    },
  },

  trained: {
    label: "“Trained in…”",
    whatItCanMean: [
      "They took coursework, a workshop, or a formal training sequence.",
      "Training can range from a single weekend to a multi-month program.",
    ],
    whatItDoesNotGuarantee: [
      "Training alone does not equal skill — practice + supervision matter a lot.",
      "It may not mean they use it regularly.",
    ],
    questionsToAsk: [
      "Was it a workshop, a full program, or ongoing consultation?",
      "How many hours total?",
      "Do you get consultation/supervision for this approach?",
    ],
    bestNextStep: { label: "Browse therapy styles →", href: "/therapies" },
  },

  informed: {
    label: "“Informed by…”",
    whatItCanMean: [
      "They borrow ideas from that approach but do not necessarily practice it as a structured method.",
      "This can still be helpful — it usually means it is not the primary model.",
    ],
    whatItDoesNotGuarantee: [
      "It does not mean formal training in that approach.",
      "It often won't be delivered as a clear step-by-step method.",
    ],
    questionsToAsk: [
      "When you say ‘informed by,’ what does that look like in an actual session?",
      "Is this your main approach or one influence among many?",
      "If I want a structured version of this method, do you offer that?",
    ],
    bestNextStep: { label: "Take the quiz for a shortlist →", href: "/quiz" },
  },

  level1: {
    label: "“Level 1”",
    whatItCanMean: [
      "They completed an introductory tier in a multi-level training system.",
      "Often: foundational knowledge + basic application.",
    ],
    whatItDoesNotGuarantee: [
      "It may not include advanced skills or complex cases.",
      "It does not guarantee ongoing consultation.",
    ],
    questionsToAsk: [
      "Are you Level 1 only, or have you completed Level 2/advanced training?",
      "Do you currently get consultation for this method?",
      "How long have you been using it weekly with clients?",
    ],
  },

  level2: {
    label: "“Level 2 / Advanced”",
    whatItCanMean: [
      "They completed a more intensive tier (often includes more practice + feedback).",
      "Sometimes includes additional consultation requirements.",
    ],
    whatItDoesNotGuarantee: [
      "It still does not guarantee fit — the therapist’s style matters.",
      "It does not guarantee specialization in your exact issue.",
    ],
    questionsToAsk: [
      "What advanced components were included (practice, recorded sessions, consultation)?",
      "How often do you use this with clients like me?",
      "How will we measure progress in the first 4–6 sessions?",
    ],
  },

  intensive: {
    label: "“Intensive / Institute / Immersion”",
    whatItCanMean: [
      "A concentrated training experience (often multiple days) that may include practice.",
      "Sometimes a starting point before longer consultation or certification.",
    ],
    whatItDoesNotGuarantee: [
      "A single intensive does not equal mastery without follow-up consultation/practice.",
    ],
    questionsToAsk: [
      "Was it a one-time intensive or part of a longer pathway?",
      "Did it include supervised practice or feedback?",
      "What follow-up consultation did you do afterward?",
    ],
  },

  consultation: {
    label: "“Consultation hours / Case consultation”",
    whatItCanMean: [
      "They meet with an expert/consultation group to review cases and improve skill.",
      "This can be a strong signal of depth for specialized modalities.",
    ],
    whatItDoesNotGuarantee: [
      "Consultation quality varies — it depends who provides it and how often.",
    ],
    questionsToAsk: [
      "How often do you get consultation (weekly, monthly)?",
      "Who is it with (which organization / trainer)?",
      "Is it ongoing or only during training?",
    ],
  },

  certificateProgram: {
    label: "“Certificate program”",
    whatItCanMean: [
      "A structured training program resulting in a certificate of completion.",
      "Sometimes rigorous, sometimes more informational — depends on the program.",
    ],
    whatItDoesNotGuarantee: [
      "A certificate of completion is not the same as a clinical license.",
      "It may not include supervised clinical practice.",
    ],
    questionsToAsk: [
      "How many hours was it and what did it include (practice, supervision, exams)?",
      "Was there a competency evaluation or just attendance?",
      "How do you use it in your day-to-day clinical work?",
    ],
  },

  member: {
    label: "“Member of…” (an association)",
    whatItCanMean: [
      "They belong to a professional organization (can be a good sign).",
      "Some orgs have strong standards; others are mainly networking.",
    ],
    whatItDoesNotGuarantee: [
      "Membership alone does not prove skill, training hours, or competence.",
    ],
    questionsToAsk: [
      "Does membership require training or is it open enrollment?",
      "Do you pursue continuing education through this organization?",
      "What specific training have you completed within this approach?",
    ],
  },

  supervision: {
    label: "“Supervision / supervised practice”",
    whatItCanMean: [
      "They receive oversight and feedback on their clinical work.",
      "Often improves safety and skill, especially early-career or specialty work.",
    ],
    whatItDoesNotGuarantee: [
      "It does not guarantee fit — but it is usually a positive signal.",
    ],
    questionsToAsk: [
      "Do you currently have supervision/consultation for this approach?",
      "How often, and with whom?",
      "How do you use feedback from supervision in sessions with clients?",
    ],
  },
};

const FIVE_QUESTIONS = [
  "What do sessions usually look like (talking, tools, exercises, body-based, creative)?",
  "What should we focus on first — and why?",
  "What would progress look like in 4–6 sessions?",
  "How do you adjust if something is not working for me?",
  "What training + experience do you have with what I am coming in for?",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700 leading-relaxed">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </div>
  );
}

export default function TrainingTranslator() {
  const [selected, setSelected] = useState<PhraseKey>("trained");
  const entry = useMemo(() => ENTRIES[selected], [selected]);

  return (
    <section id="training-translator" className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <Eyebrow>Tool</Eyebrow>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Training terms, translated
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Therapists describe training in lots of ways (“trained in…”, “certified in…”, “informed by…”).
          This helps you interpret what you are seeing and ask clearer questions — without turning this page
          into a giant list.
        </p>
      </div>

      {/* Soft panel behind content */}
      <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5 sm:p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Translator card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-base text-slate-700 shadow-sm"
              >
                🔎
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">
                  Training Translator
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Pick a phrase you saw on a therapist’s website.
                </p>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="sr-only">Select a training phrase</span>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value as PhraseKey)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              >
                <option value="certified">“Certified in…”</option>
                <option value="trained">“Trained in…”</option>
                <option value="informed">“Informed by…”</option>
                <option value="level1">“Level 1”</option>
                <option value="level2">“Level 2 / Advanced”</option>
                <option value="intensive">“Intensive / Institute / Immersion”</option>
                <option value="consultation">“Consultation hours”</option>
                <option value="certificateProgram">“Certificate program”</option>
                <option value="member">“Member of…”</option>
                <option value="supervision">“Supervision”</option>
              </select>
            </label>

            {/* Single calm result panel */}
            <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{entry.label}</div>

              <div className="mt-5 space-y-5">
                <div>
                  <Eyebrow>What it can mean</Eyebrow>
                  <BulletList items={entry.whatItCanMean} />
                </div>

                <div>
                  <Eyebrow>What it does not guarantee</Eyebrow>
                  <BulletList items={entry.whatItDoesNotGuarantee} />
                </div>

                <div>
                  <Eyebrow>Ask this</Eyebrow>
                  <BulletList items={entry.questionsToAsk} />
                </div>

                {entry.bestNextStep ? (
                  <div className="pt-1">
                    <a
                      href={entry.bestNextStep.href}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                      {entry.bestNextStep.label}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* 5 questions card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-base text-slate-700 shadow-sm"
              >
                ✅
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">
                  The 5 questions for faster fit
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  If you are new to therapy, this helps you quickly narrow down what kind of support might work for you.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm">
              <Eyebrow>Use in a consult or intake</Eyebrow>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 leading-relaxed">
                {FIVE_QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>

              <p className="mt-4 text-xs leading-relaxed text-slate-600">
                You are not trying to “get the right answer.” You are gathering enough information to decide what feels workable.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="/quiz"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm btn-brand"
              >
                Take the quiz →
              </a>
              <a
                href="/therapies"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Browse therapy styles →
              </a>
              <a
                href="/questions#fit-matters"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Read about fit →
              </a>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Practical note: many therapists do not offer free consults — you can still ask these in an intake.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
