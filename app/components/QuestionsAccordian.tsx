"use client";

import { useMemo, useState } from "react";
import { FeedbackPanel } from "./FeedbackPanel";

export type FaqItem = {
  id: string;
  q: string;
  icon: string;
  a: React.ReactNode;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "ml-2 inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-white text-slate-700 transition-transform",
        open ? "rotate-180" : "rotate-0",
      ].join(" ")}
    >
      ▾
    </span>
  );
}

export default function QuestionsAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.q.toLowerCase().includes(q));
  }, [items, query]);

  const openStillVisible = filtered.some((x) => x.id === openId);
  const effectiveOpenId = openStillVisible ? openId : null;

  return (
    <>
      {/* Search + quick actions */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <label className="sm:col-span-2">
          <span className="sr-only">Search questions</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (e.g., insurance, fit, minors)"
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
          <div className="mt-1 text-[11px] text-slate-500">
            Tip: try “cost”, “switch”, “telehealth”, or “past”.
          </div>
        </label>

        <div className="flex gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => setOpenId(null)}
            className="w-fit rounded-2xl border px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Collapse all
          </button>
          <button
            type="button"
            onClick={() => setOpenId(filtered[0]?.id ?? null)}
            className="w-fit rounded-2xl px-4 py-3 text-sm font-medium shadow-sm btn-brand"
          >
            Open first
          </button>
        </div>
      </div>

      {/* Accordion list */}
      <div className="mt-8 divide-y rounded-3xl border bg-white">
        {filtered.length ? (
          filtered.map((item) => {
            const open = item.id === effectiveOpenId;

            return (
              <div key={item.id} id={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50"
                  aria-expanded={open}
                  aria-controls={`${item.id}-content`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl border bg-slate-50 text-lg"
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-900">{item.q}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        Click to {open ? "hide" : "view"} answer
                      </div>
                    </div>
                  </div>

                  <Chevron open={open} />
                </button>

                {open ? (
                  <div
                    id={`${item.id}-content`}
                    className="px-6 pb-6 pt-0"
                    role="region"
                    aria-label={item.q}
                  >
                    <div className="rounded-2xl border bg-white p-5">{item.a}</div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href="/quiz"
                        className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Take the quiz →
                      </a>
                      <a
                        href="/therapies"
                        className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Browse the modality library →
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="p-6">
            <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
              No questions match that search yet. Try a broader keyword (like “cost” or “fit”).
            </div>
          </div>
        )}
      </div>

      {/* Page-level feedback */}
      <div className="mt-14 rounded-3xl border bg-slate-50 p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white text-lg"
          >
            📝
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">Help us improve this page</h2>
            <p className="mt-1 text-sm text-slate-600">
              What should we add next? What was confusing? If you tell us what you were trying to figure out,
              we’ll improve the answers (and the quiz/library) around that.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FeedbackPanel
            context={{
              page: "questions",
              sectionId: "page-feedback",
              sectionTitle: "Common Therapy Questions — page feedback",
            }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          One sentence is enough. Example: “Add: how to choose between CBT vs ACT.”
        </p>
      </div>
    </>
  );
}
