// lib/resultsPayload.ts
import type { ModalityId } from "./quizData";

export type ResultsConfidence = {
  level: "strong" | "good" | "explore";
  label: string;
  why: string;
  details?: Record<string, unknown>;
};

export type ResultsGates = {
  stabilizationFirst?: boolean;
  traumaProcessingReady?: boolean;

  /**
   * Pattern-based signal (avoids diagnosis language).
   * Think: intrusive thoughts → urges to check/reassure/mentally review → relief → loop repeats.
   */
  certaintyLoopSignal?: boolean;

  considerHigherSupport?: boolean;

  /**
   * Back-compat only. Do not write this going forward.
   * (Kept so older shared links still decode.)
   */
  ocdStrongSignal?: boolean;
};

export type ResultsPayloadV1 = {
  v: 1;
  top: ModalityId[];
  med: "consider" | "no";
  reasons: Partial<Record<ModalityId, string[]>>;
  confidence?: ResultsConfidence | null;
  gates?: ResultsGates;
  meta?: {
    source?: string;
    utm?: Partial<Record<string, string>>;
    ts?: string;
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

function isBool(x: unknown): x is boolean {
  return typeof x === "boolean";
}

/**
 * Base64url helpers that work in:
 * - Browser
 * - Node
 * - Edge runtime (no Buffer)
 *
 * Strategy:
 * - Prefer Web APIs (TextEncoder/TextDecoder + btoa/atob) when available
 * - Fall back to Buffer only if it exists
 */
function hasWebB64(): boolean {
  return (
    typeof globalThis !== "undefined" &&
    typeof globalThis.btoa === "function" &&
    typeof globalThis.atob === "function"
  );
}

function hasBuffer(): boolean {
  return (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as any).Buffer !== "undefined"
  );
}

function base64UrlEncodeUtf8(s: string) {
  if (hasWebB64()) {
    const bytes = new TextEncoder().encode(s);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = globalThis.btoa(bin);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  if (hasBuffer()) {
    const buf = (globalThis as any).Buffer.from(s, "utf8");
    return buf
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  throw new Error("No base64 encoder available in this runtime.");
}

function base64UrlDecodeUtf8(s: string) {
  const padded =
    s.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((s.length + 3) % 4);

  if (hasWebB64()) {
    const bin = globalThis.atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  if (hasBuffer()) {
    const buf = (globalThis as any).Buffer.from(padded, "base64");
    return buf.toString("utf8");
  }

  throw new Error("No base64 decoder available in this runtime.");
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

  const v = 1;

  const topRaw = o.top;
  const top = Array.isArray(topRaw) ? topRaw.filter(isModalityId) : [];

  const med = o.med === "consider" ? "consider" : "no";

  const reasonsRaw = o.reasons;
  const reasons: Partial<Record<ModalityId, string[]>> = {};
  if (reasonsRaw && typeof reasonsRaw === "object") {
    for (const [k, vv] of Object.entries(reasonsRaw as Record<string, unknown>)) {
      if (isModalityId(k) && isStringArray(vv)) reasons[k] = vv;
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

  const gatesRaw = o.gates;
  let gates: ResultsPayloadV1["gates"] = undefined;
  if (gatesRaw && typeof gatesRaw === "object") {
    const g = gatesRaw as Record<string, unknown>;
    const next: ResultsGates = {};

    if (isBool(g.stabilizationFirst))
      next.stabilizationFirst = g.stabilizationFirst;
    if (isBool(g.traumaProcessingReady))
      next.traumaProcessingReady = g.traumaProcessingReady;
    if (isBool(g.considerHigherSupport))
      next.considerHigherSupport = g.considerHigherSupport;

    // New pattern-based field
    if (isBool(g.certaintyLoopSignal))
      next.certaintyLoopSignal = g.certaintyLoopSignal;

    // Back-compat: accept old field and map it forward
    if (isBool(g.ocdStrongSignal)) {
      next.ocdStrongSignal = g.ocdStrongSignal;
      if (next.certaintyLoopSignal === undefined) {
        next.certaintyLoopSignal = g.ocdStrongSignal;
      }
    }

    gates = Object.keys(next).length ? next : undefined;
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
      for (const [k, vv] of Object.entries(utmRaw as Record<string, unknown>)) {
        if (isString(vv) && vv) utm[k] = vv;
      }
      meta.utm = utm;
    }
  }

  return { v, top, med, reasons, confidence, gates, meta };
}
