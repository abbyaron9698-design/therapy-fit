// app/therapies/page.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { THERAPY_PAGES, type TherapyPage } from "../../lib/therapyData";
import { SelectWithChevron } from "../components/SelectWithChevron";
import { StickyQuizCTA } from "../components/StickyQuizCTA";
import { track } from "../../lib/analytics";

type DropdownValue =
  | "all"
  // A) help with...
  | "anxiety"
  | "depression"
  | "trauma"
  | "ocd"
  | "relationships"
  | "emotion-reg"
  | "grief"
  | "substance"
  | "adhd"
  | "eating"
  | "sleep"
  | "teen-child"
  | "stress"
  | "other"
  // B) style feels like...
  | "practical-tools"
  | "trauma-processing"
  | "body-nervous-system"
  | "rel-communication"
  | "depth-patterns"
  | "creative-expressive"
  | "higher-support"
  | "medical-options"
  // C) looking for right now...
  | "new-to-therapy"
  | "talk-therapy-didnt-help"
  | "want-tools-now"
  | "want-trauma-help"
  | "want-body-based"
  | "want-creative"
  | "need-more-support"
  | "considering-medical";

type DropdownKey = Exclude<DropdownValue, "all">;

type SortValue = "relevance" | "az" | "evidence" | "practical";

// ===== Result behavior tuning =====
const MIN_RESULTS = 3; // never show fewer than this (we'll backfill)
const DEFAULT_VISIBLE = 3; // collapsed view count (best match + a couple strong fits)
const SHOW_MORE_STEP = 3; // expand step
const MAX_CANDIDATES_FOR_BACKFILL = 27; // candidates for backfill pool (cap to library size)

function norm(s: string) {
  return (s ?? "").trim().toLowerCase();
}

function includesAny(haystack: string, needles: string[]) {
  const h = norm(haystack);
  return needles.some((n) => h.includes(norm(n)));
}

function pageSearchText(p: TherapyPage) {
  return [
    p.name,
    p.family,
    p.whatItIs,
    p.whatSessionsLookLike?.join(" "),
    p.oftenHelpfulFor?.join(" "),
    p.goodFitIf?.join(" "),
    p.notIdealIf?.join(" "),
    p.evidenceNotes?.join(" "),
    p.safetyNotes?.join(" "),
    p.keywords?.join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Filter mapping:
 * Each dropdown option returns a list of “signals” (keywords) we look for in the page text.
 */
const FILTER_SIGNALS: Record<DropdownKey, string[]> = {
  // A) Help with…
  anxiety: ["anxiety", "panic", "worry", "overthinking", "stress", "rumination"],
  depression: [
    "depression",
    "burnout",
    "low mood",
    "motivation",
    "hopeless",
    "flat",
    "numb",
  ],
  trauma: [
    "trauma",
    "ptsd",
    "flashbacks",
    "nightmares",
    "triggers",
    "safety",
    "memory",
  ],
  ocd: [
    "ocd",
    "intrusive thoughts",
    "compulsions",
    "checking",
    "contamination",
    "reassurance seeking",
  ],
  relationships: [
    "relationships",
    "couples",
    "family",
    "communication",
    "conflict",
    "attachment",
    "boundaries",
  ],
  "emotion-reg": [
    "emotion regulation",
    "big emotions",
    "distress tolerance",
    "impulsive",
    "mood instability",
    "shame",
  ],
  grief: ["grief", "bereavement", "loss", "meaning", "traumatic grief"],
  substance: [
    "substance",
    "drinking",
    "alcohol",
    "smoking",
    "addiction",
    "recovery",
    "habits",
  ],
  adhd: [
    "adhd",
    "focus",
    "executive function",
    "task initiation",
    "follow-through",
    "attention",
  ],
  eating: ["eating disorder", "anorexia", "bulimia", "nutrition", "body image"],
  sleep: ["sleep", "insomnia", "nightmares", "sleep disruption"],
  "teen-child": ["teen", "adolescent", "kids", "child", "caregiver", "parent"],
  stress: ["stress", "overwhelmed", "burnout", "tension", "coping"],
  other: ["identity", "life transition", "self-esteem", "loneliness", "isolation"],

  // B) Style feels like…
  "practical-tools": [
    "tools",
    "skills",
    "worksheet",
    "structured",
    "practice",
    "step-by-step",
  ],
  "trauma-processing": [
    "trauma",
    "processing",
    "reprocessing",
    "trauma narrative",
    "cpt",
    "tf-cbt",
    "emdr",
  ],
  "body-nervous-system": [
    "nervous system",
    "somatic",
    "body",
    "grounding",
    "window of tolerance",
    "regulation",
  ],
  "rel-communication": [
    "communication",
    "relationships",
    "repair",
    "conflict",
    "boundaries",
    "systems",
    "couples",
  ],
  "depth-patterns": [
    "patterns",
    "attachment",
    "inner critic",
    "parts",
    "insight",
    "meaning",
    "identity",
  ],
  "creative-expressive": [
    "creative",
    "nonverbal",
    "art",
    "music",
    "movement",
    "expressive",
  ],
  "higher-support": [
    "php",
    "iop",
    "higher level of care",
    "program",
    "intensive",
    "more support",
  ],
  "medical-options": [
    "medication",
    "psychiatry",
    "prescriber",
    "tms",
    "ect",
    "medical",
  ],

  // C) Looking for right now…
  "new-to-therapy": [
    "new to therapy",
    "starting point",
    "where do i start",
    "first session",
  ],
  "talk-therapy-didnt-help": [
    "talking alone hasn’t been enough",
    "didn’t help",
    "not enough",
    "stuck",
  ],
  "want-tools-now": [
    "practical tools",
    "skills",
    "tools",
    "between sessions",
    "home practice",
  ],
  "want-trauma-help": ["trauma", "ptsd", "emdr", "cpt", "tf-cbt", "memory"],
  "want-body-based": [
    "somatic",
    "nervous system",
    "body",
    "regulation",
    "grounding",
  ],
  "want-creative": ["art", "music", "movement", "nonverbal", "creative"],
  "need-more-support": [
    "php",
    "iop",
    "program",
    "higher level of care",
    "more support",
  ],
  "considering-medical": ["medication", "psychiatry", "prescriber", "tms", "ect"],
};

function matchesDropdown(p: TherapyPage, value: DropdownValue) {
  if (value === "all") return true;
  const signals = FILTER_SIGNALS[value as DropdownKey];
  const hay = pageSearchText(p);
  return includesAny(hay, signals);
}

function getLaneLabel(p: TherapyPage): string {
  const f = norm(p.family);
  if (f.includes("trauma")) return "Trauma-focused processing";
  if (f.includes("body")) return "Body & nervous system";
  if (f.includes("expressive")) return "Creative / expressive";
  if (f.includes("medical") || f.includes("advanced")) return "Medical options";
  if (f.includes("higher level")) return "Higher support programs";
  if (f.includes("relational") || f.includes("family") || f.includes("couples"))
    return "Relationships & communication";
  return "Practical tools & skills";
}

function laneTone(lane: string) {
  if (lane.includes("Trauma")) return "bg-amber-50 border-amber-200";
  if (lane.includes("Body")) return "bg-sky-50 border-sky-200";
  if (lane.includes("Creative")) return "bg-fuchsia-50 border-fuchsia-200";
  if (lane.includes("Medical")) return "bg-indigo-50 border-indigo-200";
  if (lane.includes("Higher")) return "bg-rose-50 border-rose-200";
  if (lane.includes("Relationships")) return "bg-emerald-50 border-emerald-200";
  return "bg-slate-50 border-slate-200";
}

function pickTwoTags(p: TherapyPage): string[] {
  const kws = (p.keywords ?? []).slice(0, 2);
  if (kws.length === 2) return kws.map((k) => titleCaseTag(k));
  const fallback = (p.oftenHelpfulFor ?? []).slice(0, 2);
  return fallback.map((k) => titleCaseTag(k));
}

function titleCaseTag(s: string) {
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function chipLabel(value: DropdownKey) {
  const labels: Record<DropdownKey, string> = {
    anxiety: "Anxiety / panic",
    depression: "Depression / burnout",
    trauma: "Trauma",
    ocd: "OCD / intrusive thoughts",
    relationships: "Relationships",
    "emotion-reg": "Emotion regulation",
    grief: "Grief",
    substance: "Substance use",
    adhd: "ADHD / focus",
    eating: "Eating disorders",
    sleep: "Sleep",
    "teen-child": "Child / teen",
    stress: "Stress",
    other: "Other",

    "practical-tools": "Practical tools & skills",
    "trauma-processing": "Trauma-focused processing",
    "body-nervous-system": "Body & nervous system",
    "rel-communication": "Relationships & communication",
    "depth-patterns": "Depth & patterns",
    "creative-expressive": "Creative / expressive",
    "higher-support": "Higher support programs",
    "medical-options": "Medical options",

    "new-to-therapy": "New to therapy",
    "talk-therapy-didnt-help": "Talk therapy didn’t help",
    "want-tools-now": "Want tools now",
    "want-trauma-help": "Want trauma help",
    "want-body-based": "Body-based support",
    "want-creative": "Creative / nonverbal",
    "need-more-support": "Need more support",
    "considering-medical": "Considering medical options",
  };
  return labels[value] ?? value;
}

function evidenceScore(p: TherapyPage) {
  const fam = norm(p.family);
  const hasEvidenceNotes = (p.evidenceNotes?.length ?? 0) > 0;

  let score = 0;
  if (fam.includes("evidence")) score += 3;
  if (fam.includes("protocol")) score += 1;
  if (fam.includes("specialty")) score += 1;
  if (hasEvidenceNotes) score += 1;
  if (p.slug === "erp") score += 2;
  return score;
}

function practicalScore(p: TherapyPage) {
  const text = norm(pageSearchText(p));
  let score = 0;
  if (text.includes("tools")) score += 2;
  if (text.includes("skills")) score += 2;
  if (text.includes("practice")) score += 1;
  if (text.includes("between-session")) score += 1;
  if (text.includes("worksheet")) score += 1;
  return score;
}

function countSignalMatches(p: TherapyPage, signals: string[]) {
  const hay = norm(pageSearchText(p));
  let hits = 0;
  for (const s of signals) {
    if (hay.includes(norm(s))) hits += 1;
  }
  return hits;
}

function combinedMatchScore(
  p: TherapyPage,
  activeKeys: DropdownKey[],
  query: string
) {
  const hay = norm(pageSearchText(p));
  let score = 0;

  const q = norm(query);
  if (q) {
    if (hay.includes(q)) score += 3;
    const parts = q.split(/\s+/).filter(Boolean);
    for (const part of parts) {
      if (part.length >= 4 && hay.includes(part)) score += 1;
    }
  }

  for (const k of activeKeys) {
    score += countSignalMatches(p, FILTER_SIGNALS[k]) * 2;
  }

  score += evidenceScore(p) * 0.5;
  score += practicalScore(p) * 0.25;

  return score;
}

function ResultsControls({
  canShowMore,
  showMoreLabel,
  showAllLabel,
  onShowMore,
  onShowAll,
}: {
  canShowMore: boolean;
  showMoreLabel: string;
  showAllLabel: string;
  onShowMore: () => void;
  onShowAll: () => void;
}) {
  if (!canShowMore) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onShowMore}
        className="
          inline-flex items-center justify-center
          rounded-2xl px-4 py-2.5
          text-sm font-semibold
          bg-emerald-700 text-white shadow-sm
          hover:bg-emerald-800
          focus:outline-none focus:ring-2 focus:ring-emerald-300
        "
      >
        {showMoreLabel}
      </button>

      <button
        type="button"
        onClick={onShowAll}
        className="
          inline-flex items-center justify-center
          rounded-2xl px-4 py-2.5
          text-sm font-medium
          border border-slate-200 bg-white text-slate-900 shadow-sm
          hover:bg-slate-50
        "
      >
        {showAllLabel}
      </button>
    </div>
  );
}

/**
 * Click-to-toggle Popover:
 * - closes on outside click
 * - closes on Escape
 * - responsive positioning so it won't get cut off on the right edge
 */
function InfoPopover({
  label = "Info",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onPointerDown(e: PointerEvent) {
      const el = wrapRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      } as any);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex h-6 w-6 items-center justify-center
          rounded-full border border-slate-200 bg-white
          text-slate-600 shadow-sm
          hover:bg-slate-50 hover:text-slate-900
          focus:outline-none focus:ring-2 focus:ring-emerald-300
        "
      >
        <span className="text-xs font-bold leading-none">i</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="
            absolute top-8 z-50
            w-72 max-w-[92vw]
            rounded-2xl border border-slate-200 bg-white px-4 py-3
            text-left text-xs leading-snug text-slate-700 shadow-lg
            left-1/2 -translate-x-1/2
            sm:left-auto sm:right-0 sm:translate-x-0
          "
        >
          {children}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

export default function TherapiesPage() {
  const [query, setQuery] = useState("");
  const [helpWith, setHelpWith] = useState<DropdownValue>("all");
  const [styleFeelsLike, setStyleFeelsLike] = useState<DropdownValue>("all");
  const [lookingFor, setLookingFor] = useState<DropdownValue>("all");
  const [sort, setSort] = useState<SortValue>("relevance");

  // Progressive disclosure state
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const activeDropdowns = useMemo(() => {
    return [helpWith, styleFeelsLike, lookingFor].filter(
      (v) => v !== "all"
    ) as DropdownKey[];
  }, [helpWith, styleFeelsLike, lookingFor]);

  const hasActiveIntent = activeDropdowns.length > 0 || query.trim().length > 0;

  // Track the page view once
  useEffect(() => {
    track("therapies_library_view", { total: THERAPY_PAGES.length });
  }, []);

  // On load: show all. Once user applies intent: collapse to DEFAULT_VISIBLE.
  useEffect(() => {
    if (!hasActiveIntent) {
      setVisibleCount(null); // show all on browse
    } else {
      setVisibleCount(DEFAULT_VISIBLE); // collapse when filtering/searching
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveIntent]);

  // Debounced search tracking (prevents analytics spam on typing)
  const searchTimer = useRef<number | null>(null);
  function onSearchChange(v: string) {
    setQuery(v);
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      track("therapies_library_search_change", { qLen: v.trim().length });
    }, 300);
  }

  // Track filter changes (not query) — lower noise
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    track("therapies_library_filters_change", {
      helpWith,
      styleFeelsLike,
      lookingFor,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpWith, styleFeelsLike, lookingFor, sort]);

  const baseFiltered = useMemo(() => {
    const q = norm(query);
    if (!q) return THERAPY_PAGES;
    return THERAPY_PAGES.filter((p) => norm(pageSearchText(p)).includes(q));
  }, [query]);

  const filteredStrict = useMemo(() => {
    let res: TherapyPage[] = baseFiltered;

    if (activeDropdowns.length > 0) {
      const applyAND = (arr: TherapyPage[]) =>
        arr.filter((p) => activeDropdowns.every((v) => matchesDropdown(p, v)));

      const applyOR = (arr: TherapyPage[]) =>
        arr.filter((p) => activeDropdowns.some((v) => matchesDropdown(p, v)));

      if (activeDropdowns.length <= 2) {
        const andRes = applyAND(res);
        res = andRes.length > 0 ? andRes : applyOR(res);
      } else {
        res = applyOR(res);
      }
    }

    const sorted = [...res];
    if (sort === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "evidence") {
      sorted.sort(
        (a, b) =>
          evidenceScore(b) - evidenceScore(a) || a.name.localeCompare(b.name)
      );
    } else if (sort === "practical") {
      sorted.sort(
        (a, b) =>
          practicalScore(b) - practicalScore(a) || a.name.localeCompare(b.name)
      );
    } else {
      // relevance = keep THERAPY_PAGES order (stable)
    }

    return sorted;
  }, [activeDropdowns, baseFiltered, sort]);

  // Backfill so you don't end up with 1–2 lonely options
  const { finalResults, closeMatchSlugs } = useMemo(() => {
    const strict = filteredStrict;

    if (strict.length >= MIN_RESULTS || !hasActiveIntent) {
      return { finalResults: strict, closeMatchSlugs: new Set<string>() };
    }

    const pool = THERAPY_PAGES.slice(0, MAX_CANDIDATES_FOR_BACKFILL);
    const strictSlugs = new Set(strict.map((p) => p.slug));

    const scored = pool
      .filter((p) => !strictSlugs.has(p.slug))
      .map((p) => ({
        p,
        score: combinedMatchScore(p, activeDropdowns, query),
      }))
      .sort((a, b) => b.score - a.score);

    const filled: TherapyPage[] = [...strict];
    const close = new Set<string>();

    for (const item of scored) {
      if (filled.length >= MIN_RESULTS) break;
      if (item.score <= 0) continue;
      filled.push(item.p);
      close.add(item.p.slug);
    }

    return { finalResults: filled, closeMatchSlugs: close };
  }, [filteredStrict, activeDropdowns, query, hasActiveIntent]);

  const showEmpty = finalResults.length === 0;

  const totalCount = finalResults.length;
  const effectiveVisibleCount =
    visibleCount == null ? totalCount : Math.min(visibleCount, totalCount);

  const visible = finalResults.slice(0, effectiveVisibleCount);
  const remaining = Math.max(0, totalCount - effectiveVisibleCount);

  const canShowMore = hasActiveIntent && remaining > 0;
  const nextStepCount = Math.min(SHOW_MORE_STEP, remaining);

  const showMoreLabel =
    nextStepCount > 0
      ? nextStepCount === remaining
        ? "Show more"
        : `Show ${nextStepCount} more`
      : "Show more";

  const showAllLabel = `Show all (${totalCount})`;

  function clearAll() {
    setQuery("");
    setHelpWith("all");
    setStyleFeelsLike("all");
    setLookingFor("all");
    setSort("relevance");
    setVisibleCount(null);

    track("therapies_library_clear_all");
  }

  function clearChip(v: DropdownKey) {
    const helpWithValues: DropdownKey[] = [
      "anxiety",
      "depression",
      "trauma",
      "ocd",
      "relationships",
      "emotion-reg",
      "grief",
      "substance",
      "adhd",
      "eating",
      "sleep",
      "teen-child",
      "stress",
      "other",
    ];

    const styleValues: DropdownKey[] = [
      "practical-tools",
      "trauma-processing",
      "body-nervous-system",
      "rel-communication",
      "depth-patterns",
      "creative-expressive",
      "higher-support",
      "medical-options",
    ];

    const lookingForValues: DropdownKey[] = [
      "new-to-therapy",
      "talk-therapy-didnt-help",
      "want-tools-now",
      "want-trauma-help",
      "want-body-based",
      "want-creative",
      "need-more-support",
      "considering-medical",
    ];

    if (helpWithValues.includes(v)) setHelpWith("all");
    else if (styleValues.includes(v)) setStyleFeelsLike("all");
    else if (lookingForValues.includes(v)) setLookingFor("all");

    track("therapies_library_chip_clear", { chip: v });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <StickyQuizCTA
        href="/quiz"
        afterElementId="therapies-hero-end"
        secondaryHref="/toolkit"
        secondaryLabel="Preview the toolkit"
        secondaryShowAfterPx={900}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <header className="mb-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Therapy library
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              Therapy styles, explained — so you can choose with confidence.
            </h1>

            <p className="mt-2 max-w-2xl text-slate-700">
              Pick a few filters (or type a word) and you’ll see therapy styles
              that may fit what you’re dealing with.
            </p>

            <p className="mt-4 max-w-3xl text-sm text-slate-700">
              Different styles can feel very different (more structured vs more
              open, more skills vs more insight, more body-based vs mostly
              talk-based). Finding a good match can make therapy feel clearer
              and more useful.
            </p>

            <div id="therapies-hero-end" className="h-px w-full" />
          </header>

          {/* Search + Filters */}
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-slate-900">
                Search and refine
              </label>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex-1">
                  <input
                    value={query}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Try: burnout, panic, breakup, intrusive thoughts, teens, sleep, people pleasing…"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  />
                  <p className="mt-2 text-xs text-slate-600">
                    As you type, the list below updates right away.
                  </p>
                </div>

                <div className="flex gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Clear
                  </button>

                  <Link
                    href="/quiz"
                    onClick={() => track("therapies_library_quiz_click")}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Take the quiz →
                  </Link>
                </div>
              </div>

              {/* IMPORTANT: Switch to 2-col earlier so Sort isn't slammed against the far right edge */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="min-w-0">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    A) I want help with…
                  </label>
                  <SelectWithChevron
                    value={helpWith}
                    onChange={(e) =>
                      setHelpWith(e.target.value as DropdownValue)
                    }
                  >
                    <option value="all">All</option>
                    <option value="anxiety">Anxiety / panic</option>
                    <option value="depression">Depression / burnout</option>
                    <option value="trauma">Trauma</option>
                    <option value="ocd">OCD / intrusive thoughts</option>
                    <option value="relationships">Relationships</option>
                    <option value="emotion-reg">Emotion regulation</option>
                    <option value="grief">Grief</option>
                    <option value="substance">Substance use</option>
                    <option value="adhd">ADHD / focus</option>
                    <option value="eating">Eating disorders</option>
                    <option value="sleep">Sleep</option>
                    <option value="teen-child">Child / teen</option>
                    <option value="stress">Stress</option>
                    <option value="other">Other</option>
                  </SelectWithChevron>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    B) I’d prefer something that feels…
                  </label>
                  <SelectWithChevron
                    value={styleFeelsLike}
                    onChange={(e) =>
                      setStyleFeelsLike(e.target.value as DropdownValue)
                    }
                  >
                    <option value="all">All</option>
                    <option value="practical-tools">
                      Practical tools & skills
                    </option>
                    <option value="trauma-processing">
                      Trauma-focused processing
                    </option>
                    <option value="body-nervous-system">
                      Body & nervous system
                    </option>
                    <option value="rel-communication">
                      Relationships & communication
                    </option>
                    <option value="depth-patterns">Depth & patterns</option>
                    <option value="creative-expressive">
                      Creative / expressive
                    </option>
                    <option value="higher-support">
                      Higher support programs
                    </option>
                    <option value="medical-options">Medical options</option>
                  </SelectWithChevron>
                </div>

                <div className="min-w-0">
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    C) I’m looking for…
                  </label>
                  <SelectWithChevron
                    value={lookingFor}
                    onChange={(e) =>
                      setLookingFor(e.target.value as DropdownValue)
                    }
                  >
                    <option value="all">All</option>
                    <option value="new-to-therapy">
                      New to therapy — where do I start?
                    </option>
                    <option value="talk-therapy-didnt-help">
                      Talk therapy didn’t help — what else?
                    </option>
                    <option value="want-tools-now">
                      Tools I can use between sessions
                    </option>
                    <option value="want-trauma-help">
                      Trauma-focused help
                    </option>
                    <option value="want-body-based">
                      Nervous-system / body-based support
                    </option>
                    <option value="want-creative">
                      Something creative / nonverbal
                    </option>
                    <option value="need-more-support">
                      More support than weekly therapy
                    </option>
                    <option value="considering-medical">
                      Medication or other medical options
                    </option>
                  </SelectWithChevron>
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Sort
                    </label>

                    <InfoPopover label="Sort option meanings">
                      <div className="font-semibold text-slate-900">
                        What do these mean?
                      </div>

                      <div className="mt-2">
                        <span className="font-semibold">Recommended</span> = a
                        good general order to browse.
                      </div>

                      <div className="mt-2">
                        <span className="font-semibold">Evidence-based</span> =
                        styles that have been studied in research.
                        <div className="mt-1 text-[11px] text-slate-500">
                          (Research can’t cover every person, but it’s a helpful
                          signal.)
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="font-semibold">Most practical</span> =
                        styles that are usually more skills-and-tools focused.
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500">
                        If you’re unsure, keep{" "}
                        <span className="font-medium">Recommended order</span>.
                      </div>
                    </InfoPopover>
                  </div>

                  <SelectWithChevron
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortValue)}
                  >
                    <option value="relevance">Recommended order</option>
                    <option value="az">A–Z</option>
                    <option value="evidence">Evidence-based first</option>
                    <option value="practical">Most practical / skills-first</option>
                  </SelectWithChevron>
                </div>
              </div>

              <div className="mt-2 grid gap-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    How this works:
                  </span>{" "}
                  This page matches your filters to the words on each therapy
                  description — not your personal data. You can change filters
                  anytime.
                </div>
              </div>

              {/* Selected filter chips */}
              {(activeDropdowns.length > 0 || query.trim()) && (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {query.trim() && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                      Search:{" "}
                      <span className="font-semibold text-slate-900">
                        {query.trim()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="rounded-full px-1 text-slate-600 hover:text-slate-900"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {activeDropdowns.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                    >
                      <span className="font-semibold text-slate-900">
                        {chipLabel(v)}
                      </span>
                      <button
                        type="button"
                        onClick={() => clearChip(v)}
                        className="rounded-full px-1 text-slate-600 hover:text-slate-900"
                        aria-label={`Remove filter ${chipLabel(v)}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {showEmpty && (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    No matches with those filters.
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Try clearing one filter, or search a broader word (example:{" "}
                    <span className="font-medium">stress</span> instead of{" "}
                    <span className="font-medium">break up</span>).
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Results */}
          <section>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {visible.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {totalCount}
                </span>{" "}
                {totalCount === 1 ? "therapy style" : "therapy styles"}
                {!hasActiveIntent && (
                  <span className="ml-2 text-xs text-slate-500">
                    (Browsing all — use filters to narrow)
                  </span>
                )}
              </p>

              <ResultsControls
                canShowMore={canShowMore}
                showMoreLabel={showMoreLabel}
                showAllLabel={showAllLabel}
                onShowMore={() => {
                  setVisibleCount((prev) =>
                    prev == null
                      ? DEFAULT_VISIBLE
                      : Math.min(totalCount, prev + SHOW_MORE_STEP)
                  );
                  track("therapies_library_show_more", {
                    step: SHOW_MORE_STEP,
                    placement: "top",
                  });
                }}
                onShowAll={() => {
                  setVisibleCount(totalCount);
                  track("therapies_library_show_all", {
                    totalCount,
                    placement: "top",
                  });
                }}
              />
            </div>

            {/* Lane legend */}
            <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Lanes:</span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-amber-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Trauma-focused processing
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-sky-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Body & nervous system
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-fuchsia-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                  Creative / expressive
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-emerald-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Relationships & communication
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-rose-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Higher support programs
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-indigo-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Medical options
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Practical tools & skills
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Lanes are broad “paths” — many therapists blend styles.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((p, idx) => {
                  const lane = getLaneLabel(p);
                  const tags = pickTwoTags(p);

                  const isBest = hasActiveIntent && idx === 0;
                  const isStrong = hasActiveIntent && idx === 1;
                  const isClose =
                    hasActiveIntent &&
                    closeMatchSlugs.has(p.slug) &&
                    !isBest &&
                    !isStrong;

                  const matchBadge = isBest
                    ? "Best match"
                    : isStrong
                    ? "Also a strong fit"
                    : isClose
                    ? "Close match"
                    : null;

                  return (
                    <article
                      key={p.slug}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className={`border-b px-5 py-3 ${laneTone(lane)}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-semibold text-slate-900">
                              {p.name}
                            </h2>
                            <p className="text-sm text-slate-600">{p.family}</p>
                          </div>

                          {matchBadge ? (
                            <span className="shrink-0 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800">
                              {matchBadge}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-sm leading-relaxed text-slate-700">
                          {p.whatItIs}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                            {lane}
                          </span>
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4">
                          <Link
                            href={`/therapies/${p.slug}`}
                            onClick={() =>
                              track("therapies_library_open_detail", {
                                slug: p.slug,
                                fromIntent: hasActiveIntent,
                                idx,
                              })
                            }
                            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:underline"
                          >
                            Learn more <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  {canShowMore ? `${remaining} more in this list` : null}
                </div>

                <ResultsControls
                  canShowMore={canShowMore}
                  showMoreLabel={showMoreLabel}
                  showAllLabel={showAllLabel}
                  onShowMore={() => {
                    setVisibleCount((prev) =>
                      prev == null
                        ? DEFAULT_VISIBLE
                        : Math.min(totalCount, prev + SHOW_MORE_STEP)
                    );
                    track("therapies_library_show_more", {
                      step: SHOW_MORE_STEP,
                      placement: "bottom",
                    });
                  }}
                  onShowAll={() => {
                    setVisibleCount(totalCount);
                    track("therapies_library_show_all", {
                      totalCount,
                      placement: "bottom",
                    });
                  }}
                />
              </div>
            </div>

            {/* Bottom CTAs */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Want a quick starting point?
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-700">
                  Take the quiz to narrow down to a few options, then compare
                  providers.
                  <span className="mt-1 block text-xs text-slate-600">
                    No account. No email. Retake anytime.
                  </span>
                </p>
                <div className="mt-4">
                  <Link
                    href="/quiz"
                    onClick={() => track("therapies_library_quiz_click_bottom")}
                    className="inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Take the quiz →
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Prefer guidance while you choose?
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-700">
                  Preview the Decision Toolkit — questions to ask, red flags,
                  and a simple decision path.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/toolkit"
                    onClick={() =>
                      track("therapies_library_toolkit_preview_click")
                    }
                    className="inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                  >
                    Preview toolkit →
                  </Link>
                  <Link
                    href="/checkout?product=toolkit&src=therapies_page"
                    onClick={() =>
                      track("therapies_library_toolkit_checkout_click", {
                        src: "therapies_page",
                      })
                    }
                    className="inline-flex rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Get toolkit (PWYC) →
                  </Link>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  PWYC = pay what you can. Same toolkit either way.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
