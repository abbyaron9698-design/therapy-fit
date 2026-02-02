// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function normalizeEmail(s: string) {
  return (s ?? "").trim().toLowerCase();
}

function md5Hex(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

function safeString(v: unknown, max = 120) {
  if (typeof v !== "string") return "";
  const s = v.trim();
  return s.length > max ? s.slice(0, max) : s;
}

function getIpHint(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  return xff.split(",")[0]?.trim() || "unknown";
}

// ---- Simple in-memory rate limiter (good enough for early stage) ----
const rl = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQ = 20;

function rateLimitOk(key: string) {
  const t = Date.now();
  const cur = rl.get(key);
  if (!cur || t > cur.resetAt) {
    rl.set(key, { count: 1, resetAt: t + WINDOW_MS });
    return true;
  }
  if (cur.count >= MAX_REQ) return false;
  cur.count += 1;
  return true;
}

async function mailchimpUpsert({
  email,
  source,
  tag,
  extraTags,
}: {
  email: string;
  source: string;
  tag: string;
  extraTags: string[];
}) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. "us21"
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !serverPrefix || !audienceId) {
    return { ok: false as const, error: "mailchimp_env_missing" as const };
  }

  const subscriberHash = md5Hex(email);
  const memberUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;

  // Timeout protection
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);

  try {
    // Upsert member (double opt-in)
    const res = await fetch(memberUrl, {
      method: "PUT",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      signal: ac.signal,
      body: JSON.stringify({
        email_address: email,
        status_if_new: "pending",
        status: "pending",
        merge_fields: {},
      }),
    });

    if (!res.ok) return { ok: false as const, error: "mailchimp_failed" as const };

    // Apply tags via tags endpoint
    const tagsUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}/tags`;

    const tags = Array.from(
      new Set([
        tag,
        `source:${source}`,
        ...extraTags.filter(Boolean),
      ])
    )
      .map((t) => safeString(t, 80))
      .filter(Boolean);

    if (tags.length) {
      await fetch(tagsUrl, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: tags.map((name) => ({ name, status: "active" })),
        }),
      }).catch(() => {});
    }

    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "mailchimp_failed" as const };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  try {
    const ipHint = getIpHint(req);
    if (!rateLimitOk(ipHint)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));

    // Honeypot (optional): if you ever add an invisible field like "website", bots fill it
    const honeypot = safeString(body?.website ?? "", 80);
    if (honeypot) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const email = normalizeEmail(body?.email ?? "");

    // Allow "optional email" UX: treat empty as ok/no-op
    if (!email) return NextResponse.json({ ok: true, skipped: true });

    if (!email.includes("@") || email.length > 254) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // Consent is required (keep strict; it protects you long-term)
    const consent = Boolean(body?.consent);
    if (!consent) {
      return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
    }

    const source = safeString(body?.source ?? "unknown", 60) || "unknown";
    const tag = safeString(body?.tag ?? "source:provider_shortlist", 80) || "source:provider_shortlist";

    // Optional meta (useful for segmentation)
    const meta = body?.meta && typeof body.meta === "object" ? body.meta : null;
    const selectedCount =
      typeof meta?.selectedCount === "number" && Number.isFinite(meta.selectedCount)
        ? Math.max(0, Math.min(50, meta.selectedCount))
        : undefined;

    // Optional UTM passthrough (if you start sending it)
    const utm = body?.utm && typeof body.utm === "object" ? body.utm : null;
    const extraTags: string[] = [];
    if (typeof selectedCount === "number") extraTags.push(`selected:${selectedCount}`);

    if (utm) {
      const src = safeString((utm as any).utm_source, 40);
      const med = safeString((utm as any).utm_medium, 40);
      const camp = safeString((utm as any).utm_campaign, 60);
      if (src) extraTags.push(`utm_source:${src}`);
      if (med) extraTags.push(`utm_medium:${med}`);
      if (camp) extraTags.push(`utm_campaign:${camp}`);
    }

    const mc = await mailchimpUpsert({ email, source, tag, extraTags });
    if (!mc.ok) {
      return NextResponse.json({ ok: false, error: mc.error }, { status: 502 });
    }

    return NextResponse.json({ ok: true, pending: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
