import type { ModalityId } from "./quizData";
import { MODALITY_LABELS } from "./quizData";

export type Tier2Id =
  | "ocdSignal"
  | "traumaReadiness"
  | "bodyVsCognitive"
  | "relationshipFocus";

export type Tier2Question = {
  id: Tier2Id;
  kind: "single" | "multi";
  title: string;
  subtitle?: string;
  options: {
    id: string;
    label: string;
    w: Partial<Record<ModalityId, number>>;
    r?: Partial<Record<ModalityId, string[]>>;
  }[];
};

export type Tier2Answers = Partial<Record<Tier2Id, string[] | string>>;

function arr<T>(x: T | T[] | undefined): T[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

export const TIER2_QUESTIONS: Tier2Question[] = [
  {
    id: "ocdSignal",
    kind: "multi",
    title: "When intrusive thoughts show up, what happens next?",
    subtitle: "Select all that apply (helps distinguish OCD/ERP vs general anxiety).",
    options: [
      {
        id: "rituals",
        label: "I do something repeatedly to feel “certain” or safe (checking, reassurance, mental review)",
        w: { erp: 3.0, cbt: 1.0 },
        r: { erp: ["Reassurance/ritual cycles often respond best to ERP-style treatment."] },
      },
      {
        id: "avoidTriggers",
        label: "I avoid triggers to prevent distress",
        w: { erp: 1.8, cbt: 1.4, act: 1.0 },
        r: { erp: ["Avoidance + ritual patterns are a key ERP signal."] },
      },
      {
        id: "noRitual",
        label: "I get stuck worrying, but I don’t really do rituals/compulsions",
        w: { cbt: 1.8, act: 1.4 },
        r: { cbt: ["CBT can target worry loops when rituals aren’t central."] },
      },
    ],
  },
  {
    id: "traumaReadiness",
    kind: "single",
    title: "If trauma is part of your story, what feels true right now?",
    subtitle: "This helps decide skills-first vs trauma processing.",
    options: [
      {
        id: "stabilize",
        label: "I need stabilization first (sleep, safety, overwhelm, dissociation)",
        w: { dbt: 2.2, somatic: 2.0, cbt: 1.0 },
        r: { somatic: ["Body-based stabilization can expand your window of tolerance first."] },
      },
      {
        id: "ready",
        label: "I feel ready to work directly with stuck memories/triggers",
        w: { emdr: 2.4, somatic: 1.2, ifs: 1.2 },
        r: { emdr: ["EMDR is designed to process distressing memories that feel stuck."] },
      },
      {
        id: "unsure",
        label: "Not sure — I want to go carefully",
        w: { somatic: 2.0, ifs: 1.6, psychodynamic: 1.0 },
        r: { ifs: ["Parts work can be a gentle bridge when you want to go carefully."] },
      },
    ],
  },
  {
    id: "bodyVsCognitive",
    kind: "single",
    title: "Which describes your distress most accurately?",
    subtitle: "No right answer — this helps with fit.",
    options: [
      {
        id: "body",
        label: "My body leads (tight chest, nausea, freeze, adrenaline) before thoughts",
        w: { somatic: 2.4, emdr: 1.2 },
        r: { somatic: ["Body-first activation is a strong signal for somatic approaches."] },
      },
      {
        id: "thoughts",
        label: "My thoughts lead (rumination, catastrophic predictions, self-criticism)",
        w: { cbt: 2.2, act: 1.6 },
        r: { cbt: ["Cognitive loops are a strong CBT signal."] },
      },
      {
        id: "both",
        label: "Both, pretty evenly",
        w: { act: 2.0, somatic: 1.4, cbt: 1.2 },
        r: { act: ["ACT can flex across mind + body while staying values-driven."] },
      },
    ],
  },
  {
    id: "relationshipFocus",
    kind: "single",
    title: "If relationships are part of the stress, what’s the goal?",
    options: [
      {
        id: "skills",
        label: "Concrete relationship skills + boundaries",
        w: { dbt: 1.6, group: 1.4, family: 1.2 },
        r: { dbt: ["DBT often includes interpersonal effectiveness tools."] },
      },
      {
        id: "patterns",
        label: "Understand long-term patterns and attachment dynamics",
        w: { psychodynamic: 2.0, ifs: 1.4 },
        r: { psychodynamic: ["Psychodynamic therapy is built for long-term pattern insight."] },
      },
      {
        id: "support",
        label: "Practice connection with others (I feel isolated)",
        w: { group: 2.2 },
        r: { group: ["Group therapy can reduce isolation and build real-time practice."] },
      },
    ],
  },
];

export function scoreTier2(answers: Tier2Answers) {
  const scores: Record<ModalityId, number> = Object.keys(MODALITY_LABELS).reduce(
    (acc, k) => ({ ...acc, [k]: 0 }),
    {} as Record<ModalityId, number>
  );

  const reasons: Record<ModalityId, string[]> = Object.keys(MODALITY_LABELS).reduce(
    (acc, k) => ({ ...acc, [k]: [] }),
    {} as Record<ModalityId, string[]>
  );

  for (const q of TIER2_QUESTIONS) {
    const selected = arr(answers[q.id] as any);
    if (!selected.length) continue;

    const denom = q.kind === "multi" ? selected.length : 1;

    for (const optId of selected) {
      const opt = q.options.find((o) => o.id === optId);
      if (!opt) continue;

      for (const [mid, w] of Object.entries(opt.w) as [ModalityId, number][]) {
        scores[mid] += (w ?? 0) / denom;
      }

      if (opt.r) {
        for (const [mid, rs] of Object.entries(opt.r) as [ModalityId, string[]][]) {
          for (const r of rs) {
            if (!reasons[mid].includes(r)) reasons[mid].push(r);
          }
        }
      }
    }
  }

  return { scores, reasons };
}
