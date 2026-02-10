// app/crisis/page.tsx
import React from "react";
import { SupportResourceCard } from "../components/SupportResourceCard";

type Resource = Parameters<typeof SupportResourceCard>[0]["r"];

/* =========================
   RESOURCES
   ========================= */

const CRISIS_START_HERE: Resource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description:
      "Free, confidential support for people in distress — and for anyone worried about someone else.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:988", label: "Call 988" },
      { type: "text", href: "sms:988", label: "Text 988" },
      { type: "chat", href: "https://988lifeline.org/chat/", label: "Chat online" },
    ],
    chips: [
      { label: "24/7", tone: "neutral" },
      { label: "Free", tone: "good" },
      { label: "Confidential", tone: "good" },
    ],
    emphasis: "crisis",
  },
  {
    name: "Crisis Text Line",
    description: "Text-based crisis support for moments of acute distress.",
    coverage: "United States",
    availability: "24/7",
    contacts: [{ type: "text", href: "sms:741741", label: "Text HOME to 741741" }],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Text", tone: "neutral" }],
    emphasis: "crisis",
  },
  {
    name: "Veterans Crisis Line (via 988)",
    description: "For veterans, service members, and their loved ones.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:988", label: "Call 988, then press 1" },
      { type: "text", href: "sms:838255", label: "Text 838255" },
      { type: "chat", href: "https://www.veteranscrisisline.net/get-help-now/chat/", label: "Chat online" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Veterans", tone: "neutral" }],
    emphasis: "crisis",
  },
  {
    name: "988 (Spanish options)",
    description: "Spanish-speaking support by phone, text, and chat.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:988", label: "Call 988, then press 2" },
      { type: "text", href: "sms:988", label: "Text AYUDA to 988" },
      { type: "chat", href: "https://988lifeline.org/chat/", label: "Chat (start in Spanish)" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Español", tone: "neutral" }],
    emphasis: "crisis",
  },
];

const LGBTQ_YOUTH: Resource[] = [
  {
    name: "The Trevor Project (LGBTQ+ youth)",
    description: "Crisis support for LGBTQ+ young people via phone, text, and chat.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:18664887386", label: "Call 1-866-488-7386" },
      { type: "text", href: "sms:678678", label: "Text START to 678678" },
      { type: "chat", href: "https://www.thetrevorproject.org/get-help/", label: "Chat online" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "LGBTQ+ youth", tone: "neutral" }],
    emphasis: "crisis",
  },
  {
    name: "Trans Lifeline",
    description: "Peer support hotline run by and for trans people (hours vary).",
    coverage: "United States / Canada",
    availability: "Hours vary",
    contacts: [{ type: "web", href: "https://translifeline.org/", label: "Website / hotline options" }],
    chips: [{ label: "Peer support" }, { label: "Trans-led" }],
    emphasis: "crisis",
  },
  {
    name: "LGBT National Hotline",
    description: "Confidential support for LGBTQ+ individuals (hours vary).",
    coverage: "United States",
    availability: "Hours vary",
    contacts: [{ type: "web", href: "https://lgbthotline.org/", label: "Website / hotline options" }],
    chips: [{ label: "LGBTQ+" }, { label: "Confidential" }],
    emphasis: "crisis",
  },
];

const YOUTH_GENERAL: Resource[] = [
  {
    name: "Illinois CARES Line (youth crisis support)",
    description:
      "24/7 crisis support for children and teens. Caregivers/providers can also call for help navigating urgent situations.",
    coverage: "Illinois",
    availability: "24/7",
    contacts: [{ type: "call", href: "tel:18003459049", label: "Call 1-800-345-9049" }],
    chips: [
      { label: "24/7", tone: "neutral" },
      { label: "Illinois", tone: "neutral" },
      { label: "Youth", tone: "neutral" },
    ],
    emphasis: "crisis",
  },
  {
    name: "National Runaway Safeline",
    description:
      "Support for young people who are thinking about running away or who have run away; also supports families.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:18007862929", label: "Call 1-800-RUNAWAY" },
      { type: "web", href: "https://www.1800runaway.org/", label: "Website / options" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Youth", tone: "neutral" }],
    emphasis: "crisis",
  },
];

const DV_SA: Resource[] = [
  {
    name: "National Domestic Violence Hotline",
    description: "Support, safety planning, and resources for people experiencing relationship abuse.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:18007997233", label: "Call 1-800-799-7233" },
      { type: "web", href: "https://www.thehotline.org/", label: "Website" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Safety planning", tone: "caution" }],
    emphasis: "crisis",
  },
  {
    name: "RAINN (National Sexual Assault Hotline)",
    description: "Confidential support and connection to local sexual assault resources.",
    coverage: "United States",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:18006564673", label: "Call 1-800-656-4673" },
      { type: "chat", href: "https://hotline.rainn.org/online", label: "Online chat" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Confidential", tone: "good" }],
    emphasis: "crisis",
  },
  {
    name: "Anti-Violence Project",
    description: "Support and advocacy for LGBTQ+ survivors of violence (availability varies).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://avp.org/", label: "Website" }],
    chips: [{ label: "LGBTQ+" }, { label: "Advocacy" }],
    emphasis: "crisis",
  },
  {
    name: "YWCA (Rape crisis / sexual assault services)",
    description: "Find local sexual assault support and advocacy services (availability varies).",
    coverage: "United States",
    availability: "Varies",
    contacts: [{ type: "web", href: "https://www.ywca.org/", label: "Find local YWCA" }],
    chips: [{ label: "Sexual assault" }, { label: "Advocacy" }],
    emphasis: "crisis",
  },
  {
    name: "Illinois Domestic Violence Helpline",
    description: "Statewide domestic violence hotline for support and local referrals.",
    coverage: "Illinois",
    availability: "24/7",
    contacts: [{ type: "call", href: "tel:18778636338", label: "Call 1-877-863-6338" }],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Illinois", tone: "neutral" }],
    emphasis: "crisis",
  },
  {
    name: "Chicago Rape Crisis Hotline",
    description: "Confidential support and connection to sexual assault services (Chicago-area).",
    coverage: "Chicago area",
    availability: "24/7 (verify)",
    contacts: [{ type: "call", href: "tel:18882932080", label: "Call 1-888-293-2080" }],
    chips: [{ label: "Chicago area", tone: "neutral" }, { label: "Confidential", tone: "good" }],
    emphasis: "crisis",
  },
];

const SUBSTANCE_CRISIS: Resource[] = [
  {
    name: "Illinois Helpline (substance use + problem gambling)",
    description:
      "Confidential help finding treatment and support for substance use and problem gambling.",
    coverage: "Illinois",
    availability: "24/7",
    contacts: [
      { type: "call", href: "tel:18332346343", label: "Call 833-2FINDHELP" },
      { type: "web", href: "https://helplineil.org/", label: "Website" },
    ],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Illinois", tone: "neutral" }],
    emphasis: "crisis",
  },
  {
    name: "SAMHSA National Helpline",
    description: "Treatment referral and information service (substance use + mental health).",
    coverage: "United States",
    availability: "24/7",
    contacts: [{ type: "call", href: "tel:18006624357", label: "Call 1-800-662-HELP" }],
    chips: [{ label: "24/7", tone: "neutral" }, { label: "Referrals", tone: "neutral" }],
    emphasis: "crisis",
  },
];

/* =========================
   UI HELPERS
   ========================= */

function QuickAction({
  href,
  label,
  sub,
  tone = "neutral",
}: {
  href: string;
  label: string;
  sub?: string;
  tone?: "primary" | "neutral" | "danger";
}) {
  const base =
    "group flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left shadow-sm transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300";

  const styles =
    tone === "primary"
      ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100/60"
      : tone === "danger"
      ? "border-red-200 bg-red-50 hover:bg-red-100/60"
      : "border-slate-200 bg-white hover:bg-slate-50";

  return (
    <a href={href} className={base + styles}>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        {sub ? <div className="mt-1 text-xs text-slate-600">{sub}</div> : null}
      </div>
      <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 group-hover:bg-slate-50">
        Open →
      </div>
    </a>
  );
}

function JumpPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
    >
      {label}
    </a>
  );
}

function PanelSection({
  id,
  title,
  label,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  label?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {label ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {label}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        <a
          href="#top"
          className="text-xs font-semibold text-emerald-800 hover:underline"
        >
          Back to top ↑
        </a>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="columns-1 gap-4 [column-fill:balance] md:columns-2">
          {children}
        </div>
      </div>
    </section>
  );
}

function TextOnlyList({ title, items }: { title: string; items: Resource[] }) {
  return (
    <div className="mt-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((r) => (
          <li
            key={r.name}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="font-medium text-slate-900">{r.name}</div>
            <div className="mt-1 text-slate-700">{r.description}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
              <span>Coverage: {r.coverage}</span>
              <span>•</span>
              <span>Hours: {r.availability}</span>
            </div>
            {r.contacts?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {r.contacts.map((c) => (
                  <a
                    key={`${r.name}-${c.label}`}
                    href={c.href}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================
   PAGE
   ========================= */

export default function CrisisPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div id="top" className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Crisis support
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Crisis Support
            </h1>

            {/* ACTION-FIRST: immediate doors */}
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <div className="text-sm font-semibold text-red-800">
                If this is an emergency
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-900">
                If you are in immediate danger or at risk of harm, call{" "}
                <strong>911</strong> (or your local emergency number). If you’re
                not sure what to do next, start with{" "}
                <strong>988</strong>.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <QuickAction
                  href="tel:988"
                  label="Call 988"
                  sub="24/7, free, confidential"
                  tone="primary"
                />
                <QuickAction
                  href="sms:988"
                  label="Text 988"
                  sub='Text 988 (or "AYUDA" for Spanish options)'
                  tone="primary"
                />
                <QuickAction
                  href="https://988lifeline.org/chat/"
                  label="Chat online (988)"
                  sub="If speaking isn’t possible"
                />
                <QuickAction
                  href="tel:911"
                  label="Call 911"
                  sub="If there’s immediate danger"
                  tone="danger"
                />
              </div>

              <p className="mt-3 text-xs text-slate-600">
                Availability, hours, and policies can change. Confirm details
                with each service when possible.
              </p>
            </div>

            {/* Jump navigation */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">
                Jump to what you need
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <JumpPill href="#start-here" label="Start here" />
                <JumpPill href="#lgbtq-youth" label="LGBTQ+ youth" />
                <JumpPill href="#youth" label="Youth (general)" />
                <JumpPill href="#dv-sa" label="Domestic violence / sexual assault" />
                <JumpPill href="#substance" label="Substance use" />
                <JumpPill href="#text-only" label="Text-only view" />
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href="/support"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Need non-crisis help? Support &amp; Services →
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Back to home
                </a>
              </div>
            </div>

            {/* Device safety callout */}
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="text-sm font-semibold text-slate-900">
                Device safety note (especially for relationship abuse)
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">
                If someone monitors your phone or browsing history, consider using
                a safer device, private browsing, or clearing history. If you’re
                unsure, a hotline advocate can help you plan safest next steps.
              </p>
            </div>

            {/* Text-only friendly mode */}
            <details
              id="text-only"
              className="rounded-3xl border border-slate-200 bg-white p-5"
            >
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Text-only view (simple list)
              </summary>
              <div className="mt-3 text-xs text-slate-600">
                Designed to be easier to scan, copy, or use on low-bandwidth devices.
              </div>

              <TextOnlyList title="Start here" items={CRISIS_START_HERE} />
              <TextOnlyList title="LGBTQ+ youth" items={LGBTQ_YOUTH} />
              <TextOnlyList title="Youth (general)" items={YOUTH_GENERAL} />
              <TextOnlyList title="Domestic violence / sexual assault" items={DV_SA} />
              <TextOnlyList
                title="Substance use (urgent help + navigation)"
                items={SUBSTANCE_CRISIS}
              />
            </details>
          </div>

          {/* Cards view */}
          <PanelSection
            id="start-here"
            title="Start here"
            label="Fastest first door"
            subtitle="If you don’t know where to begin, start with 988."
          >
            {CRISIS_START_HERE.map((r) => (
              <div key={r.name} className="mb-3 break-inside-avoid">
                <SupportResourceCard r={r} />
              </div>
            ))}
          </PanelSection>

          <PanelSection
            id="lgbtq-youth"
            title="LGBTQ+ youth"
            label="Youth-focused"
            subtitle="Crisis and peer support tailored for LGBTQ+ young people."
          >
            {LGBTQ_YOUTH.map((r) => (
              <div key={r.name} className="mb-3 break-inside-avoid">
                <SupportResourceCard r={r} />
              </div>
            ))}
          </PanelSection>

          <PanelSection
            id="youth"
            title="Youth (general)"
            label="Youth-focused"
            subtitle="Resources for kids, teens, and caregivers."
          >
            {YOUTH_GENERAL.map((r) => (
              <div key={r.name} className="mb-3 break-inside-avoid">
                <SupportResourceCard r={r} />
              </div>
            ))}
          </PanelSection>

          <PanelSection
            id="dv-sa"
            title="Domestic violence / sexual assault"
            label="Confidential + safety planning"
            subtitle="Support and advocacy services (device safety may matter)."
          >
            {DV_SA.map((r) => (
              <div key={r.name} className="mb-3 break-inside-avoid">
                <SupportResourceCard r={r} />
              </div>
            ))}
          </PanelSection>

          <PanelSection
            id="substance"
            title="Substance use (urgent help + treatment navigation)"
            label="Navigation"
            subtitle="If you need treatment options quickly, these are strong starting points."
          >
            {SUBSTANCE_CRISIS.map((r) => (
              <div key={r.name} className="mb-3 break-inside-avoid">
                <SupportResourceCard r={r} />
              </div>
            ))}
          </PanelSection>

          <p className="mt-10 text-xs text-slate-500">
            This page is informational and does not replace emergency services or
            professional care. Verify details with each resource.
          </p>
        </div>
      </div>
    </main>
  );
}
