// app/components/TopTherapyQuestions.tsx
"use client";

import * as React from "react";

export type FaqItem = {
  id: string;
  q: string;
  icon?: string;
  a: React.ReactNode;
  category?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AnyEl = React.ReactElement<{ children?: React.ReactNode; className?: string }>;

function asElement(node: React.ReactNode): AnyEl | null {
  return React.isValidElement(node) ? (node as AnyEl) : null;
}

function nodeToText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  const el = asElement(node);
  if (el) return nodeToText(el.props.children);
  return "";
}

function isShortAnswerParagraph(node: React.ReactNode): boolean {
  const el = asElement(node);
  if (!el) return false;
  if (typeof el.type !== "string") return false;
  if (el.type !== "p") return false;
  return nodeToText(el).toLowerCase().includes("short answer:");
}

function isHeadingParagraph(node: React.ReactNode): boolean {
  const el = asElement(node);
  if (!el || typeof el.type !== "string" || el.type !== "p") return false;
  return String(el.props.className ?? "").includes("font-semibold");
}

function getHeadingTitle(node: React.ReactNode): string {
  return nodeToText(node).trim().replace(/:\s*$/, "");
}

type ParsedAnswer = {
  visible: React.ReactNode[];
  sections: Array<{ title: string; content: React.ReactNode[] }>;
};

function parseAnswer(a: React.ReactNode): ParsedAnswer {
  const parts = React.Children.toArray(a);
  const shortIdx = parts.findIndex(isShortAnswerParagraph);

  if (shortIdx === -1) {
    return {
      visible: parts,
      sections: [],
    };
  }

  const afterShort = parts.slice(shortIdx + 1);
  const firstHeadingIdx = afterShort.findIndex(isHeadingParagraph);
  const preHeading =
    firstHeadingIdx === -1 ? afterShort : afterShort.slice(0, firstHeadingIdx);

  const visible = [parts[shortIdx], ...preHeading.slice(0, 2)].filter(Boolean);

  const collapsed = [
    ...preHeading.slice(2),
    ...(firstHeadingIdx === -1 ? [] : afterShort.slice(firstHeadingIdx)),
  ];

  const sections: ParsedAnswer["sections"] = [];
  let currentTitle = "More detail";
  let buffer: React.ReactNode[] = [];

  for (const node of collapsed) {
    if (isHeadingParagraph(node)) {
      if (buffer.length) sections.push({ title: currentTitle, content: buffer });
      currentTitle = getHeadingTitle(node);
      buffer = [];
    } else {
      buffer.push(node);
    }
  }

  if (buffer.length) sections.push({ title: currentTitle, content: buffer });

  return { visible, sections };
}

function AnswerSections({ a }: { a: React.ReactNode }) {
  const parsed = React.useMemo(() => parseAnswer(a), [a]);

  return (
    <div className="mt-4">
      {parsed.visible.length > 0 && <div className="space-y-3">{parsed.visible}</div>}

      {parsed.sections.length > 0 && (
        <div className="mt-4 space-y-2">
          {parsed.sections.map((s, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-slate-200 bg-slate-50/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">{s.title}</span>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 group-open:hidden">
                  Show
                </span>
                <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 group-open:inline">
                  Hide
                </span>
              </summary>

              <div className="space-y-3 px-4 pb-4">{s.content}</div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function TopTherapyQuestions({ items }: { items: FaqItem[] }) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());

  const grouped = React.useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    for (const item of items) {
      const cat = item.category ?? "General";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      id: `cat-${slugify(category)}`,
      items,
    }));
  }, [items]);

  return (
    <div className="mt-10 space-y-12">
      {grouped.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-28">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">{group.category}</h2>

          <div className="space-y-4">
            {group.items.map((item) => {
              const isOpen = openIds.has(item.id);
              const contentId = `${item.id}-content`;
              const buttonId = `${item.id}-button`;

              return (
                <section
                  key={item.id}
                  className={cn(
                    "rounded-3xl border border-slate-200 bg-white shadow-sm transition",
                    isOpen && "ring-2 ring-slate-200"
                  )}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() =>
                      setOpenIds((prev) => {
                        const next = new Set(prev);
                        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                        return next;
                      })
                    }
                    className={cn(
                      "flex w-full items-start justify-between p-6 text-left",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    )}
                  >
                    <div className="flex gap-3">
                      {item.icon ? (
                        <span aria-hidden className="text-xl leading-none">
                          {item.icon}
                        </span>
                      ) : null}

                      <h3 className="text-lg font-semibold text-slate-900">{item.q}</h3>
                    </div>

                    <span
                      aria-hidden
                      className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                    >
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-6 pb-6"
                    >
                      <AnswerSections a={item.a} />
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
