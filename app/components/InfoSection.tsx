// app/components/InfoSection.tsx
import React from "react";

export function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-4 text-sm leading-6 text-slate-700">
        {children}
      </div>
    </section>
  );
}

export function Callout({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "good" | "caution";
  title?: string;
  children: React.ReactNode;
}) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "caution"
      ? "border-amber-200 bg-amber-50"
      : "border-slate-200 bg-slate-50";

  return (
    <div className={`rounded-2xl border p-5 ${cls}`}>
      {title ? (
        <div className="text-sm font-medium text-slate-900">{title}</div>
      ) : null}
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

export function BulletList({ items }: { items: React.ReactNode[] }) {
  return <ul className="list-disc space-y-2 pl-5">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}

export function DividerLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {children}
      </div>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
