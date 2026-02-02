// app/api/toolkit-lead/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

type Body = {
  email?: string;
  unlocked?: boolean;
  amount?: number | null;
  focus?: string | null;
  profile?: string | null;
  source?: string | null;
};

function isEmail(s: string) {
  const x = (s ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x) && x.length <= 254;
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// Basic in-memory rate limit (best-effort; resets on redeploy/cold start)
const BUCKET_MS = 60_000; // 1 minute
const MAX_PER_BUCKET = 12;

const seen = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `ip:${ip}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const cur = seen.get(key);

  if (!cur || now > cur.resetAt) {
    seen.set(key, { count: 1, resetAt: now + BUCKET_MS });
    return false;
  }

  if (cur.count >= MAX_PER_BUCKET) return true;

  cur.count += 1;
  seen.set(key, cur);
  return false;
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (isRateLimited(key)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const emailRaw = (body?.email ?? "").trim().toLowerCase();
  if (!emailRaw || !isEmail(emailRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const salt = process.env.TOOLKIT_LEAD_SALT || "dev_salt_change_me";
  const emailHash = sha256Hex(`${salt}:${emailRaw}`);

  const amount =
    typeof body?.amount === "number" && Number.isFinite(body.amount) ? body.amount : null;

  console.log("[toolkit_lead]", {
    emailHash, // ✅ no raw email in logs
    unlocked: Boolean(body?.unlocked),
    amount,
    focus: body?.focus ?? null,
    profile: body?.profile ?? null,
    source: body?.source ?? "toolkit_download",
    ts: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
