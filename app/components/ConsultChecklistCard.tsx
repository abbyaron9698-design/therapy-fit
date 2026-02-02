// app/components/ConsultChecklistCard.tsx
"use client";

import * as React from "react";

type Item = { id: string; label: string };

const STORAGE_KEY = "therapyfit_consult_checklist_v1";

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "Basics",
    items: [
      { id: "basics-license", label: "I understand their license/role and it fits what I’m seeking." },
      { id: "basics-format", label: "Telehealth/in-person setup works for me." },
      { id: "basics-availability", label: "Availability fits my schedule." },
    ],
  },
  {
    title: "Fit",
    items: [
      { id: "fit-training", label: "I understand their training/background for my needs." },
      { id: "fit-why", label: "They explained why their approach might fit me." },
      { id: "fit-sessions", label: "I have a basic picture of what sessions look like." },
      { id: "fit-progress", label: "They explained how we’d check progress and adjust if needed." },
    ],
  },
  {
    title: "Cost",
    items: [
      { id: "cost-fee", label: "Fees/payment options are clear." },
      { id: "cost-policy", label: "Cancellation policy is clear." },
      { id: "cost-first", label: "I understand what the first session involves (and costs)." },
    ],
  },
  {
    title: "Possible mismatches",
    items: [
      { id: "mm-pressured", label: "I felt pressured to believe this was “the right fit”." },
      { id: "mm-rushed", label: "My questions felt rushed or brushed off." },
      { id: "mm-unclear", label: "Important details (cost/process/expectations) stayed unclear." },
    ],
  },
  {
    title: "Early fit check (not final)",
    items: [
      { id: "early-respected", label: "I felt respected." },
      { id: "early-questions", label: "I could ask questions or express hesitation." },
      { id: "early-honest", label: "I can imagine being more honest over time." },
    ],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconCheck({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-md border",
        checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white text-transparent"
      )}
    >
      ✓
    </span>
  );
}

export function ConsultChecklistCard({
  variant = "interactive",
  density = "compact",
  embed = false,
}: {
  variant?: "interactive" | "print";
  density?: "normal" | "compact" | "tight";
  embed?: boolean;
}) {
  const isInteractive = variant === "interactive";
  const isTight = density === "tight";
  const isCompact = density === "compact" || isTight;

  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [notes, setNotes] = React.useState<string>("");

  // In tight/embed mode: keep extra stuff collapsed by default.
  const [showExtras, setShowExtras] = React.useState<boolean>(!isTight);

  React.useEffect(() => {
    if (!isInteractive) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { checked?: Record<string, boolean>; notes?: string };
      if (parsed.checked) setChecked(parsed.checked);
      if (typeof parsed.notes === "string") setNotes(parsed.notes);
    } catch {
      // ignore
    }
  }, [isInteractive]);

  React.useEffect(() => {
    if (!isInteractive) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked, notes }));
    } catch {
      // ignore
    }
  }, [checked, notes, isInteractive]);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const reset = () => {
    setChecked({});
    setNotes("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const buildShareText = () => {
    const lines: string[] = [];
    lines.push("TherapyFit — Consult Checklist");
    lines.push("");
    for (const section of SECTIONS) {
      lines.push(section.title);
      for (const item of section.items) {
        const mark = checked[item.id] ? "☑" : "☐";
        lines.push(`${mark} ${item.label}`);
      }
      lines.push("");
    }
    lines.push("Notes:");
    lines.push(notes?.trim() ? notes.trim() : "(none)");
    return lines.join("\n");
  };

  const copy = async () => {
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  const intro =
    "Early therapy can feel awkward—this is just a quick check for fit, clarity, and enough safety to continue.";

  const renderItems = (items: Item[]) => (
    <div className={cn("grid", isTight ? "gap-1" : isCompact ? "gap-1.5" : "gap-2")}>
      {items.map((item) => {
        const isChecked = !!checked[item.id];
        return (
          <button
            key={item.id}
            type="button"
            onClick={isInteractive ? () => toggle(item.id) : undefined}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl text-left",
              isTight ? "px-1 py-1" : isCompact ? "px-1.5 py-1.5" : "px-2 py-2",
              isInteractive ? "hover:bg-slate-50" : "cursor-default"
            )}
            aria-pressed={isInteractive ? isChecked : undefined}
          >
            {isInteractive ? (
              <IconCheck checked={isChecked} />
            ) : (
              <span className="mt-0.5 inline-block h-4 w-4 rounded border border-slate-400" aria-hidden="true" />
            )}
            <span className={cn("text-slate-800", "text-sm", isTight ? "leading-snug" : "")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  const section = (title: string) => SECTIONS.find((s) => s.title === title)!;
  const basics = section("Basics");
  const fit = section("Fit");
  const cost = section("Cost");
  const mismatches = section("Possible mismatches");
  const early = section("Early fit check (not final)");

  return (
    <section className={cn("rounded-3xl border bg-white shadow-sm", isTight ? "p-3" : isCompact ? "p-4" : "p-6")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={cn("font-semibold text-slate-900", isTight ? "text-sm" : "text-base")}>
            15-Minute Consult Checklist
          </h2>
          {/* Keep intro but make it a single small line in tight mode */}
          <p className={cn("text-slate-600", isTight ? "mt-1 text-xs" : "mt-1 text-sm")}>{intro}</p>
        </div>

        {/* Hide controls in embed mode to reduce visual noise */}
        {isInteractive && !embed && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <div className={cn("mt-3 grid", isTight ? "gap-2" : "gap-3")}>
        {/* In tight mode, drop the boxed backgrounds to reduce height */}
        <div>
          <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>Basics</div>
          <div className={cn(isTight ? "mt-1" : "mt-2")}>{renderItems(basics.items)}</div>
        </div>

        <div>
          <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>Fit</div>
          <div className={cn(isTight ? "mt-1" : "mt-2")}>{renderItems(fit.items)}</div>
        </div>

        <div>
          <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>Cost</div>
          <div className={cn(isTight ? "mt-1" : "mt-2")}>{renderItems(cost.items)}</div>
        </div>

        {/* Early fit check always visible */}
        <div>
          <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>
            Early fit check (not final)
          </div>
          <p className={cn("text-slate-600", isTight ? "mt-1 text-xs" : "mt-2 text-sm")}>
            Not instant comfort—just enough safety to continue.
          </p>
          <div className={cn(isTight ? "mt-1" : "mt-2")}>{renderItems(early.items)}</div>
          {/* Keep the “quiet question” but inline (no big box) */}
          <p className={cn("text-slate-700", isTight ? "mt-2 text-xs" : "mt-3 text-sm")}>
            <span className="font-semibold text-slate-900">Hold:</span>{" "}
            Do I feel safe enough to keep showing up—even if the truth is uncomfortable?
          </p>
        </div>

        {/* Extras toggle: mismatches + notes */}
        <div className={cn("rounded-2xl border bg-slate-50", isTight ? "p-2" : "p-3")}>
          <button
            type="button"
            onClick={isInteractive ? () => setShowExtras((v) => !v) : undefined}
            className={cn(
              "flex w-full items-center justify-between text-left",
              isInteractive ? "cursor-pointer" : "cursor-default"
            )}
          >
            <span className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>
              Extras
            </span>
            {isInteractive && (
              <span className={cn("font-medium text-slate-700", isTight ? "text-xs" : "text-xs")}>
                {showExtras ? "Hide" : "Show"}
              </span>
            )}
          </button>

          {showExtras && (
            <div className={cn(isTight ? "mt-2" : "mt-3", "grid gap-3")}>
              <div>
                <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>
                  Possible mismatches
                </div>
                <div className={cn(isTight ? "mt-1" : "mt-2")}>{renderItems(mismatches.items)}</div>
              </div>

              {variant === "interactive" ? (
                <div>
                  <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>Notes</div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Quick notes…"
                    className={cn(
                      "mt-2 w-full resize-none rounded-2xl border bg-white p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
                      isTight ? "min-h-[56px]" : "min-h-[72px]"
                    )}
                  />
                  {!embed && (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={copy}
                        className="inline-flex items-center justify-center rounded-2xl border bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-2xl border bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className={cn("font-semibold text-slate-900", isTight ? "text-xs" : "text-sm")}>Notes</div>
                  <div className="mt-2 rounded-2xl border border-dashed bg-white p-3 text-xs text-slate-600">
                    ________________________________
                    <br />
                    ________________________________
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hide footer links in embed mode */}
        {isInteractive && !embed && (
          <div className={cn("flex flex-col gap-2 sm:flex-row", isTight ? "pt-1" : "pt-2")}>
            <a
              href="/consult-checklist/print"
              className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
            >
              Print / Save as PDF →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
