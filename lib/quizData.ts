// lib/quizData.ts
// Tier 1 (broad + evidence-informed) quiz + scoring + confidence

export type ModalityId =
  | "cbt"
  | "dbt"
  | "act"
  | "erp"
  | "emdr"
  | "somatic"
  | "ifs"
  | "psychodynamic"
  | "narrative"
  | "family"
  | "group"
  | "art"
  | "music"
  | "med";

export const MODALITY_LABELS: Record<ModalityId, string> = {
  cbt: "CBT",
  dbt: "DBT",
  act: "ACT",
  erp: "ERP",
  emdr: "EMDR",
  somatic: "Somatic",
  ifs: "IFS",
  psychodynamic: "Psychodynamic",
  narrative: "Narrative",
  family: "Family Systems",
  group: "Group Therapy",
  art: "Art Therapy",
  music: "Music Therapy",
  med: "Medication consult",
};

export type Tier = 1;

export type QuestionId = "symptoms" | "distressFirst" | "helps" | "therapyFeel";

export type Option = {
  id: string;
  label: string;
  // weights -> modalities
  w: Partial<Record<ModalityId, number>>;
  // reasons -> modalities (short bullets)
  r?: Partial<Record<ModalityId, string[]>>;
};

export type Question =
  | {
      tier: Tier;
      id: QuestionId;
      kind: "multi";
      title: string;
      subtitle?: string;
      options: Option[];
    }
  | {
      tier: Tier;
      id: QuestionId;
      kind: "single";
      title: string;
      subtitle?: string;
      options: Option[];
    };

export type Answers = Partial<Record<QuestionId, string[] | string>>;

function addReason(
  bucket: Record<ModalityId, string[]>,
  id: ModalityId,
  reason: string
) {
  if (!reason) return;
  const list = bucket[id] ?? (bucket[id] = []);
  if (!list.includes(reason)) list.push(reason);
}

function getSelected(q: Question, answers: Answers): string[] {
  const v = answers[q.id];
  if (q.kind === "multi") {
    return Array.isArray(v) ? v : [];
  }
  // single
  return typeof v === "string" && v ? [v] : [];
}

export function scoreAnswers(answers: Answers) {
  const scores: Record<ModalityId, number> = {
    cbt: 0,
    dbt: 0,
    act: 0,
    erp: 0,
    emdr: 0,
    somatic: 0,
    ifs: 0,
    psychodynamic: 0,
    narrative: 0,
    family: 0,
    group: 0,
    art: 0,
    music: 0,
    med: 0,
  };

  const reasons: Record<ModalityId, string[]> = {
    cbt: [],
    dbt: [],
    act: [],
    erp: [],
    emdr: [],
    somatic: [],
    ifs: [],
    psychodynamic: [],
    narrative: [],
    family: [],
    group: [],
    art: [],
    music: [],
    med: [],
  };

  // Normalize: selecting many items in a multi question shouldn't overpower the signal.
  // For each question: divide option weights by number of selections for that question.
  for (const q of QUESTIONS) {
    const selected = getSelected(q, answers);
    if (!selected.length) continue;

    const denom = q.kind === "multi" ? selected.length : 1;

    for (const optId of selected) {
      const opt = q.options.find((o) => o.id === optId);
      if (!opt) continue;

      for (const [mid, w] of Object.entries(opt.w) as [ModalityId, number][]) {
        scores[mid] += (w ?? 0) / denom;
      }

      if (opt.r) {
        for (const [mid, rs] of Object.entries(opt.r) as [
          ModalityId,
          string[]
        ][]) {
          for (const reason of rs) addReason(reasons, mid, reason);
        }
      }
    }
  }

  const entries = Object.entries(scores) as [ModalityId, number][];

  // meds is a flag, not a winner
  const medScore = scores.med;
  const medFlag: "no" | "consider" = medScore >= 1.4 ? "consider" : "no";

  // rank excluding meds
  const ranked = entries
    .filter(([id]) => id !== "med")
    .sort((a, b) => b[1] - a[1]);

  const top3 = ranked.slice(0, 3).map(([id]) => id);

  // Provide up to 3 reasons per top modality; if none, add a fallback
  const topReasons: Record<ModalityId, string[]> = {
    cbt: [],
    dbt: [],
    act: [],
    erp: [],
    emdr: [],
    somatic: [],
    ifs: [],
    psychodynamic: [],
    narrative: [],
    family: [],
    group: [],
    art: [],
    music: [],
    med: [],
  };

  for (const id of top3) {
    const rs = reasons[id] ?? [];
    topReasons[id] = rs.slice(0, 3);
    if (!topReasons[id].length) {
      // ✅ avoids repeating “answers”
      topReasons[id] = ["Matches what you’re looking for based on what you shared."];
    }
  }

  // --------------------
  // Confidence (simple + explainable)
  // --------------------
  const topScore = ranked[0]?.[1] ?? 0;
  const secondScore = ranked[1]?.[1] ?? 0;
  const thirdScore = ranked[2]?.[1] ?? 0;

  const gap12 = topScore - secondScore;
  const gap23 = secondScore - thirdScore;

  const totalNonMed = ranked.reduce((sum, [, v]) => sum + (v ?? 0), 0);

  let confidenceLevel: "strong" | "good" | "explore" = "explore";
  if (totalNonMed >= 6.0 && gap12 >= 1.0) confidenceLevel = "strong";
  else if (totalNonMed >= 4.0 && gap12 >= 0.5) confidenceLevel = "good";
  else confidenceLevel = "explore";

  const confidenceLabel =
    confidenceLevel === "strong"
      ? "Strong match"
      : confidenceLevel === "good"
      ? "Good fit"
      : "Worth exploring";

  // ✅ Updated copy (no “answers” repetition, reads cleaner on Results)
  const confidenceWhy =
    confidenceLevel === "strong"
      ? "Your top match stood out clearly across multiple areas you selected."
      : confidenceLevel === "good"
      ? "Your top match was consistent, with a couple approaches close behind."
      : "Several approaches were close — which is common. Your preferences and therapist fit will matter most.";

  return {
    top3,
    medFlag,
    topReasons,
    scores,
    confidence: {
      level: confidenceLevel,
      label: confidenceLabel,
      why: confidenceWhy,
      details: {
        topScore,
        secondScore,
        thirdScore,
        gap12,
        gap23,
        totalNonMed,
      },
    },
  };
}

// --------------------
// Tier 1 Questions
// --------------------

export const QUESTIONS: Question[] = [
  {
    tier: 1,
    id: "symptoms",
    kind: "multi",
    title: "Please identify your current challenges.",
    subtitle: "Select all that apply (no limit).",
    options: [
      {
        id: "rumination",
        label: "Persistent worry or rumination",
        w: { cbt: 2.0, act: 1.8 },
        r: {
          cbt: ["You reported worry/rumination that CBT can help you rework."],
          act: ["ACT can help you relate differently to sticky thoughts."],
        },
      },
      {
        id: "avoidance",
        label: "Avoiding situations, thoughts, or feelings",
        w: { cbt: 2.0, act: 1.6, erp: 1.2 },
        r: {
          cbt: ["Avoidance patterns often respond well to gradual skillful practice."],
          act: ["ACT supports approaching life while making room for discomfort."],
          erp: ["If avoidance is OCD-related, ERP may be especially effective."],
        },
      },
      {
        id: "overwhelm",
        label: "Strong emotional swings or overwhelm",
        w: { dbt: 2.4, somatic: 1.3 },
        r: {
          dbt: ["DBT targets emotion regulation and distress tolerance."],
          somatic: ["Somatic work can support nervous-system regulation."],
        },
      },
      {
        id: "panic",
        label: "Panic or intense physical anxiety",
        w: { cbt: 1.8, somatic: 1.8, act: 1.0 },
        r: {
          cbt: ["CBT can reduce panic cycles through skills and gradual exposure."],
          somatic: ["Body-first approaches can help calm physical activation."],
        },
      },
      {
        id: "intrusions_compulsions",
        label: "Intrusive thoughts or repetitive behaviors",
        w: { erp: 3.0, cbt: 1.0 },
        r: {
          erp: ["ERP is a gold-standard approach when compulsions/rituals are present."],
        },
      },
      {
        id: "trauma_reminders",
        label: "Distressing memories or reminders",
        w: { emdr: 2.6, somatic: 2.0, ifs: 1.0 },
        r: {
          emdr: ["EMDR is designed to process distressing memories that feel ‘stuck’."],
          somatic: ["Somatic approaches can reduce trauma-related activation in the body."],
          ifs: ["Parts work can be helpful when trauma shows up as inner conflict/shame."],
        },
      },
      {
        id: "numb",
        label: "Feeling numb, shut down, or disconnected",
        w: { somatic: 2.4, psychodynamic: 1.4, ifs: 1.2 },
        r: {
          somatic: ["Somatic approaches can help expand your window of tolerance."],
          psychodynamic: ["Insight-oriented work can explore what’s driving shutdown."],
        },
      },
      {
        id: "meaning_loss",
        label: "Low motivation or loss of meaning",
        w: { act: 2.4, cbt: 1.6, narrative: 1.4 },
        r: {
          act: ["ACT rebuilds momentum through values-based action."],
          cbt: ["CBT supports behavioral activation and realistic thinking patterns."],
          narrative: ["Narrative therapy can help re-author identity and meaning."],
        },
      },
      {
        id: "bio_disruption",
        label: "Sleep, appetite, or energy disruption",
        w: { med: 2.0, cbt: 1.0 },
        r: {
          med: ["Significant sleep/appetite/energy changes can be worth a med consult."],
        },
      },
    ],
  },

  {
    tier: 1,
    id: "distressFirst",
    kind: "multi",
    title: "When distress shows up, what happens first?",
    subtitle: "Select all that apply.",
    options: [
      {
        id: "spiral",
        label: "My thoughts spiral",
        w: { cbt: 1.8, act: 1.6 },
        r: {
          cbt: ["Your distress starts cognitively; CBT can target thought-behavior loops."],
          act: ["ACT can help you unhook from spirals and return to values."],
        },
      },
      {
        id: "body_first",
        label: "My body reacts before I can think",
        w: { somatic: 2.3, emdr: 1.2 },
        r: {
          somatic: ["You described body-first activation; somatic therapy often fits."],
          emdr: ["If body reactions are linked to memory triggers, EMDR can help."],
        },
      },
      {
        id: "flooded",
        label: "I feel flooded and overwhelmed",
        w: { dbt: 2.2, somatic: 1.4 },
        r: {
          dbt: ["DBT provides step-by-step skills for high emotional intensity."],
        },
      },
      {
        id: "shutdown",
        label: "I shut down or go numb",
        w: { somatic: 2.2, ifs: 1.2, psychodynamic: 1.0 },
        r: {
          somatic: ["Somatic approaches can help with shutdown/freeze responses."],
        },
      },
      {
        id: "dissociate",
        label: "I dissociate or feel unreal",
        w: { somatic: 2.6, emdr: 1.0 },
        r: {
          somatic: ["Dissociation often benefits from stabilization + body-based pacing."],
        },
      },
      {
        id: "urge_escape",
        label: "I feel urges to escape or act quickly",
        w: { dbt: 2.4, act: 1.2 },
        r: {
          dbt: ["DBT targets urges with distress tolerance + impulse tools."],
        },
      },
    ],
  },

  {
    tier: 1,
    id: "helps",
    kind: "multi",
    title: "What tends to help—even a little?",
    subtitle: "Select all that apply.",
    options: [
      {
        id: "understanding",
        label: "Understanding what’s happening and why",
        w: { cbt: 1.5, psychodynamic: 1.5, ifs: 1.2 },
        r: {
          psychodynamic: ["You prefer understanding patterns; insight work may fit."],
        },
      },
      {
        id: "tools",
        label: "Concrete tools or step-by-step skills",
        w: { cbt: 1.8, dbt: 2.0, erp: 1.0 },
        r: {
          dbt: ["You want concrete tools; DBT is built around skills practice."],
          cbt: ["You prefer practical tools; CBT aligns with that style."],
        },
      },
      {
        id: "talk",
        label: "Talking it through",
        w: { psychodynamic: 1.6, narrative: 1.4, ifs: 1.2 },
      },
      {
        id: "mindfulness",
        label: "Mindfulness or grounding",
        w: { act: 1.6, somatic: 1.2 },
        r: {
          act: ["You benefit from mindfulness/grounding; ACT often integrates this."],
        },
      },
      {
        id: "creative",
        label: "Creative or visual expression",
        w: { art: 2.2, narrative: 1.0, somatic: 0.8, music: 1.4 },
        r: {
          art: ["You learn through creative expression; art therapy may fit strongly."],
          music: ["Music-based processing can support regulation and expression."],
        },
      },
      {
        id: "others",
        label: "Feedback or support from others",
        w: { group: 2.0, dbt: 1.0, family: 0.8 },
        r: {
          group: ["You learn with others; group therapy can be powerful for practice."],
        },
      },
    ],
  },

  {
    tier: 1,
    id: "therapyFeel",
    kind: "single",
    title: "Right now, what are you hoping therapy feels like?",
    subtitle: "Pick one.",
    options: [
      {
        id: "structured",
        label: "Structured and guided",
        w: { cbt: 2.0, dbt: 1.8, erp: 1.4 },
        r: { cbt: ["You prefer structure and guidance, which fits CBT-style work."] },
      },
      {
        id: "exploratory",
        label: "Flexible and exploratory",
        w: { psychodynamic: 2.0, ifs: 1.8, narrative: 1.4 },
        r: { psychodynamic: ["You want exploratory space; insight-oriented therapy may fit."] },
      },
      {
        id: "relief",
        label: "Focused on relief and stabilization",
        w: { dbt: 2.2, somatic: 1.6, med: 1.2 },
        r: { dbt: ["You want stabilization; DBT skills are often helpful here."] },
      },
      {
        id: "unsure",
        label: "Unsure, but open",
        w: { act: 1.8, cbt: 1.0, narrative: 0.8 },
        r: { act: ["ACT can be a flexible starting point when you’re unsure."] },
      },
      {
        id: "values",
        label: "Meaning- or values-oriented",
        w: { act: 2.4, narrative: 1.6 },
        r: { act: ["Values-guided direction is central to ACT."] },
      },
    ],
  },
];
