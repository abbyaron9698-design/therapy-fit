// app/care-levels/page.tsx
"use client";

import React, { useMemo, useState } from "react";

type LevelKey = "weekly" | "group" | "iop" | "php" | "inpatient";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "danger" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-slate-200 bg-slate-50 text-slate-700"
      )}
    >
      {children}
    </span>
  );
}

function LadderCard({
  active,
  number,
  title,
  oneLine,
  cues,
  time,
  onSelect,
}: {
  active: boolean;
  number: number;
  title: string;
  oneLine: string;
  cues: readonly string[];
  time: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={classNames(
        "w-full rounded-2xl border p-5 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"
      )}
      aria-pressed={active}
    >
      <div className="flex items-start gap-4">
        <div
          className={classNames(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
            active ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-800"
          )}
        >
          {number}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">{title}</h2>
            <span
              className={classNames(
                "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                active ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              {active ? "Selected" : "Select"}
            </span>
          </div>

          <p className={classNames("mt-1 text-sm leading-relaxed", active ? "text-slate-200" : "text-slate-600")}>
            {oneLine}
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <div className={classNames("text-xs font-semibold", active ? "text-slate-200" : "text-slate-700")}>
                When this usually fits
              </div>
              <ul className={classNames("mt-1 list-disc pl-5 text-sm", active ? "text-slate-100" : "text-slate-700")}>
                {cues.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className={classNames("text-xs font-semibold", active ? "text-slate-200" : "text-slate-700")}>
                Typical time commitment
              </div>
              <p className={classNames("mt-1 text-sm leading-relaxed", active ? "text-slate-100" : "text-slate-700")}>
                {time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function CareLevelsPage() {
  const levels = useMemo(
    () =>
      [
        {
          key: "weekly" as const,
          title: "Weekly therapy (Outpatient)",
          oneLine: "Steady support while you keep living your life.",
          cues: [
            "You’re safe, but you’re struggling.",
            "You want coping skills, insight, or relationship support.",
            "You can function most days (work/school/basic needs).",
          ],
          time: "Usually 45–60 minutes, 1×/week (sometimes 2×/week).",
        },
        {
          key: "group" as const,
          title: "Group therapy",
          oneLine: "Skills + support with other people, led by a clinician.",
          cues: [
            "You want structure and practice (DBT/CBT/trauma skills).",
            "You feel isolated and want community/accountability.",
            "You want a lower-cost option (often).",
          ],
          time: "Often 60–120 minutes weekly (varies by program).",
        },
        {
          key: "iop" as const,
          title: "IOP (Intensive Outpatient Program)",
          oneLine: "More support than weekly therapy, while living at home.",
          cues: [
            "Symptoms are disrupting life (work/school/relationships).",
            "You need multiple sessions per week to stabilize.",
            "You’re safe at home, but you need more structure.",
          ],
          time: "Commonly 3 hours/day, 3–5 days/week (varies).",
        },
        {
          key: "php" as const,
          title: "PHP (Partial Hospitalization Program)",
          oneLine: "High structure most weekdays; home at night.",
          cues: [
            "You’re struggling to function day-to-day without near-daily support.",
            "You need a strong container to stabilize quickly.",
            "You do not need 24/7 inpatient care (but you need a lot of help).",
          ],
          time: "Often 5 days/week, ~5–6 hours/day (varies).",
        },
        {
          key: "inpatient" as const,
          title: "Inpatient / Hospital",
          oneLine: "24/7 care when safety or urgent stabilization is needed.",
          cues: [
            "You can’t stay safe, or safety is uncertain.",
            "You can’t care for basic needs due to symptoms.",
            "There’s severe withdrawal risk or rapid escalation.",
          ],
          time: "Varies—often days to 1–2 weeks (stabilization + discharge planning).",
        },
      ] as const,
    []
  );

  const [active, setActive] = useState<LevelKey>("weekly");
  const activeLevel = levels.find((l) => l.key === active)!;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Levels of care in Illinois</h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          This is a simple overview of common mental health care levels in Illinois so you can decide what you
          (or someone you love) might need. This page is educational and not medical advice.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href="/crisis"
            className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            Need urgent help? Go to Crisis →
          </a>
        </div>
      </div>

      {/* One sentence guide */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          Rule of thumb: if you’re unsure between two options, choose the one with <span className="font-semibold">more structure</span>{" "}
          for a short period, then step down when stable.
        </p>
      </div>

      {/* Ladder */}
      <section className="mt-6 space-y-3">
        {levels.map((l, idx) => (
          <LadderCard
            key={l.key}
            active={active === l.key}
            number={idx + 1}
            title={l.title}
            oneLine={l.oneLine}
            cues={l.cues}
            time={l.time}
            onSelect={() => setActive(l.key)}
          />
        ))}
      </section>

      {/* Minimal “what to do next” */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Selected: {activeLevel.title}</div>
        <p className="mt-1 text-sm text-slate-600">
          Next step: find options near you and ask for an intake/assessment.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/providers"
            className="inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Browse Illinois providers →
          </a>
          <a
            href="/support"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Support beyond therapy →
          </a>
        </div>
      </section>

      {/* Safety footer */}
      <section className="mt-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-900">If safety is uncertain</h2>
          <p className="mt-1 text-sm text-slate-700">
            If you feel at risk of harming yourself or someone else, or you can’t stay safe, use Crisis resources
            or local emergency services.
          </p>
          <div className="mt-3">
            <a
              href="/crisis"
              className="inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Go to Crisis resources →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
