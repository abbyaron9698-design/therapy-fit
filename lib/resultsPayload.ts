// lib/resultsPayload.ts
import type { ModalityId } from "./quizData";

export type ResultsConfidence = {
  level: "strong" | "good" | "explore";
  label: string;
  why: string;
  details?: Record<string, unknown>;
};

export type ResultsPayloadV1 = {
  v: 1;
  top: ModalityId[];
  med: "consider" | "no";
  reasons: Partial<Record<ModalityId, string[]>>;
  confidence?: ResultsConfidence | null;

  // Optional, for growth/analytics attribution
  meta?: {
    source?: string; // e.g. "quiz"
    utm?: Partial<Record<string, string>>;
    ts?: string; // ISO
  };
};

const MODALITY_SET = new Set<ModalityId>([
  "cbt",
  "dbt",
  "act",
  "erp",
  "emdr",
  "somatic",
  "ifs",
  "psychodynamic",
  "narrative",
  "family",
  "group",
  "art",
  "music",
  "med",
]);

function isString(x: unknown): x is string {
  return typeof x === "string";
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every(isString);
}

function isModalityId(x: unknown): x is ModalityId {
  return isString(x) && MODALITY_SET.has(x as ModalityId);
}

// Base64url helpers (browser + node/server safe)
function base64UrlEncodeUtf8(s: string) {
  // Browser
  if (typeof window !== "undefined") {
    const bytes = new TextEncoder().encode(s);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    const b64 = btoa(bin);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  // Server (Node)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const buf = Buffer.from(s, "utf8");
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecodeUtf8(s: string) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);

  // Browser
  if (typeof window !== "undefined") {
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  // Server (Node)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const buf = Buffer.from(padded, "base64");
  return buf.toString("utf8");
}

export function encodeResultsPayload(payload: ResultsPayloadV1) {
  const json = JSON.stringify(payload);
  return base64UrlEncodeUtf8(json);
}

export function decodeResultsPayload(encoded: string): ResultsPayloadV1 | null {
  try {
    const json = base64UrlDecodeUtf8(encoded);
    const raw = JSON.parse(json) as unknown;
    return normalizePayload(raw);
  } catch {
    return null;
  }
}

export function normalizePayload(raw: unknown): ResultsPayloadV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  // Versioning (default to v=1 if missing for safety)
  const v = o.v === 1 ? 1 : 1;

  const topRaw = o.top;
  const top = Array.isArray(topRaw) ? topRaw.filter(isModalityId) : [];

  const med = o.med === "consider" ? "consider" : "no";

  const reasonsRaw = o.reasons;
  const reasons: Partial<Record<ModalityId, string[]>> = {};
  if (reasonsRaw && typeof reasonsRaw === "object") {
    for (const [k, v] of Object.entries(reasonsRaw as Record<string, unknown>)) {
      if (isModalityId(k) && isStringArray(v)) reasons[k] = v;
    }
  }

  const confidenceRaw = o.confidence;
  let confidence: ResultsPayloadV1["confidence"] = null;
  if (confidenceRaw && typeof confidenceRaw === "object") {
    const c = confidenceRaw as Record<string, unknown>;
    const level =
      c.level === "strong" || c.level === "good" || c.level === "explore"
        ? (c.level as "strong" | "good" | "explore")
        : null;
    const label = isString(c.label) ? c.label : null;
    const why = isString(c.why) ? c.why : null;

    if (level && label && why) {
      confidence = {
        level,
        label,
        why,
        details:
          c.details && typeof c.details === "object"
            ? (c.details as Record<string, unknown>)
            : undefined,
      };
    }
  }

  const metaRaw = o.meta;
  const meta: ResultsPayloadV1["meta"] = {};
  if (metaRaw && typeof metaRaw === "object") {
    const m = metaRaw as Record<string, unknown>;
    if (isString(m.source)) meta.source = m.source;
    if (isString(m.ts)) meta.ts = m.ts;

    const utmRaw = m.utm;
    if (utmRaw && typeof utmRaw === "object") {
      const utm: Record<string, string> = {};
      for (const [k, v] of Object.entries(utmRaw as Record<string, unknown>)) {
        if (isString(v) && v) utm[k] = v;
      }
      meta.utm = utm;
    }
  }

  return {
    v,
    top,
    med,
    reasons,
    confidence,
    meta,
  };
}
