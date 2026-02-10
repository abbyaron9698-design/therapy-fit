// lib/scoring.ts
export { scoreAnswers } from "./quizData";
export type { Answers } from "./quizData";

export { scoreTier2 } from "./quizTier2";
export type { Tier2Answers } from "./quizTier2";

import type { ModalityId } from "./quizData";
import { scoreAnswers } from "./quizData";
import { scoreTier2 } from "./quizTier2";

/**
 * Combined scoring (Tier 1 + Tier 2):
 * - Layer B: base preference + symptom weights (Tier 1)
 * - Layer A: evidence-first discriminators (Tier 2 overrides)
 * - Layer C: gates (from Tier 1 + Tier 2)
 */
export function scoreCombined(tier1: Parameters<typeof scoreAnswers>[0], tier2?: Parameters<typeof scoreTier2>[0]) {
  const s1 = scoreAnswers(tier1);
  if (!tier2) return { ...s1, tier: 1 as const };

  const s2 = scoreTier2(tier2);

  // Merge scores: Tier 1 is broad base; Tier 2 refines/overrides.
  const mergedScores = { ...s1.scores } as Record<ModalityId, number>;
  for (const [k, v] of Object.entries(s2.scores) as [ModalityId, number][]) {
    mergedScores[k] = (mergedScores[k] ?? 0) + (v ?? 0);
  }

  // Merge reasons (Tier 2 first so evidence reasons appear)
  const mergedReasons = { ...s1.topReasons } as Record<ModalityId, string[]>;
  for (const [k, rs] of Object.entries(s2.reasons) as [ModalityId, string[]][]) {
    const existing = mergedReasons[k] ?? [];
    const combined = [...rs, ...existing];
    // unique + cap
    mergedReasons[k] = Array.from(new Set(combined)).slice(0, 3);
  }

  const ranked = (Object.entries(mergedScores) as [ModalityId, number][])
    .filter(([id]) => id !== "med")
    .sort((a, b) => b[1] - a[1]);

  const top3 = ranked.slice(0, 3).map(([id]) => id);

  // meds is still a flag
  const medFlag: "no" | "consider" = (mergedScores.med ?? 0) >= 1.4 ? "consider" : "no";

  const topReasons: Record<ModalityId, string[]> = { ...mergedReasons };
  for (const id of top3) {
    const rs = topReasons[id] ?? [];
    topReasons[id] = rs.slice(0, 3);
    if (!topReasons[id].length) topReasons[id] = ["Matches what you’re looking for based on what you shared."];
  }

  return {
    top3,
    medFlag,
    topReasons,
    scores: mergedScores,
    confidence: s1.confidence, // keep Tier 1 explainable confidence for now
    gates: {
      ...(s1 as any).gates,
      ...(s2 as any).gates,
    },
    tier: 2 as const,
  };
}
