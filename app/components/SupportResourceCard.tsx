// app/components/SupportResourceCard.tsx
"use client";

import React from "react";

type ChipTone = "neutral" | "good" | "caution" | "crisis";

type Chip = {
  label: string;
  tone?: ChipTone;
};

type ContactBase = { label?: string; href: string; priority?: number };

type Contact =
  | ({ type: "call" } & ContactBase)
  | ({ type: "text" } & ContactBase)
  | ({ type: "chat" } & ContactBase)
  | ({ type: "web" } & ContactBase);

export type SupportResource = {
  name: string;
  description: string; // 1–2 lines max recommended
  coverage?: string;
  availability?: string;
  contacts: Contact[];
  chips?: Chip[];
  safetyNote?: string;
  emphasis?: "default" | "crisis";
};

function chipClasses(tone: ChipTone) {
  switch (tone) {
    case "good":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "caution":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "crisis":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-slate-200 bg-white text-slate-700";
  }
}

function accentBarClasses(emphasis: SupportResource["emphasis"]) {
  if (emphasis === "crisis") return "bg-red-500";
  return "bg-indigo-500";
}

function contactLabel(c: Contact) {
  if (c.label) return c.label;
  if (c.type === "call") return "Call";
  if (c.type === "text") return "Text";
  if (c.type === "chat") return "Chat";
  return "Website";
}

function contactIsPrimary(type: Contact["type"]) {
  return type === "call" || type === "text" || type === "chat";
}

function contactClasses(type: Contact["type"]) {
  const base =
    "inline-flex items-center justify-center rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (contactIsPrimary(type)) {
    return [
      base,
      "border-slate-300 bg-slate-900 text-white hover:bg-slate-800",
      "focus:ring-slate-300",
    ].join(" ");
  }

  return [
    base,
    "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    "focus:ring-slate-200",
  ].join(" ");
}

function metaPill(text: string) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      {text}
    </span>
  );
}

function sortContacts(contacts: Contact[]) {
  const defaultRank: Record<Contact["type"], number> = {
    call: 1,
    text: 2,
    chat: 3,
    web: 4,
  };

  return [...contacts].sort((a, b) => {
    const ap = a.priority ?? defaultRank[a.type] ?? 99;
    const bp = b.priority ?? defaultRank[b.type] ?? 99;
    return ap - bp;
  });
}

export function SupportResourceCard({ r }: { r: SupportResource }) {
  const contacts = sortContacts(r.contacts).slice(0, 4);
  const chips = (r.chips ?? []).slice(0, 6);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Accent bar */}
      <div
        className={[
          "absolute left-0 top-0 h-full w-1",
          accentBarClasses(r.emphasis ?? "default"),
        ].join(" ")}
      />

      <div className="pl-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-snug text-slate-900">
              {r.name}
            </div>

            <div className="mt-1 text-sm leading-relaxed text-slate-600">
              {r.description}
            </div>

            {(r.coverage || r.availability) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.coverage ? metaPill(`Coverage: ${r.coverage}`) : null}
                {r.availability ? metaPill(`Hours: ${r.availability}`) : null}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {contacts.map((c, idx) => (
              <a
                key={idx}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className={contactClasses(c.type)}
              >
                {contactLabel(c)}
              </a>
            ))}
          </div>
        </div>

        {chips.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className={[
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  chipClasses(chip.tone ?? "neutral"),
                ].join(" ")}
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}

        {r.safetyNote ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="flex gap-2">
              <div className="mt-0.5 text-slate-500">ℹ️</div>
              <div className="text-[11px] leading-relaxed text-slate-700">
                {r.safetyNote}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
