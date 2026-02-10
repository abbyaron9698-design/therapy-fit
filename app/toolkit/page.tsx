// app/toolkit/page.tsx
import React from "react";
import Link from "next/link";
import ToolkitPricingClient from "./components/ToolkitPricingClient";

export const metadata = {
  title: "Therapy Decision Toolkit • Therapy Fit",
  description:
    "Find the right therapy — without the guesswork. A practical toolkit to choose, evaluate, and advocate for yourself in therapy.",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </div>
  );
}

function SectionCard({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
    >
      <Eyebrow>Toolkit</Eyebrow>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SidebarNav({ items }: { items: Array<{ id: string; title: string }> }) {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <Eyebrow>On this page</Eyebrow>
      <ul className="mt-3 space-y-1.5">
        {items.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <a
          href="#top"
          className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        >
          Back to top ↑
        </a>
      </div>
    </nav>
  );
}

function CalmList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

const SIDEBAR = [
  { id: "whats-inside", title: "What’s inside" },
  { id: "how-to-use", title: "How to use it" },
  { id: "pricing", title: "Pay what you can" },
];

type SearchParamsShape = Record<string, string | string[] | undefined>;

function pickString(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

export default async function ToolkitPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParamsShape> | SearchParamsShape;
}) {
  const sp: SearchParamsShape = await Promise.resolve(searchParams ?? {});

  const focus = pickString(sp.focus);
  const profileLabel = pickString(sp.profile);
  const src = pickString(sp.src) ?? "toolkit_page";

  return (
    <main className="min-h-screen bg-brand-gradient">
      <div id="top" className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Decision toolkit
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Find the Right Therapy — Without the Guesswork.
          </h1>

          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            A practical toolkit to help you choose well, ask better questions, and advocate for
            yourself—without turning therapy into a second job.
          </p>

          {focus || profileLabel ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-medium text-slate-900">Personalized:</span>{" "}
              {focus ? (
                <span>
                  Focus{" "}
                  <span className="font-semibold text-slate-900">
                    {focus.replace(/-/g, " ")}
                  </span>
                </span>
              ) : null}
              {focus && profileLabel ? <span className="mx-2 text-slate-400">•</span> : null}
              {profileLabel ? (
                <span>
                  Style <span className="font-semibold text-slate-900">{profileLabel}</span>
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pricing"
              className="
                inline-flex items-center justify-center
                rounded-2xl px-5 py-3
                text-sm font-semibold
                bg-emerald-700 text-white
                shadow-sm transition
                hover:bg-emerald-800
                focus:outline-none focus:ring-2 focus:ring-emerald-300
              "
            >
              Get the toolkit →
            </a>

            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Take the quiz →
            </Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
            <div className="hidden lg:block">
              <SidebarNav items={SIDEBAR} />
            </div>

            <div className="space-y-6">
              <SectionCard
                id="whats-inside"
                title="What’s inside"
                subtitle="One page. Built for people who want clarity fast."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">Choose better</div>
                    <CalmList
                      items={[
                        "Fit checklist: green flags, neutral signs, deal-breakers.",
                        "Consult questions that reveal how therapy actually works.",
                      ]}
                    />
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">Advocate for yourself</div>
                    <CalmList
                      items={[
                        "Copy/paste scripts for pace, structure, goals, feedback.",
                        "Course-correcting without shame or escalation.",
                      ]}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="how-to-use"
                title="How to use it"
                subtitle="Designed for learning + deciding without overwhelm."
              >
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <CalmList
                    items={[
                      "Decide fast: pick 3 questions + the fit checklist.",
                      "Learn more: read the full page + save scripts for later.",
                      "Overwhelmed: choose one next step. That’s enough.",
                    ]}
                  />
                </div>
              </SectionCard>

              <SectionCard
                id="pricing"
                title="Pay what you can"
                subtitle="Access-first. You choose what’s workable."
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">How it works</div>
                    <CalmList
                      items={[
                        "Choose a tier or enter a custom amount.",
                        "$0 is always okay.",
                        "If you can pay more, you help fund access for others.",
                      ]}
                    />
                  </div>

                  <ToolkitPricingClient focus={focus} profileLabel={profileLabel} src={src} />
                </div>
              </SectionCard>

              <p className="text-xs text-slate-500">Educational only; not medical or legal advice.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
