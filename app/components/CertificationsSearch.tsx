"use client";

import { useMemo, useState } from "react";

export type CertificationCategory = {
  id: string;
  title: string;
  items: string[];
};

export default function CertificationsSearch({
  categories,
}: {
  categories: CertificationCategory[];
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const flat = useMemo(() => {
    return categories.flatMap((c) =>
      c.items.map((label) => ({
        categoryId: c.id,
        categoryTitle: c.title,
        label,
        haystack: `${label} ${c.title}`.toLowerCase(),
      }))
    );
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flat.filter((x) => {
      if (activeCat !== "all" && x.categoryId !== activeCat) return false;
      if (!q) return true;
      return x.haystack.includes(q);
    });
  }, [flat, query, activeCat]);

  const counts = useMemo(() => {
    const by: Record<string, number> = {};
    for (const c of categories) by[c.id] = 0;
    for (const item of flat) by[item.categoryId] = (by[item.categoryId] ?? 0) + 1;
    return by;
  }, [flat, categories]);

  function clear() {
    setQuery("");
    setActiveCat("all");
  }

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">
            Search trainings & certifications
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Tip: search by keywords like “EMDR”, “ERP”, “Gottman”, “CBT-E”, “TF-CBT”, “perinatal”, “neuro”, etc.
          </div>
        </div>

        <button
          type="button"
          onClick={clear}
          className="w-fit rounded-xl border px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-700">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a keyword…"
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <span className="text-[11px] text-slate-500">
            Results update instantly
          </span>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-700">Category</span>
          <select
            value={activeCat}
            onChange={(e) => setActiveCat(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({counts[c.id] ?? 0})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500">
            Helpful for scanning
          </span>
        </label>
      </div>

      <div className="mt-4 rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
        Showing <strong>{filtered.length}</strong> item{filtered.length === 1 ? "" : "s"}
        {activeCat !== "all" ? (
          <>
            {" "}
            in <strong>{categories.find((c) => c.id === activeCat)?.title}</strong>
          </>
        ) : null}
        {query.trim() ? (
          <>
            {" "}
            matching <strong>“{query.trim()}”</strong>
          </>
        ) : null}
        .
      </div>

      <div className="mt-4 grid gap-2">
        {filtered.length ? (
          filtered.map((x, i) => (
            <div
              key={`${x.categoryId}-${x.label}-${i}`}
              className="rounded-xl border bg-white p-3"
            >
              <div className="text-sm font-medium text-slate-900">{x.label}</div>
              <div className="mt-1 text-xs text-slate-600">{x.categoryTitle}</div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border bg-white p-3 text-sm text-slate-700">
            No matches. Try a broader keyword (e.g., “trauma”, “OCD”, “couples”, “group”, “eating”).
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Reminder: the rigor behind “certified in ____” varies widely. A good follow-up question is:
        <span className="font-medium text-slate-700">
          {" "}
          “What training did you complete, how long was it, and how do you use it in sessions?”
        </span>
      </p>
    </div>
  );
}
