// app/api/track/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export const runtime = "nodejs";

type TrackEvent = {
  event: string;
  props?: Record<string, unknown>;
  ts?: string;
  path?: string;
};

function safeString(v: unknown, max = 300) {
  if (typeof v !== "string") return undefined;
  return v.length > max ? v.slice(0, max) + "…" : v;
}

function safeProps(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const obj = v as Record<string, unknown>;

  const blocked = new Set(["email", "phone", "name", "fullName", "address"]);
  const out: Record<string, unknown> = {};

  for (const [k, val] of Object.entries(obj)) {
    if (blocked.has(k)) continue;

    if (typeof val === "string") out[k] = safeString(val, 500);
    else if (typeof val === "number" || typeof val === "boolean" || val == null) out[k] = val;
    else if (Array.isArray(val)) out[k] = val.slice(0, 50);
    else if (typeof val === "object") out[k] = "[object]";
    else out[k] = "[unknown]";
  }

  return out;
}

function normalizeEvent(x: any): TrackEvent | null {
  if (!x || typeof x !== "object") return null;
  if (typeof x.event !== "string" || x.event.length > 120) return null;

  return {
    event: x.event,
    props: safeProps(x.props),
    ts: safeString(x.ts, 80),
    path: safeString(x.path, 300),
  };
}

async function readAttribCookie(): Promise<Record<string, string> | null> {
  try {
    const c = await cookies(); // ✅ await
    const raw = c.get("tf_attrib")?.value;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const allowed = new Set([
      "src",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ts",
    ]);

    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!allowed.has(k)) continue;
      if (typeof v === "string" && v) out[k] = v.slice(0, 120);
    }

    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const h = await headers(); // ✅ await
    const meta = {
      ipHint: safeString(h.get("x-forwarded-for") ?? null, 120),
      ua: safeString(h.get("user-agent") ?? null, 200),
      ref: safeString(h.get("referer") ?? null, 300),
      receivedAt: new Date().toISOString(),
    };

    const attrib = await readAttribCookie(); // ✅ await

    let batch: TrackEvent[] = [];

    if (Array.isArray(body?.batch)) {
      batch = body.batch.map(normalizeEvent).filter(Boolean) as TrackEvent[];
    } else if (body?.event) {
      const single = normalizeEvent(body);
      batch = single ? [single] : [];
    }

    const enriched = batch.map((e) => ({
      ...e,
      props: {
        ...(e.props ?? {}),
        attrib: attrib ?? null,
      },
    }));

    console.log("[track]", {
      ...meta,
      count: enriched.length,
      events: enriched.map((e) => e.event),
    });

    return NextResponse.json({ ok: true, count: enriched.length });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
