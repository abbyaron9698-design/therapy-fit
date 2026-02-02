// app/api/feedback/route.ts
import { NextResponse } from "next/server";

type FeedbackPayload = {
  context: { page: string; sectionId: string; sectionTitle: string };
  helpful: boolean | null;
  topic: string | null;
  comment: string | null;
  ts: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FeedbackPayload;

    // Minimal validation
    if (!body?.context?.page || !body?.context?.sectionId) {
      return NextResponse.json({ ok: false, error: "bad_context" }, { status: 400 });
    }

    // Privacy: do NOT store raw IP; keep a light hint if you want (optional)
    const meta = {
      ua: req.headers.get("user-agent") ?? null,
      ref: req.headers.get("referer") ?? null,
    };

    // Log to server output (works on local; on many hosts it’s viewable in logs)
    console.log("[feedback]", {
      ...meta,
      receivedAt: new Date().toISOString(),
      ...body,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
