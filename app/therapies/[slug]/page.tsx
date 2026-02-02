// app/therapies/[slug]/page.tsx
import { THERAPY_PAGES, type TherapyPage } from "../../../lib/therapyData";
import { TherapyDetailTrack } from "../../components/TherapyDetailTrack";

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

type ProviderMeta = {
  whoProvides: string;
  trainingNote?: {
    title: string;
    body: string;
    href?: string;
  };
};

const PROVIDER_META_BY_SLUG: Record<string, ProviderMeta> = {
  cbt: {
    whoProvides:
      "Typically provided by licensed therapists (LPC/LCPC, LCSW, LMFT, PhD/PsyD).",
  },
  dbt: {
    whoProvides:
      "Typically provided by licensed therapists; DBT is often offered as a structured program (group + individual).",
    trainingNote: {
      title: "Training note",
      body:
        "DBT is a specific skills model. It’s okay to ask whether your provider has formal DBT training and whether the program includes skills group, individual therapy, and coaching.",
      href: "/credentials",
    },
  },
  act: {
    whoProvides:
      "Typically provided by licensed therapists (LPC/LCPC, LCSW, LMFT, PhD/PsyD).",
  },
  erp: {
    whoProvides:
      "Typically provided by licensed therapists who specialize in OCD treatment.",
    trainingNote: {
      title: "Training note",
      body:
        "ERP is a specialty approach most associated with OCD. You can ask about OCD-specific experience, how exposures are paced, and how progress is tracked.",
      href: "/credentials",
    },
  },
  emdr: {
    whoProvides:
      "Typically provided by licensed therapists who have completed EMDR training (often with consultation).",
    trainingNote: {
      title: "Training note",
      body:
        "EMDR training levels vary. It’s completely reasonable to ask what EMDR training they completed and whether they receive consultation.",
      href: "/credentials",
    },
  },
  somatic: {
    whoProvides:
      "Typically provided by licensed therapists; training varies widely across “somatic” approaches.",
    trainingNote: {
      title: "Training note",
      body:
        "“Somatic” can mean many things. Ask what specific somatic method they use (and what training they’ve completed), and how they pace body-focused work in a steady, safe way.",
      href: "/credentials",
    },
  },
  se: {
    whoProvides:
      "Often provided by licensed therapists (and sometimes other clinicians) with Somatic Experiencing training.",
    trainingNote: {
      title: "Training note",
      body:
        "SE is a specific training pathway. You can ask whether they’ve completed SE training and how they pace titration/pendulation with your history.",
      href: "/credentials",
    },
  },
  narm: {
    whoProvides:
      "Typically provided by licensed therapists with specialized NARM training.",
    trainingNote: {
      title: "Training note",
      body:
        "NARM is a specific model. Ask whether the provider has formal NARM training and how they integrate nervous-system work with relational patterns.",
      href: "/credentials",
    },
  },
  ifs: {
    whoProvides:
      "Typically provided by licensed therapists; many pursue additional IFS/parts-work training.",
    trainingNote: {
      title: "Training note",
      body:
        "Parts work can be done with different levels of structure. You can ask about training, pacing, and how they support stabilization before deeper work.",
      href: "/credentials",
    },
  },
  "art-therapy": {
    whoProvides:
      "Often provided by credentialed art therapists (pathways vary by state) and other licensed therapists trained in art-based approaches.",
    trainingNote: {
      title: "Training note",
      body:
        "Art therapy is a distinct training pathway in many settings. If credentials matter to you, ask what training they completed and whether they’re an art therapist by training.",
      href: "/credentials",
    },
  },
  "music-therapy": {
    whoProvides:
      "Often provided by credentialed music therapists and other clinicians trained in music-based interventions.",
    trainingNote: {
      title: "Training note",
      body:
        "Music therapy is a distinct field in many settings. Ask about their training and how sessions are structured for your goals.",
      href: "/credentials",
    },
  },
  "dance-movement": {
    whoProvides:
      "Often provided by clinicians with movement-based training (field-specific pathways vary).",
    trainingNote: {
      title: "Training note",
      body:
        "Movement-based therapies are training-dependent. You can ask about training and how they adapt for mobility, pain, sensory needs, or comfort level.",
      href: "/credentials",
    },
  },
  gottman: {
    whoProvides:
      "Provided by licensed therapists; Gottman training varies by level.",
    trainingNote: {
      title: "Training note",
      body:
        "Gottman Method has different training levels. If this matters to you, ask what level they’ve completed and how they structure couples work.",
      href: "/credentials",
    },
  },
  "tf-cbt-cpt": {
    whoProvides:
      "Provided by licensed therapists trained in structured trauma protocols.",
    trainingNote: {
      title: "Training note",
      body:
        "These are structured models. You can ask about training in the specific protocol and how they support stabilization before deeper processing.",
      href: "/credentials",
    },
  },
  "medication-management": {
    whoProvides:
      "Provided by licensed prescribers (psychiatrists/PMHNPs; sometimes primary care).",
    trainingNote: {
      title: "Training note",
      body:
        "Medication management requires a medical prescriber. You can ask how they coordinate with therapy and how side effects and safety are monitored.",
      href: "/credentials",
    },
  },
  tms: {
    whoProvides: "Provided by medical clinics under psychiatric oversight.",
    trainingNote: {
      title: "Training note",
      body:
        "TMS is a medical treatment. Ask about eligibility, what monitoring looks like, and how it’s combined with therapy/support.",
      href: "/credentials",
    },
  },
  ect: {
    whoProvides: "Provided in a medical setting by specialized psychiatric teams.",
    trainingNote: {
      title: "Training note",
      body:
        "ECT is a medical procedure. Decisions should be made with a psychiatrist based on risk/benefit for your situation.",
      href: "/credentials",
    },
  },
  "php-iop": {
    whoProvides:
      "Delivered by multidisciplinary clinical teams (therapists + prescribers + support staff), typically in a program setting.",
  },
  "play-therapy": {
    whoProvides:
      "Often provided by therapists trained in child development and play-based methods; specialized play therapy training may apply.",
    trainingNote: {
      title: "Training note",
      body:
        "Play therapy quality is training-dependent. You can ask about training, caregiver involvement, and how progress is measured.",
      href: "/credentials",
    },
  },
  fbt: {
    whoProvides:
      "Provided by specialized eating-disorder teams; caregiver involvement is central (often for adolescents).",
    trainingNote: {
      title: "Training note",
      body:
        "FBT is a structured eating-disorder treatment. You can ask about ED specialization, safety monitoring, and how caregivers are coached.",
      href: "/credentials",
    },
  },
};

function getProviderMeta(slug: string): ProviderMeta {
  return (
    PROVIDER_META_BY_SLUG[slug] ?? {
      whoProvides:
        "Typically provided by licensed mental health professionals; training and scope can vary by provider and setting.",
    }
  );
}

function getQuestionsToAsk(slug: string): string[] {
  const common = [
    "What does a typical session look like with you?",
    "How will we set goals—and how will we know if things are improving?",
    "If something feels too fast or too intense, how do you adjust pace and support?",
    "How do you tailor this approach to my needs, identity, and preferences?",
  ];

  const bySlug: Record<string, string[]> = {
    dbt: [
      "Is this DBT-informed, or full-model DBT (skills group + individual + coaching)?",
      "How do you support skills practice between sessions without shame or pressure?",
    ],
    erp: [
      "How do you pace exposures collaboratively (so it feels challenging but doable)?",
      "How do you track progress in OCD symptoms and compulsions over time?",
    ],
    emdr: [
      "What EMDR training have you completed, and do you receive consultation?",
      "How do you handle preparation/stabilization before reprocessing?",
    ],
    somatic: [
      "What specific somatic method(s) do you use, and what training have you completed?",
      "How do you keep body-focused work steady and consent-based (especially with trauma history)?",
    ],
    se: [
      "Have you completed SE training, and what level?",
      "How do you use titration/pendulation—and how do you decide the pace?",
    ],
    narm: [
      "What is your training in NARM, and how do you integrate it with nervous-system education?",
      "How do you work with shame/identity patterns in a steady way?",
    ],
    ifs: [
      "What training do you have in IFS or parts work?",
      "How do you support stabilization before deeper unburdening work?",
    ],
    gottman: [
      "What Gottman training level have you completed?",
      "How do you structure couples work (assessment, homework, session flow)?",
    ],
    "tf-cbt-cpt": [
      "Which protocol are you trained in (TF-CBT, CPT), and how closely do you follow it?",
      "How do you support stabilization before deeper processing?",
    ],
    "medication-management": [
      "How do you coordinate with therapy (or a therapist) and monitor side effects?",
      "What’s your follow-up schedule—and what should I do if side effects show up?",
    ],
    tms: [
      "How do you determine eligibility, and what monitoring happens during the course?",
      "How do you combine TMS with therapy/support for best outcomes?",
    ],
    ect: [
      "How do you weigh risks and benefits for my situation, and what monitoring is involved?",
      "What does aftercare/maintenance look like following ECT?",
    ],
    "play-therapy": [
      "How do you involve caregivers—and what does support at home look like?",
      "How do you measure progress in a developmentally appropriate way?",
    ],
    fbt: [
      "How is caregiver coaching structured, and what safety monitoring is included?",
      "How do you support the whole family system without blame?",
    ],
  };

  return [...common, ...(bySlug[slug] ?? [])];
}

function DetailsBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4">
        <span className="text-base font-semibold text-slate-900">{title}</span>
        <span className="text-slate-500">+</span>
      </summary>
      <div className="px-6 pb-6">
        <ul className="mt-1 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export default async function TherapyPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);

  const t: TherapyPage | undefined = THERAPY_PAGES.find((x) => x.slug === slug);

  if (!t) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-3xl border bg-white p-10 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">
              Therapy style not found
            </h1>
            <p className="mt-2 text-slate-600">Try browsing the therapy library.</p>
            <a
              href="/therapies"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to therapy library →
            </a>
          </div>
        </div>
      </main>
    );
  }

  const meta = getProviderMeta(slug);
  const questions = getQuestionsToAsk(slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* analytics hook (client) */}
      <TherapyDetailTrack slug={t.slug} name={t.name} family={t.family} />

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
            {t.family}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            {t.name}
          </h1>

          <p className="mt-3 text-lg text-slate-700">{t.whatItIs}</p>

          <p className="mt-3 text-sm text-slate-600">
            There’s no single “right” therapy—many people benefit from a blend, or a sequence, over time.
            What matters most is a pace that feels steady and supportive.
          </p>

          {/* MAIN NEXT STEP BAND (conversion) */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Main next step
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900">
                  Want to compare this with 1–2 other strong-fit options?
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  Take the quiz to narrow quickly — then use the provider outreach steps.
                </div>
              </div>

              <a
                href="/quiz"
                data-track="therapy_detail_quiz_click"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Take the quiz →
              </a>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              No account. No email. You can retake it anytime.
            </div>
          </div>

          {/* Soft divider before sections */}
          <hr className="my-8 border-slate-200" />

          {/* Who provides + training note */}
          <div className="grid gap-4">
            <section className="rounded-2xl border bg-slate-50 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Who typically provides this?
              </h2>
              <p className="mt-2 text-sm text-slate-700">{meta.whoProvides}</p>
            </section>

            {meta.trainingNote ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h2 className="text-base font-semibold text-slate-900">
                  {meta.trainingNote.title}
                </h2>
                <p className="mt-2 text-sm text-slate-800">{meta.trainingNote.body}</p>
                {meta.trainingNote.href ? (
                  <a
                    href={meta.trainingNote.href}
                    className="mt-3 inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-100"
                  >
                    Learn about credentials & training →
                  </a>
                ) : null}
              </section>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6">
            <section className="rounded-2xl border bg-slate-50 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                What sessions can look like
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {t.whatSessionsLookLike.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Often helpful for
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {t.oftenHelpfulFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border bg-emerald-50 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Good fit if…
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {t.goodFitIf.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border bg-sky-50 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                If this feels hard right now, that’s okay
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                Sometimes the best next step is choosing the right pace and support level first—then building from there.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {t.notIdealIf.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-700">
                If you want help choosing a steady starting point, the quiz can narrow the field fast.
              </p>
            </section>

            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Questions you can bring to a first session
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                You don’t have to ask all of these—pick the ones that would help you feel confident and supported.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </section>

            {t.evidenceNotes?.length ? (
              <DetailsBlock title="Evidence notes" items={t.evidenceNotes} />
            ) : null}

            {t.safetyNotes?.length ? (
              <DetailsBlock title="Safety notes" items={t.safetyNotes} />
            ) : null}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/quiz"
              data-track="therapy_detail_quiz_click"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Take the quiz →
            </a>

            <a
              href="/therapies"
              data-track="therapy_detail_back_to_library_click"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-base font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Back to library
            </a>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-base font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Home
            </a>
          </div>

          <p className="mt-10 text-xs text-slate-500">
            Educational only. Not medical advice. If you’re in immediate danger, call 911 or your local emergency number.
          </p>
        </div>
      </div>

      {/* Tiny script-free tracking for server page CTAs (no refactor needed) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  try {
    document.addEventListener('click', function(e){
      var a = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
      if(!a) return;
      var ev = a.getAttribute('data-track');
      // If your /api/track expects the queued client format, keep this lightweight:
      fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ batch: [{
          event: ev,
          props: { slug: ${JSON.stringify(t.slug)} },
          ts: new Date().toISOString(),
          path: location.pathname + location.search
        }], ts: new Date().toISOString() })
      }).catch(function(){});
    }, { passive: true });
  } catch(e){}
})();`,
        }}
      />
    </main>
  );
}
