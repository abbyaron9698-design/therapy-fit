// app/components/FeedbackPanel.tsx
"use client";

import React, { useMemo, useState } from "react";

type FeedbackContext = {
  page: string;
  sectionId?: string;
  sectionTitle?: string;
  slug?: string;
};

export function FeedbackPanel({
  context,
  showContextLine,
}: {
  context: FeedbackContext;
  showContextLine?: boolean;
}) {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const contextText = useMemo(() => {
    const parts = [
      `page=${context.page}`,
      context.sectionId ? `sectionId=${context.sectionId}` : null,
      context.sectionTitle ? `sectionTitle=${context.sectionTitle}` : null,
      context.slug ? `slug=${context.slug}` : null,
    ].filter(Boolean);

    return parts.join(" | ");
  }, [context]);

  // Default behavior:
  // - show context line everywhere EXCEPT the global footer
  const shouldShowContextLine =
    typeof showContextLine === "boolean"
      ? showContextLine
      : context.sectionId !== "global-footer";

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Therapy Fit — quick page feedback");
    const body = encodeURIComponent(
      `Hi Therapy Fit,\n\nContext: ${contextText}\n\nTopic (optional): ${
        topic || "(none)"
      }\n\nFeedback (clarity/tone/emotional experience — not feature requests):\n${
        message || ""
      }\n`
    );
    // If you have a real inbox, put it here. If not, leaving blank opens user's default compose.
    return `mailto:hello@therapyfit.org?subject=${subject}&body=${body}`;
  }, [contextText, topic, message]);

  async function send() {
    if (!message.trim()) return;
    setStatus("sending");

    // 1) Try API route first (best long-term: centralized + measurable)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim() || undefined,
          message: message.trim(),
          context: contextText,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setTopic("");
        setMessage("");
        return;
      }
    } catch {
      // fall through
    }

    // 2) Fallback to mailto (works even if API env isn’t set up)
    try {
      window.location.href = mailtoHref;
      setStatus("sent");
      setTopic("");
      setMessage("");
      return;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-900">
        Quick page feedback
      </div>
      <p className="mt-1 text-xs text-slate-600">
        We’re collecting clarity + tone notes (not feature requests).
      </p>

      {status === "sent" ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          Thank you — received.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
          Something went wrong. Try again, or use the /feedback page.
        </div>
      ) : null}

      <div className="mt-3 grid gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (optional) — e.g., wording, tone, confusing section…"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What felt confusing or emotionally “off”?"
          rows={3}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {shouldShowContextLine ? (
            <div className="text-[11px] text-slate-500">
              Context: <span className="font-medium">{contextText}</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500">
              This feedback includes page info automatically.
            </div>
          )}

          <button
            type="button"
            onClick={send}
            disabled={status === "sending" || !message.trim()}
            className={[
              "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium",
              status === "sending" || !message.trim()
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
            ].join(" ")}
          >
            {status === "sending" ? "Sending…" : "Send feedback →"}
          </button>
        </div>

        {/* Optional: a visible email fallback link for people who prefer it */}
        <a
          href={mailtoHref}
          className="text-[11px] text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-700 hover:decoration-slate-500"
        >
          Prefer email? Draft a message →
        </a>
      </div>
    </div>
  );
}
