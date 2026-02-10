// app/results/[id]/page.tsx
import { redirect } from "next/navigation";
import {
  encodeResultsPayload,
  normalizePayload,
  type ResultsPayloadV1,
} from "../../../lib/resultsPayload";

function safeLegacyParse(input: string) {
  try {
    return JSON.parse(decodeURIComponent(input));
  } catch {
    return null;
  }
}

export default function LegacyResultsRedirect({
  params,
}: {
  params: { id: string };
}) {
  const raw = safeLegacyParse(params.id);
  const normalized = normalizePayload(raw);

  if (!normalized) redirect("/results");

  const payload: ResultsPayloadV1 = {
    ...normalized,
    v: 1,
    meta: {
      ...(normalized.meta ?? {}),
      source: normalized.meta?.source ?? "legacy_results_link",
      ts: normalized.meta?.ts ?? new Date().toISOString(),
    },
  };

  const encoded = encodeResultsPayload(payload);
  redirect(`/results?r=${encodeURIComponent(encoded)}`);
}
