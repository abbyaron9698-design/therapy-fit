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
}: {
  context: FeedbackContext;
}) {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const contextText = useMemo(() => {
    const parts = [
      `page=${context.page}`,
      context.sectionId ? `sectionId=${context.sectionId}` : null,
      context.sectionTitle ? `sectionTitle=${context.sectionTitle}` : null,
      context.slug ? `slug=${context.slug}` : null,
    ].filter(Boolean);

    return parts.join(" | ");
  }, [context]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Therapy Fit feedback");
    const body = encodeURIComponent(
      `Hi Therapy Fit,\n\nContext: ${contextText}\n\nTopic (optional): ${topic}\n\nFeedback:\n${message}\n`
    );

    // You can change this to a dedicated inbox later.
    return `mailto:hello@therapyfit.app?subject=${subject}&body=${body}`;
  }, [contextText, topic, message]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-900">Feedback</div>
      <p className="mt-1 text-xs text-slate-600">
        Spot something confusing, missing, or wrong? Tell us — it helps improve the site.
      </p>

      {sent ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          Thanks — feedback drafted. If your email client didn’t open, copy/paste your note and send it when ready.
        </div>
      ) : null}

      <div className="mt-3 grid gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (optional) — e.g., insurance, credentials, EMDR…"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your feedback…"
          rows={3}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-slate-500">
            Context: <span className="font-medium">{contextText}</span>
          </div>

          <a
            href={mailtoHref}
            onClick={() => setSent(true)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-100"
          >
            Send feedback →
          </a>
        </div>
      </div>
    </div>
  );
}
