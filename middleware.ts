// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "tf_attrib";
const MAX_LEN = 120;

// keep it simple + safe: only store non-PII attribution
function pickAttrib(url: URL) {
  const sp = url.searchParams;

  const keys = [
    "src",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ] as const;

  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = sp.get(k);
    if (v) out[k] = v.slice(0, MAX_LEN);
  }

  return Object.keys(out).length ? out : null;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const picked = pickAttrib(url);

  // If no attribution in URL, do nothing.
  if (!picked) return NextResponse.next();

  const res = NextResponse.next();

  // Merge with existing cookie (so src can persist across pages)
  let merged: Record<string, string> = {};
  try {
    const existing = req.cookies.get(COOKIE_NAME)?.value;
    if (existing) merged = JSON.parse(existing);
  } catch {
    merged = {};
  }

  merged = {
    ...merged,
    ...picked,
    ts: new Date().toISOString(),
  };

  res.cookies.set(COOKIE_NAME, JSON.stringify(merged), {
    httpOnly: false, // readable client-side if you ever need it; still non-PII
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
