// app/components/CredentialsExplorer.tsx
"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TabId =
  | "licensed"
  | "prescribers"
  | "creative"
  | "substance"
  | "other"
  | "training";

type Tab = { id: TabId; label: string; hint: string };

const TABS: Tab[] = [
  { id: "licensed", label: "Licensed therapy", hint: "Talk therapy roles" },
  { id: "prescribers", label: "Prescribers", hint: "Medication roles" },
  { id: "creative", label: "Expressive therapies", hint: "Art/music/drama/dance" },
  { id: "substance", label: "Substance use", hint: "Addictions credentials" },
  { id: "other", label: "Other supports", hint: "OT/SLP/BCBA/peer" },
  { id: "training", label: "Training roles", hint: "Supervised roles" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </div>
  );
}

function Card({
  title,
  icon,
  children,
  muted,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-100 bg-white p-6 shadow-sm",
        muted && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-base text-slate-700 shadow-sm"
            aria-hidden="true"
          >
            {icon}
          </div>
        ) : null}

        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function WhereYoullSeeThis({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm">
      <Eyebrow>Find these in the real world</Eyebrow>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{children}</p>
    </div>
  );
}

/** --- Search helpers --- */
function normalize(s: string) {
  return s.toLowerCase().trim();
}

function scoreMatch(query: string, haystack: string) {
  const q = normalize(query);
  const h = normalize(haystack);
  if (!q) return 0;
  if (h.includes(q)) return 3;

  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of tokens) if (h.includes(t)) score += 1;
  return score;
}

type SearchableItem = {
  tab: TabId;
  title: string;
  keywords: string[];
};

const INDEX: SearchableItem[] = [
  // licensed
  {
    tab: "licensed",
    title: "LPC / LCPC (Counselor)",
    keywords: [
      "lpc",
      "lcpc",
      "counselor",
      "licensed professional counselor",
      "clinical professional counselor",
    ],
  },
  {
    tab: "licensed",
    title: "LCSW (Clinical Social Worker)",
    keywords: ["lcsw", "social worker", "clinical social worker", "msw"],
  },
  {
    tab: "licensed",
    title: "LMFT (Marriage & Family Therapist)",
    keywords: ["lmft", "marriage", "family therapist", "mft"],
  },
  {
    tab: "licensed",
    title: "Psychologist (PhD / PsyD)",
    keywords: ["psychologist", "phd", "psyd", "testing", "assessment", "neuropsych"],
  },

  // prescribers
  {
    tab: "prescribers",
    title: "Psychiatrist (MD / DO)",
    keywords: ["psychiatrist", "md", "do", "medication", "med management"],
  },
  {
    tab: "prescribers",
    title: "Psychiatric Nurse Practitioner (PMHNP)",
    keywords: ["pmhnp", "nurse practitioner", "np", "psychiatric np", "medication"],
  },
  {
    tab: "prescribers",
    title: "Prescribing psychologist",
    keywords: ["prescribing psychologist", "rxp", "psychopharmacology"],
  },
  {
    tab: "prescribers",
    title: "Expressive therapies (paired)",
    keywords: [
      "art therapy",
      "music therapy",
      "drama therapy",
      "dance movement therapy",
      "expressive therapies",
    ],
  },

  // creative
  {
    tab: "creative",
    title: "Art Therapist (ATR / ATR-BC)",
    keywords: ["atr", "atr-bc", "art therapist", "art therapy"],
  },
  {
    tab: "creative",
    title: "Music Therapist (MT-BC)",
    keywords: ["mt-bc", "music therapist", "music therapy"],
  },
  { tab: "creative", title: "Drama Therapist (RDT)", keywords: ["rdt", "drama therapist", "drama therapy"] },
  {
    tab: "creative",
    title: "Dance/Movement Therapist (BC-DMT)",
    keywords: ["bc-dmt", "dance movement", "dmt", "dance therapist"],
  },
  {
    tab: "creative",
    title: "Expressive Arts Therapist",
    keywords: ["expressive arts", "expressive arts therapist", "intermodal", "creative arts therapy"],
  },
  { tab: "creative", title: "Poetry/Bibliotherapy", keywords: ["poetry therapy", "bibliotherapy", "writing therapy"] },

  // substance
  {
    tab: "substance",
    title: "Substance use credentials (LCDC/LADC/CADC…)",
    keywords: ["lcdc", "ladc", "cadc", "caadc", "licdc", "mac", "substance use", "addiction"],
  },

  // other
  {
    tab: "other",
    title: "Occupational therapist (OTR/L)",
    keywords: ["ot", "otr", "occupational therapist", "sensory", "routines"],
  },
  {
    tab: "other",
    title: "Speech-language pathologist (CCC-SLP)",
    keywords: ["slp", "ccc-slp", "speech therapist", "speech-language"],
  },
  { tab: "other", title: "Board Certified Behavior Analyst (BCBA)", keywords: ["bcba", "aba", "behavior analyst"] },
  { tab: "other", title: "Peer support specialist", keywords: ["peer support", "peer specialist"] },
  { tab: "other", title: "Case manager / care coordinator", keywords: ["case manager", "care coordinator", "resources", "referrals"] },

  // training
  {
    tab: "training",
    title: "Intern / pre-licensed clinician",
    keywords: ["intern", "pre-licensed", "associate", "resident", "supervised"],
  },
  { tab: "training", title: "School counselor", keywords: ["school counselor", "school counseling"] },
];

function bestTabForQuery(q: string): TabId | null {
  const query = normalize(q);
  if (!query) return null;

  const totals: Record<TabId, number> = {
    licensed: 0,
    prescribers: 0,
    creative: 0,
    substance: 0,
    other: 0,
    training: 0,
  };

  for (const item of INDEX) {
    const h = [item.title, ...item.keywords].join(" ");
    totals[item.tab] += scoreMatch(query, h);
  }

  // ✅ Use a loop (not forEach mutation) so TS narrows cleanly
  const tabs = Object.keys(totals) as TabId[];
  let bestTab: TabId | null = null;
  let bestScore = 0;

  for (const t of tabs) {
    const s = totals[t];
    if (s > bestScore) {
      bestScore = s;
      bestTab = t;
    }
  }

  if (!bestTab || bestScore === 0) return null;
  return bestTab;
}

function Tabs({
  tab,
  setTab,
  query,
  resultNote,
}: {
  tab: TabId;
  setTab: React.Dispatch<React.SetStateAction<TabId>>;
  query: string;
  resultNote?: string;
}) {
  const active = TABS.find((t) => t.id === tab);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
      <Eyebrow>Explorer</Eyebrow>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        Select and click on a category below to begin browsing.
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-sm font-medium transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200",
                  isActive
                    ? "border-slate-200 bg-white text-slate-900 shadow-sm"
                    : "border-transparent bg-transparent text-slate-700 hover:bg-white hover:shadow-sm"
                )}
                aria-pressed={isActive}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600">
        Showing: <strong>{active?.label}</strong> — {active?.hint}
      </p>

      {query.trim() ? (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 shadow-sm">
          <p className="text-xs leading-relaxed text-slate-700">
            Searching for: <strong>{query.trim()}</strong>
            {resultNote ? <span className="text-slate-600"> — {resultNote}</span> : null}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function CredentialsExplorer({ query = "" }: { query?: string }) {
  const [tab, setTab] = React.useState<TabId>("licensed");

  React.useEffect(() => {
    const best = bestTabForQuery(query);
    if (best) setTab(best);
  }, [query]);

  const q = normalize(query);

  function matches(title: string, extra: string[] = []) {
    if (!q) return true;
    const h = normalize([title, ...extra].join(" "));
    return scoreMatch(q, h) > 0;
  }

  const resultNote = React.useMemo(() => {
    if (!q) return undefined;
    const count = INDEX.filter((x) => x.tab === tab).filter((x) =>
      matches(x.title, x.keywords)
    ).length;

    if (count === 0) return "No matches in this tab (try a shorter term).";
    if (count === 1) return "1 match in this tab.";
    return `${count} matches in this tab.`;
  }, [q, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-4 space-y-5">
      <Tabs tab={tab} setTab={setTab} query={query} resultNote={resultNote} />

      <div className="space-y-5">
        {tab === "licensed" && (
          <>
            <WhereYoullSeeThis>
              Private practice, group practices, clinics, schools/universities, and community mental health.
            </WhereYoullSeeThis>

            <div className="grid gap-5 sm:grid-cols-2">
              {matches("LPC / LCPC (Counselor)", ["lpc", "lcpc", "counselor"]) && (
                <Card icon="🧠" title="LPC / LCPC (Counselor)">
                  <p>
                    <strong>Schooling:</strong> <strong>Master’s</strong> or higher.
                  </p>
                  <p className="mt-2">
                    Provides psychotherapy and treatment planning. Diagnosis and assessment scope varies by role and state.
                  </p>
                </Card>
              )}

              {matches("LCSW (Clinical Social Worker)", ["lcsw", "msw"]) && (
                <Card icon="🧩" title="LCSW (Clinical Social Worker)">
                  <p>
                    <strong>Schooling:</strong> <strong>MSW</strong>.
                  </p>
                  <p className="mt-2">
                    Psychotherapy + systems/resource lens; many practice similarly to counselors in therapy settings.
                  </p>
                </Card>
              )}

              {matches("LMFT (Marriage & Family Therapist)", ["lmft", "mft"]) && (
                <Card icon="🤝" title="LMFT (Marriage & Family Therapist)">
                  <p>
                    <strong>Schooling:</strong> <strong>Master’s</strong> or higher.
                  </p>
                  <p className="mt-2">Specializes in relationships/family systems (also treats individuals).</p>
                </Card>
              )}

              {matches("Psychologist (PhD / PsyD)", ["psychologist", "phd", "psyd", "testing"]) && (
                <Card icon="🧪" title="Psychologist (PhD / PsyD)">
                  <p>
                    <strong>Schooling:</strong> <strong>Doctorate</strong>.
                  </p>
                  <p className="mt-2">
                    Psychotherapy + deeper assessment/testing training (often); some provide formal testing/assessment.
                  </p>
                </Card>
              )}

              {q &&
              INDEX.filter((x) => x.tab === "licensed").filter((x) =>
                matches(x.title, x.keywords)
              ).length === 0 ? (
                <Card title="No matches in Licensed therapy" icon="🫧" muted>
                  Try searching a shorter term like <strong>LCSW</strong>, <strong>LMFT</strong>, or <strong>PhD</strong> — or switch tabs above.
                </Card>
              ) : null}
            </div>
          </>
        )}

        {tab === "prescribers" && (
          <>
            <WhereYoullSeeThis>
              Outpatient psychiatry clinics, hospitals, integrated primary care, and specialty clinics.
            </WhereYoullSeeThis>

            <div className="grid gap-5 sm:grid-cols-2">
              {matches("Psychiatrist (MD / DO)", ["psychiatrist", "md", "do"]) && (
                <Card icon="💊" title="Psychiatrist (MD / DO)">
                  <p>
                    <strong>Schooling:</strong> <strong>Medical school + residency</strong>.
                  </p>
                  <p className="mt-2">Medication management and psychiatric care; psychotherapy varies by clinician.</p>
                </Card>
              )}

              {matches("Psychiatric Nurse Practitioner (PMHNP)", ["pmhnp", "np"]) && (
                <Card icon="🩺" title="Psychiatric Nurse Practitioner (PMHNP)">
                  <p>
                    <strong>Schooling:</strong> <strong>Master’s/Doctorate in Nursing</strong> + psychiatric specialization.
                  </p>
                  <p className="mt-2">Medication management; some also provide therapy (varies).</p>
                </Card>
              )}

              {matches("Prescribing psychologist", ["prescribing psychologist", "rxp"]) && (
                <Card icon="🧾" title="Prescribing psychologist">
                  <p>
                    <strong>Schooling:</strong> <strong>Doctorate</strong> + additional psychopharmacology training (rules vary).
                  </p>
                  <p className="mt-2">Not available everywhere. Verify what prescribing authority means in your location.</p>
                </Card>
              )}

              {matches("Expressive therapies (not prescribers — but often paired)", [
                "art therapy",
                "music therapy",
                "drama therapy",
                "dance movement",
              ]) && (
                <Card icon="🎨" title="Expressive therapies (not prescribers — but often paired)">
                  <p>
                    Many people do medication management with a prescriber and psychotherapy with an expressive therapist
                    (art/music/drama/dance). If you see both on a team, it’s usually a collaborative model.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    If someone claims both roles, ask what license they practice under for each service.
                  </p>
                </Card>
              )}

              {matches("Psychiatric PA / Primary care (MD/DO/NP)", ["pa", "primary care"]) && (
                <Card icon="🏥" title="Psychiatric PA / Primary care (MD/DO/NP)">
                  Medication support and referrals; scope depends on the setting and clinician.
                </Card>
              )}

              {q &&
              INDEX.filter((x) => x.tab === "prescribers").filter((x) =>
                matches(x.title, x.keywords)
              ).length === 0 ? (
                <Card title="No matches in Prescribers" icon="🫧" muted>
                  Try <strong>PMHNP</strong>, <strong>psychiatrist</strong>, <strong>MD</strong>, or <strong>medication</strong>.
                </Card>
              ) : null}
            </div>
          </>
        )}

        {tab === "creative" && (
          <>
            <WhereYoullSeeThis>
              Hospitals, schools, rehab programs, community mental health, specialty clinics, and group programs.
            </WhereYoullSeeThis>

            <div className="grid gap-5">
              {matches("Expressive & creative arts therapies", [
                "atr",
                "atr-bc",
                "mt-bc",
                "rdt",
                "bc-dmt",
                "expressive",
              ]) && (
                <Card icon="🎨" title="Expressive & creative arts therapies">
                  <p>
                    <strong>Schooling:</strong> often a <strong>Master’s</strong> in the specific discipline (varies).
                  </p>

                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      <strong>Art Therapist</strong>: ATR / ATR-BC (U.S.; varies by role/state)
                    </li>
                    <li>
                      <strong>Music Therapist</strong>: MT-BC (U.S.)
                    </li>
                    <li>
                      <strong>Drama Therapist</strong>: RDT (U.S.)
                    </li>
                    <li>
                      <strong>Dance/Movement Therapist</strong>: BC-DMT (U.S.)
                    </li>
                    <li>
                      <strong>Expressive Arts Therapist</strong> (varies): verify primary license + training pathway
                    </li>
                    <li>
                      <strong>Poetry/Bibliotherapy</strong> (varies): often a specialization within another profession
                    </li>
                  </ul>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    Some creative arts therapists are also independently licensed clinicians (LCPC/LCSW/LMFT). Ask what their{" "}
                    <strong>primary license</strong> is (if any) and what scope they practice under.
                  </p>
                </Card>
              )}
            </div>
          </>
        )}

        {tab === "substance" && (
          <>
            <WhereYoullSeeThis>
              Addiction programs, rehab, community clinics, detox/residential, and integrated behavioral health.
            </WhereYoullSeeThis>

            <div className="grid gap-5">
              {matches("Substance use credentials (LCDC, LADC, CADC, etc.)", ["lcdc", "ladc", "cadc", "mac"]) && (
                <Card icon="🧷" title="Substance use credentials (LCDC, LADC, CADC, etc.)">
                  <p>
                    <strong>Schooling:</strong> varies widely by credential and by state.
                  </p>
                  <p className="mt-2">
                    Indicates substance-use specialization. Confirm scope, supervision rules, and whether they can provide psychotherapy independently where you live.
                  </p>

                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>
                      Examples you may see: <strong>LCDC</strong>, <strong>LADC</strong>, <strong>CADC</strong>, <strong>CAADC</strong>,{" "}
                      <strong>LICDC</strong>, <strong>MAC</strong> (titles vary)
                    </li>
                    <li>May be held alongside another license (LCPC/LCSW/LMFT) or as a standalone addiction credential</li>
                  </ul>
                </Card>
              )}
            </div>
          </>
        )}

        {tab === "other" && (
          <>
            <WhereYoullSeeThis>
              Schools, hospitals, autism/ADHD clinics, rehab, community programs, and team-based care.
            </WhereYoullSeeThis>

            <div className="grid gap-5 sm:grid-cols-2">
              {matches("Occupational therapist (OTR/L)", ["ot", "otr", "occupational"]) && (
                <Card icon="🧠" title="Occupational therapist (OTR/L)">
                  Functional skills, sensory processing, and routines (often valuable for anxiety/ADHD/autism support).
                </Card>
              )}

              {matches("Speech-language pathologist (CCC-SLP)", ["slp", "ccc-slp"]) && (
                <Card icon="🗣️" title="Speech-language pathologist (CCC-SLP)">
                  Communication, social pragmatics, and feeding/swallowing (can overlap with neurodiversity support).
                </Card>
              )}

              {matches("Board Certified Behavior Analyst (BCBA)", ["bcba", "aba"]) && (
                <Card icon="📈" title="Board Certified Behavior Analyst (BCBA)">
                  Behavior assessment + behavior plans (often in autism services). Ask about approach and values-fit.
                </Card>
              )}

              {matches("Case manager / care coordinator", ["case manager", "care coordinator"]) && (
                <Card icon="🧭" title="Case manager / care coordinator">
                  Systems navigation: resources, referrals, scheduling, benefits, and care coordination.
                </Card>
              )}

              {matches("Peer support specialist", ["peer support", "peer specialist"]) && (
                <Card icon="🫶" title="Peer support specialist">
                  Lived-experience support (not psychotherapy). Can be powerful alongside therapy.
                </Card>
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              Titles and scope vary by region. When in doubt, ask: “What license do you practice under?” and “What’s your scope in this setting?”
            </p>
          </>
        )}

        {tab === "training" && (
          <>
            <WhereYoullSeeThis>
              Training clinics, hospitals, schools/universities, community mental health, and practicum sites.
            </WhereYoullSeeThis>

            <div className="grid gap-5 sm:grid-cols-2">
              {matches("Intern / pre-licensed clinician", ["intern", "pre-licensed", "associate"]) && (
                <Card icon="🎓" title="Intern / pre-licensed clinician">
                  <p>
                    <strong>Schooling:</strong> in or recently completed a qualifying graduate program (often <strong>Master’s</strong>).
                  </p>
                  <p className="mt-2">Practicing under supervision while completing required hours.</p>
                </Card>
              )}

              {matches("School counselor", ["school counselor"]) && (
                <Card icon="🏫" title="School counselor">
                  <p>
                    <strong>Schooling:</strong> typically a <strong>Master’s</strong>.
                  </p>
                  <p className="mt-2">School setting support; scope differs from outpatient psychotherapy.</p>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
