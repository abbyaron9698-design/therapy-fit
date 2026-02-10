// lib/quizTier2.ts
import type { ModalityId } from "./quizData";
import { MODALITY_LABELS } from "./quizData";

export type Tier2Id =
  | "ocdSignal"
  | "traumaReadiness"
  | "bodyVsCognitive"
  | "relationshipFocus"
  | "supportLevel";

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
    subtitle:
      "Select all that apply (helps distinguish ERP-fit patterns vs general worry).",
    options: [
      {
        id: "rituals",
        label:
          "I do something repeatedly to feel “certain” or safe (checking, reassurance, mental review)",
        w: { erp: 3.0, cbt: 1.0 },
        r: {
          erp: [
            "Repeating checking/reassurance/mental review loops often respond best to ERP-style treatment.",
          ],
        },
      },
      {
        id: "avoidTriggers",
        label: "I avoid triggers to prevent distress",
        w: { erp: 1.8, cbt: 1.4, act: 1.0 },
        r: { erp: ["Avoidance + repeated safety behaviors are a key ERP-fit signal."] },
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
        label:
          "I need stabilization first (sleep, safety, overwhelm, dissociation)",
        w: { dbt: 2.2, somatic: 2.0, cbt: 1.0 },
        r: {
          somatic: [
            "Body-based stabilization can expand your window of tolerance first.",
          ],
        },
      },
      {
        id: "ready",
        label: "I feel ready to work directly with stuck memories/triggers",
        w: { emdr: 2.4, somatic: 1.2, ifs: 1.2 },
        r: {
          emdr: ["EMDR is designed to process distressing memories that feel stuck."],
        },
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
        label:
          "My body leads (tight chest, nausea, freeze, adrenaline) before thoughts",
        w: { somatic: 2.4, emdr: 1.2 },
        r: { somatic: ["Body-first activation is a strong signal for somatic approaches."] },
      },
      {
        id: "thoughts",
        label:
          "My thoughts lead (rumination, catastrophic predictions, self-criticism)",
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

  {
    id: "supportLevel",
    kind: "single",
    title: "How much support feels right for you right now?",
    subtitle: "Pick what matches your current needs — you can change this later.",
    options: [
      {
        id: "weekly",
        label: "Weekly therapy is enough",
        w: { cbt: 0.4, act: 0.4, psychodynamic: 0.4, narrative: 0.3 },
        r: {
          cbt: [
            "Weekly sessions can be a strong baseline for structured growth and skill-building.",
          ],
        },
      },
      {
        id: "more_structure",
        label: "I want a bit more structure",
        w: { dbt: 1.0, group: 0.9, cbt: 0.5, act: 0.4 },
        r: { dbt: ["More structure often pairs well with skills practice and accountability."] },
      },
      {
        id: "more_than_weekly",
        label: "I may need more support than weekly therapy",
        w: { dbt: 1.2, group: 0.8, somatic: 0.4, med: 0.3 },
        r: {
          dbt: [
            "When things feel harder to manage day-to-day, more frequent support can help stabilize and build skills faster.",
          ],
        },
      },
      {
        id: "not_sure",
        label: "I’m not sure",
        w: { act: 0.5, cbt: 0.3 },
        r: {
          act: [
            "It’s okay to be unsure — you can start with a flexible approach and adjust as you learn what helps.",
          ],
        },
      },
    ],
  },
];

// small helper to avoid duplicates
function pushUnique(list: string[], item: string) {
  if (!item) return;
  if (!list.includes(item)) list.push(item);
}

/**
 * Layer A (strongest evidence-first discriminators) live here,
 * because Tier 2 questions include the “this vs that” signals.
 */
function applyEvidenceOverrides(
  answers: Tier2Answers,
  scores: Record<ModalityId, number>,
  reasons: Record<ModalityId, string[]>
) {
  const ocd = arr(answers.ocdSignal as any);
  const trauma = (answers.traumaReadiness as string | undefined) ?? "";

  const hasRitualSignal = ocd.includes("rituals") || ocd.includes("avoidTriggers");
  const saysNoRitual = ocd.includes("noRitual");

  // Repeated checking/reassurance loops => ERP should rise to the top.
  if (hasRitualSignal) {
    scores.erp += 2.5;
    pushUnique(
      reasons.erp,
      "Your answers suggest a repeated checking/reassurance loop — ERP is a well-supported approach for breaking that pattern."
    );
  }

  // If they explicitly said “no rituals,” do NOT push ERP aggressively.
  if (saysNoRitual) {
    scores.erp -= 0.8;
  }

  // Trauma readiness gate: stabilize first should downweight memory-processing recs.
  if (trauma === "stabilize") {
    scores.emdr -= 1.2;
    scores.dbt += 0.8;
    scores.somatic += 0.8;
    pushUnique(
      reasons.dbt,
      "You endorsed stabilization-first — skills and pacing can help build a safer base before deeper processing."
    );
    pushUnique(
      reasons.somatic,
      "Stabilization-first often benefits from nervous-system and body-based grounding."
    );
  }

  // If ready, it's fair to boost EMDR.
  if (trauma === "ready") {
    scores.emdr += 0.6;
    pushUnique(
      reasons.emdr,
      "You endorsed readiness to work directly with stuck memories — EMDR is designed for that kind of processing."
    );
  }
}

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
          for (const r of rs) pushUnique(reasons[mid], r);
        }
      }
    }
  }

  applyEvidenceOverrides(answers, scores, reasons);

  const supportLevel = (answers.supportLevel as string | undefined) ?? "";
  const gates = {
    stabilizationFirst:
      (answers.traumaReadiness as string | undefined) === "stabilize",
    ocdStrongSignal:
      arr(answers.ocdSignal as any).includes("rituals") ||
      arr(answers.ocdSignal as any).includes("avoidTriggers"),
    considerHigherSupport: supportLevel === "more_than_weekly",
  };

  return { scores, reasons, gates };
}
