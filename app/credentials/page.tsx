// app/credentials/page.tsx
import * as React from "react";
import Link from "next/link";
import TrainingTranslator from "../components/TrainingTranslator";
import { CredentialsExplorer } from "../components/CredentialsExplorer";
import { CredentialsSearchBar } from "../components/CredentialsSearchBar";

export const metadata = {
  title: "Understanding Therapist Credentials & Training • Therapy Fit",
  description:
    "Understand therapist credentials (LPC, LCPC, LCSW, LMFT, PhD/PsyD, MD/DO, PMHNP) and what specialty training/certifications can mean (EMDR, ERP, sex therapy, eating disorders, etc.).",
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Tone = "slate" | "emerald" | "sky" | "amber";

function Section({
  id,
  step,
  title,
  subtitle,
  tone = "slate",
  children,
}: {
  id: string;
  step?: string;
  title: string;
  subtitle?: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  const tones: Record<Tone, string> = {
    slate: "border-slate-200 bg-white",
    emerald: "border-emerald-200 bg-emerald-50/40",
    sky: "border-sky-200 bg-sky-50/40",
    amber: "border-amber-200 bg-amber-50/40",
  };

  const chips: Record<Tone, string> = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    emerald: "border-emerald-200 bg-emerald-100/70 text-emerald-900",
    sky: "border-sky-200 bg-sky-100/70 text-sky-900",
    amber: "border-amber-200 bg-amber-100/70 text-amber-900",
  };

  return (
    <section id={id} className="scroll-mt-28">
      <div
        className={classNames(
          "rounded-3xl border p-7 shadow-sm sm:p-8",
          tones[tone]
        )}
      >
        <div className="flex flex-col gap-2">
          {step ? (
            <div
              className={classNames(
                "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                chips[tone]
              )}
            >
              {step}
            </div>
          ) : null}

          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>

          {subtitle ? (
            <p className="max-w-3xl text-sm leading-7 text-slate-700">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function InfoRow({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white shadow-sm">
        {n}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm leading-7 text-slate-800">{children}</div>
      </div>
    </div>
  );
}

function CompactCallout({
  title,
  tone = "slate",
  children,
}: {
  title: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  const box: Record<Tone, string> = {
    slate: "border-slate-200 bg-slate-50",
    emerald: "border-emerald-200 bg-emerald-50",
    sky: "border-sky-200 bg-sky-50",
    amber: "border-amber-200 bg-amber-50",
  };

  return (
    <div className={classNames("rounded-2xl border p-5", box[tone])}>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-7 text-slate-800">{children}</div>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 group-open:hidden">
          Show +
        </span>
        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 group-open:inline">
          Hide –
        </span>
      </summary>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {children}
      </div>
    </details>
  );
}

function JumpCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition
                 hover:-translate-y-[1px] hover:border-slate-300 hover:shadow
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
    >
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-FIELD via-FIELD to-FIELD opacity-80" />
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300 opacity-80" />
      <div className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">
        {title}
      </div>
      <p className="mt-1 text-sm leading-7 text-slate-700">{desc}</p>
      <div className="mt-3 text-xs font-semibold text-emerald-800">
        Open →{" "}
        <span className="text-slate-400 group-hover:text-slate-500">
          ({href.replace("#", "")})
        </span>
      </div>
    </a>
  );
}

export default function CredentialsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const qRaw = searchParams?.q;
  const query = typeof qRaw === "string" ? qRaw : "";
  const hasQuery = query.trim().length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div id="top" className="mx-auto max-w-5xl px-6 py-12 sm:py-14">
        {/* HERO */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 px-7 py-9 shadow-sm sm:px-10 sm:py-11">
          <div className="pointer-events-none absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-[-80px] h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Credentials &amp; training
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Step-by-step guide
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Understanding therapist credentials
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
                Use this page to{" "}
                <span className="font-semibold text-white">
                  verify someone is licensed
                </span>{" "}
                and{" "}
                <span className="font-semibold text-white">
                  understand what the letters mean
                </span>{" "}
                — without needing jargon.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
                You’re in the right place if you’re seeing acronyms
                (LPC/LCPC/LCSW/LMFT) or “certified in…” and you want to know
                what’s legit and what questions to ask.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-sm leading-7 text-white/85">
                <span className="font-semibold text-white">
                  TherapyFit is currently built for Illinois-based care.
                </span>{" "}
                We’re starting with one state so guidance about licensing,
                credentials, and local support pathways stays accurate and usable
                — then expanding state-by-state using the same quality standard.
              </p>
            </div>

            <p className="text-xs text-white/70">
              Educational only; verify credentials and scope directly with
              providers and your state board.
            </p>
          </div>
        </header>

        {/* ✅ ONE SEARCH BAR ONLY (always anchors to results) */}
        <div
          id="credential-search"
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                🔎 Quick search
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                Search a credential or acronym
              </h2>
              <p className="mt-1 text-sm leading-7 text-slate-700">
                Best when you already have letters from a provider profile
                (LCSW, PMHNP, ATR-BC, BCBA, OT, SLP…).
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href="/credentials#credentials"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Clear
              </a>
              <a
                href="#start"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Or start guided ↓
              </a>
            </div>
          </div>

          <div className="mt-4">
            <CredentialsSearchBar
              initialQuery={query}
              action="/credentials#credentials"
            />
          </div>

          {hasQuery ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Showing results for{" "}
                <span className="font-semibold text-slate-900">
                  {query.trim()}
                </span>
              </div>
              <a
                href="#credentials"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Jump to results ↓
              </a>
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-600">
              Tip: If nothing shows up, try fewer characters (e.g., “ATR” or
              “art therapy” instead of a full sentence).
            </div>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {/* START HERE */}
          <Section
            id="start"
            title="Start here (pick what you’re trying to solve)"
            subtitle="You don’t need to know the acronyms. Choose the path that matches your situation."
            tone="slate"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <JumpCard
                href="#verify"
                title="I want to make sure someone is qualified"
                desc="How to verify a license, confirm status, and check for discipline."
              />
              <JumpCard
                href="#licenses-vs-certifications"
                title="I keep seeing “certified in…”, EMDR, ERP, etc."
                desc="Licenses are regulated; certifications vary. Here’s how to interpret them."
              />
              <JumpCard
                href="#credentials"
                title="I’m choosing a therapist and want to understand roles"
                desc="Browse provider types (LPC/LCPC, LCSW, LMFT, Psychologist…) and what to ask."
              />
              <JumpCard
                href="#tools"
                title="I’m reading a provider profile and need a translator"
                desc="Optional tools: decode terms + copy/paste questions to ask."
              />
            </div>
          </Section>

          {/* STEP 1 */}
          <Section
            id="verify"
            step="Step 1"
            title="Verify credentials (fastest win)"
            subtitle="If you want to confirm licensure or check for disciplinary history, these are the most reliable places to look."
            tone="emerald"
          >
            <div className="space-y-5">
              <InfoRow n="1" title="State license lookup (best first step)">
                <p>
                  Search your state’s professional licensing database for their{" "}
                  <span className="font-semibold text-slate-950">name</span> and{" "}
                  <span className="font-semibold text-slate-950">
                    license number
                  </span>
                  . This is the most direct way to confirm active status, license
                  type, and (sometimes) discipline.
                </p>
                <p className="mt-2 text-xs text-slate-700">
                  Tip: if a provider lists a license number, search by that
                  (fewer duplicates than names).
                </p>
              </InfoRow>

              <InfoRow n="2" title="NPI lookup (U.S.)">
                <p>
                  Many healthcare providers have an{" "}
                  <span className="font-semibold text-slate-950">NPI</span>{" "}
                  (National Provider Identifier). It can help confirm identity,
                  practice location, and provider type. It’s not a “quality badge,”
                  but it’s useful for verification.
                </p>
              </InfoRow>

              <InfoRow n="3" title="Board / professional association directories">
                <p>
                  Some specialty credentials have official registries. If someone
                  lists a specialty credential, ask which organization issued it
                  and whether they’re listed publicly.
                </p>
              </InfoRow>

              <CompactCallout title="Quick script you can use" tone="emerald">
                “Can you share your license type and license number? And for{" "}
                <em>[specialty]</em>, what training did you complete and how do
                you apply it in sessions?”
              </CompactCallout>
            </div>
          </Section>

          {/* STEP 2 */}
          <Section
            id="licenses-vs-certifications"
            step="Step 2"
            title="License vs certification (what’s the difference?)"
            subtitle="Licenses are regulated and legally required to practice; certifications are extra specialization and vary widely."
            tone="sky"
          >
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <CompactCallout
                title="License = multi-year, regulated pathway"
                tone="sky"
              >
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    A qualifying <strong>degree</strong> (often Master’s or
                    Doctorate)
                  </li>
                  <li>
                    <strong>2,000–4,000+ supervised hours</strong> after the
                    degree (varies by state and license)
                  </li>
                  <li>
                    One or more <strong>licensure exams</strong>
                  </li>
                  <li>
                    Ongoing <strong>continuing education</strong> + board
                    oversight
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-700">
                  Not just a class: education, supervised practice, testing, and
                  legal accountability.
                </p>
              </CompactCallout>

              <CompactCallout
                title="Certification = extra specialization (rigor varies)"
                tone="amber"
              >
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    Often <strong>days to months</strong> of training (sometimes
                    longer)
                  </li>
                  <li>
                    May include <strong>consultation/supervision</strong>{" "}
                    specific to the method
                  </li>
                  <li>
                    Issued by a <strong>professional organization</strong>{" "}
                    (quality varies)
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-700">
                  Certifications can signal specialization, but “certified”
                  isn’t a uniform standard. Ask what training they actually
                  completed.
                </p>
              </CompactCallout>
            </div>
          </Section>

          {/* STEP 3 */}
          <Section
            id="credentials"
            step="Step 3"
            title="Browse provider types (who’s who)"
            subtitle="Categories and explanations below. If you searched above, your results will appear here."
            tone="amber"
          >
            <div className="mt-1">
              <CredentialsExplorer query={query} />
            </div>

            <div className="mt-6">
              <a
                href="#credential-search"
                className="text-sm font-semibold text-emerald-800 hover:underline"
              >
                Back to search ↑
              </a>
            </div>
          </Section>

          {/* OPTIONAL TOOLS */}
          <Section
            id="tools"
            title="Optional tools"
            subtitle="Useful extras if you want to go deeper — kept out of the main flow so the page stays focused."
            tone="slate"
          >
            <div className="space-y-4">
              <Accordion title="Training terms translator (what the words actually mean)">
                <TrainingTranslator />
              </Accordion>

              <Accordion title="What to ask in a first call (copy/paste prompts)">
                <div className="space-y-3">
                  <p className="text-sm leading-7 text-slate-800">
                    These questions help you understand fit quickly — without
                    needing therapy jargon.
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-800">
                    <li>
                      “What’s your approach with <em>[my main concern]</em>, and
                      what would sessions look like?”
                    </li>
                    <li>“How do you decide what we work on week to week?”</li>
                    <li>“How will we measure progress?”</li>
                    <li>“If I’m stuck, what do you do differently?”</li>
                    <li>“What should I do between sessions (if anything)?”</li>
                  </ul>
                  <p className="text-xs leading-7 text-slate-700">
                    You’re not trying to get the “right” answer — you’re
                    checking whether the approach matches what you need.
                  </p>
                </div>
              </Accordion>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questions"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Common therapy questions →
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Community support and services →
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-700">
              Educational only; verify credentials and scope directly with
              providers and your state board.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
