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

function Section({
  id,
  step,
  title,
  subtitle,
  children,
}: {
  id: string;
  step?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2">
          {step ? (
            <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              {step}
            </div>
          ) : null}

          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>

          {subtitle ? (
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
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
      {/* softened from pure black */}
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
        {n}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}

function CompactCallout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
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
      className="group rounded-2xl border border-slate-200 bg-white p-5"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 group-open:hidden">
          Show
        </span>
        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 group-open:inline">
          Hide
        </span>
      </summary>
      <div className="mt-4">{children}</div>
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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50"
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
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
    <main className="min-h-screen bg-brand-gradient">
      <div id="top" className="mx-auto max-w-5xl px-6 py-12 sm:py-14">
        {/* HERO */}
        <header className="rounded-3xl bg-slate-800 px-7 py-9 shadow-sm sm:px-10 sm:py-11">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Credentials &amp; training
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Guided map
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Understanding therapist credentials
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Most people don’t know what they don’t know here — this page is
                structured to help you choose confidently.
              </p>
            </div>

            {/* Illinois-first positioning (strategic + confident) */}
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-sm leading-relaxed text-white/85">
                <span className="font-semibold text-white">
                  TherapyFit is currently built for Illinois-based care.
                </span>{" "}
                We’re starting with one state so guidance about licensing, credentials,
                and local support pathways stays accurate and usable — then expanding
                state-by-state using the same quality standard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#start"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Start here ↓
              </a>
              <a
                href="#verify"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Verify credentials ↓
              </a>
              <a
                href="#credentials"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Browse provider types ↓
              </a>
            </div>

            <p className="text-xs text-white/70">
              Educational only; verify credentials and scope directly with providers
              and your state board.
            </p>
          </div>
        </header>

        <div className="mt-8 space-y-6">
          {/* START HERE */}
          <Section
            id="start"
            title="Start here (pick what you’re trying to solve)"
            subtitle="You don’t need to know the acronyms. Choose the path that matches your situation."
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

            {hasQuery ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                  Showing results for{" "}
                  <span className="font-medium text-slate-900">
                    {query.trim()}
                  </span>
                </div>
                <a
                  href="#credentials"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
                >
                  Jump to results ↓
                </a>
              </div>
            ) : null}
          </Section>

          {/* STEP 1 */}
          <Section
            id="verify"
            step="Step 1"
            title="Verify credentials (fastest win)"
            subtitle="If you want to confirm licensure or check for disciplinary history, these are the most reliable places to look."
          >
            <div className="space-y-5">
              <InfoRow n="1" title="State license lookup (best first step)">
                <p>
                  Search your state’s professional licensing database for their{" "}
                  <span className="font-medium text-slate-900">name</span>{" "}
                  and{" "}
                  <span className="font-medium text-slate-900">
                    license number
                  </span>
                  . This is the most direct way to confirm active status, license
                  type, and (sometimes) discipline.
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Tip: if a provider lists a license number, search by that (fewer
                  duplicates than names).
                </p>
              </InfoRow>

              <InfoRow n="2" title="NPI lookup (U.S.)">
                <p>
                  Many healthcare providers have an{" "}
                  <span className="font-medium text-slate-900">NPI</span>{" "}
                  (National Provider Identifier). It can help confirm identity,
                  practice location, and provider type. It’s not a “quality badge,”
                  but it’s useful for verification.
                </p>
              </InfoRow>

              <InfoRow n="3" title="Board / professional association directories">
                <p>
                  Some specialty credentials have official registries. If someone
                  lists a specialty credential, ask which organization issued it and
                  whether they’re listed publicly.
                </p>
              </InfoRow>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-900">
                  Quick script you can use
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  “Can you share your license type and license number? And for{" "}
                  <em>[specialty]</em>, what training did you complete and how do you
                  apply it in sessions?”
                </p>
              </div>
            </div>
          </Section>

          {/* STEP 2 */}
          <Section
            id="licenses-vs-certifications"
            step="Step 2"
            title="License vs certification (what’s the difference?)"
            subtitle="Licenses are regulated and legally required to practice; certifications are extra specialization and vary widely."
          >
            <p className="text-sm leading-relaxed text-slate-700">
              A <strong>license</strong> is a state-granted credential that legally
              allows someone to practice (defined scope, ethics codes, board oversight,
              and consequences for violations). A{" "}
              <strong>certification</strong> is additional training in a specialty area
              (like EMDR, ERP, couples methods, or eating disorders).
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <CompactCallout title="License = multi-year, regulated pathway">
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    A qualifying <strong>degree</strong> (often Master’s or Doctorate)
                  </li>
                  <li>
                    <strong>2,000–4,000+ supervised hours</strong> after the degree
                    (varies by state and license)
                  </li>
                  <li>
                    One or more <strong>licensure exams</strong>
                  </li>
                  <li>
                    Ongoing <strong>continuing education</strong> + board oversight
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-600">
                  Not just a class: education, supervised practice, testing, and legal
                  accountability.
                </p>
              </CompactCallout>

              <CompactCallout title="Certification = extra specialization (rigor varies)">
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    Often <strong>days to months</strong> of training (sometimes longer)
                  </li>
                  <li>
                    May include <strong>consultation/supervision</strong> specific to the method
                  </li>
                  <li>
                    Issued by a <strong>professional organization</strong> (quality varies)
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-600">
                  Certifications can signal specialization, but “certified” isn’t a uniform standard.
                  Ask what training they actually completed.
                </p>
              </CompactCallout>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-emerald-50 p-5">
              <div className="text-sm font-semibold text-slate-900">
                Quick rule of thumb
              </div>
              <p className="mt-2 text-sm text-slate-700">
                <strong>License = legal permission to practice.</strong>{" "}
                <strong>Certification = extra specialization.</strong>
              </p>
            </div>
          </Section>

          {/* STEP 3 */}
          <Section
            id="credentials"
            step="Step 3"
            title="Browse provider types (who’s who)"
            subtitle="Start with categories and explanations. If you’re decoding a specific profile, use the optional jump tool below."
          >
            <div className="mt-1">
              <CredentialsExplorer query={query} />
            </div>

            <div className="mt-6 space-y-4">
              <Accordion title="Optional: Jump to a credential or training term (search)">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <CredentialsSearchBar initialQuery={query} />
                </div>
              </Accordion>

              <p className="text-xs text-slate-500">
                Tip: If you’re not sure what to type, browse categories above.
                The jump tool is best when you already have letters/terms from a provider profile.
              </p>
            </div>
          </Section>

          {/* OPTIONAL TOOLS */}
          <Section
            id="tools"
            title="Optional tools"
            subtitle="Useful extras if you want to go deeper — kept out of the main flow so the page stays focused."
          >
            <div className="space-y-4">
              <Accordion title="Training terms translator (what the words actually mean)">
                <TrainingTranslator />
              </Accordion>

              <Accordion title="What to ask in a first call (copy/paste prompts)">
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-slate-700">
                    These questions help you understand fit quickly — without needing to know therapy jargon.
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                    <li>
                      “What’s your approach with <em>[my main concern]</em>, and what would sessions look like?”
                    </li>
                    <li>“How do you decide what we work on week to week?”</li>
                    <li>“How will we measure progress?”</li>
                    <li>“If I’m stuck, what do you do differently?”</li>
                    <li>“What should I do between sessions (if anything)?”</li>
                  </ul>
                  <p className="text-xs leading-relaxed text-slate-600">
                    You’re not trying to get the “right” answer — you’re checking whether the approach matches what you need.
                  </p>
                </div>
              </Accordion>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questions"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Common therapy questions →
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Community support and services →
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Educational only; verify credentials and scope directly with providers and your state board.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
