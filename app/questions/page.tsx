// app/questions/page.tsx
import React from "react";
import TopTherapyQuestions, { type FaqItem } from "../components/TopTherapyQuestions";
import { ConsultChecklistCard } from "../components/ConsultChecklistCard";

export const metadata = {
  title: "Common Questions About Therapy • Therapy Fit",
  description:
    "Clear answers to common questions about therapy — how therapy works, fit, cost and insurance, and how to take the next step.",
};

const linkCls =
  "underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900";

const chipCls =
  "inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50";

// Optional depth toggle: keeps the page accessible by default.
function OptionalDetails({
  summary = "More details (optional)",
  children,
}: {
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
        {summary}
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-slate-700">{children}</div>
    </details>
  );
}

const FAQ: FaqItem[] = [
  // ========== HOW THERAPY WORKS ==========
  {
    id: "how-therapy-works",
    category: "How therapy works",
    q: "How does therapy work?",
    icon: "🧠",
    a: (
      <>
        <p className="text-sm text-slate-700">
          Therapy is a steady space to understand what’s going on, build support, and try new ways of coping.
        </p>

        <p className="mt-3 text-sm text-slate-700">Most sessions include some mix of:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>noticing patterns (thoughts, feelings, relationships)</li>
          <li>learning tools for stress, emotions, or daily life</li>
          <li>practicing new responses with support</li>
          <li>making sense of experiences at your pace</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          Some therapists are more structured and skills-based. Others are more open and exploratory. Many blend both.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/care-levels" className={chipCls}>
            Levels of care →
          </a>
          <a href="/quiz" className={chipCls}>
            Start the quiz →
          </a>
          <a href="/therapies" className={chipCls}>
            Browse therapy styles →
          </a>
        </div>
      </>
    ),
  },

  {
    id: "where-do-people-start",
    category: "How therapy works",
    q: "Where do people usually start in therapy?",
    icon: "🧭",
    a: (
      <>
        <p className="text-sm text-slate-700">
          Many people start by building steadiness: sleep, stress, overwhelm, mood, and day-to-day coping. Some people
          start by understanding patterns or relationships. Others start with the body (tension, shutdown, panic). Where
          you begin can change over time — and a good therapist helps you find the pace that fits.
        </p>

        <p className="mt-4 text-sm text-slate-700">
          If you want a simple starting point, the{" "}
          <a className={linkCls} href="/quiz">
            quiz
          </a>{" "}
          can help you explore a few therapy styles to try first.
        </p>
      </>
    ),
  },

  // ========== GETTING STARTED ==========
  {
    id: "do-i-need-therapy",
    category: "Getting started",
    q: "How do I know if I need therapy?",
    icon: "🧭",
    a: (
      <>
        <p className="text-sm text-slate-700">
          Therapy can help when something feels hard to carry alone — even if life still looks “fine” from the outside.
        </p>

        <p className="mt-3 text-sm text-slate-700">People often start when they notice:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>the same patterns keep repeating</li>
          <li>stress or anxiety is affecting sleep, focus, or relationships</li>
          <li>they’re functioning, but it feels unsustainable</li>
          <li>something feels off and they want clarity</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          If you want help choosing a starting point, the{" "}
          <a className={linkCls} href="/quiz">
            quiz
          </a>{" "}
          can help you narrow it down.
        </p>
      </>
    ),
  },

  {
    id: "therapy-didnt-help",
    category: "Getting started",
    q: "What if therapy hasn’t helped me before?",
    icon: "💬",
    a: (
      <>
        <p className="text-sm text-slate-700">
          That’s common. Often it means the fit (style, pace, structure) wasn’t right.
        </p>

        <p className="mt-3 text-sm text-slate-700">A mismatch can look like:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>you wanted tools, but sessions stayed vague</li>
          <li>you had strong body symptoms, but therapy stayed talk-only</li>
          <li>you wanted slower pacing, but things moved fast</li>
          <li>you wanted an active therapist, but it felt passive</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          The{" "}
          <a className={linkCls} href="/quiz">
            quiz
          </a>{" "}
          can help you pick a better shortlist, and the{" "}
          <a className={linkCls} href="/therapies">
            therapy styles library
          </a>{" "}
          can help you compare what sessions feel like.
        </p>
      </>
    ),
  },

  // ========== FIT + CHOOSING ==========
  {
    id: "fit-matters",
    category: "Fit & choosing a therapist",
    q: "How important is finding the right fit?",
    icon: "🤝",
    a: (
      <>
        <p className="text-sm text-slate-700">
          Fit matters. The same approach can feel very different depending on the therapist.
        </p>

        <p className="mt-3 text-sm text-slate-700">Fit often looks like:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>feeling respected</li>
          <li>having a shared direction</li>
          <li>being able to ask questions</li>
          <li>pacing that matches your needs</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          If you want help narrowing down your style, start with the{" "}
          <a className={linkCls} href="/quiz">
            quiz
          </a>
          .
        </p>
      </>
    ),
  },

  {
    id: "which-approach-right-for-me",
    category: "Fit & choosing a therapist",
    q: "How do I know which therapy approach is right for me?",
    icon: "🧩",
    a: (
      <>
        <p className="text-sm text-slate-700">Start with what you want help with and how you like to work.</p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Do you want more structure or more space?</li>
          <li>Do you want skills, insight, or both?</li>
          <li>Do you want to focus on now, the past, or a mix?</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          The{" "}
          <a className={linkCls} href="/quiz">
            quiz
          </a>{" "}
          can help you narrow options, then the{" "}
          <a className={linkCls} href="/therapies">
            therapy styles library
          </a>{" "}
          can help you compare what sessions feel like.
        </p>
      </>
    ),
  },

  {
    id: "dont-want-past",
    category: "Starting therapy",
    q: "What if I don’t want to talk about my past?",
    icon: "🧱",
    a: (
      <>
        <p className="text-sm text-slate-700">
          You can start with what’s happening right now: stress, emotions, relationships, coping, and goals.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Many people talk about their past later, after trust and steadiness are stronger.
        </p>

        <p className="mt-4 text-sm text-slate-700">
          <strong>“I want help with what’s happening now. I’m not ready to go into my history yet.”</strong>
        </p>
      </>
    ),
  },

  {
    id: "booking",
    category: "Starting therapy",
    q: "How do I book an appointment?",
    icon: "📅",
    a: (
      <>
        <p className="text-sm text-slate-700">A simple way to start:</p>

        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Choose 2–5 therapists you’d be open to</li>
          <li>Use their website, intake form, or phone call</li>
          <li>Share what you want help with in 1–2 sentences</li>
          <li>Ask about availability and cost</li>
        </ol>

        <p className="mt-4 text-sm text-slate-700">
          Example message: “I’m looking for therapy for stress and relationships and wanted to ask about availability and
          fees.”
        </p>

        <p className="mt-4 text-sm text-slate-700">
          If it helps, you can use your{" "}
          <a className={linkCls} href="/quiz">
            quiz results
          </a>{" "}
          as your starting point.
        </p>
      </>
    ),
  },

  {
    id: "stay-or-switch",
    category: "Fit & choosing a therapist",
    q: "How do I know if I should stay with my therapist or find another?",
    icon: "🔁",
    a: (
      <>
        <p className="text-sm text-slate-700">
          It’s normal for therapy to feel hard sometimes. You should still feel respected and have a sense of direction.
        </p>

        <p className="mt-3 text-sm text-slate-700">Helpful questions to ask:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>“What are we working toward?”</li>
          <li>“What would progress look like soon?”</li>
          <li>“Can we clarify goals together?”</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          If you feel repeatedly dismissed or unsafe, it can make sense to look for a better fit.
        </p>
      </>
    ),
  },

  {
    id: "online-vs-inperson",
    category: "How therapy works",
    q: "Is online therapy as effective as in-person?",
    icon: "🖥️",
    a: (
      <>
        <p className="text-sm text-slate-700">For many people and many concerns, yes. Preferences vary.</p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Online can be easier to schedule and access.</li>
          <li>In-person can feel more grounded and separate from home life.</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">A helpful check: where do you feel more at ease talking right now?</p>
      </>
    ),
  },

  {
    id: "shop-around",
    category: "Fit & choosing a therapist",
    q: "What does it mean to “shop around” for a therapist?",
    icon: "🛍️",
    a: (
      <>
        <p className="text-sm text-slate-700">
          It means talking to more than one therapist before choosing. That’s normal.
        </p>

        <p className="mt-3 text-sm text-slate-700">People often compare:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>who they feel understood by</li>
          <li>who explains things clearly</li>
          <li>who feels collaborative</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          Want a quick checklist for consults? Use the{" "}
          <a className={linkCls} href="/consult-checklist">
            consult checklist
          </a>
          .
        </p>

        <div className="mt-4">
          <ConsultChecklistCard variant="interactive" density="tight" embed />
        </div>
      </>
    ),
  },

  // ========== COST + INSURANCE ==========
  {
    id: "insurance",
    category: "Cost & insurance",
    q: "Therapy costs: what you’ll pay — and how insurance really works",
    icon: "🧾",
    a: (
      <>
        <p className="text-sm text-slate-700">Cost depends on location, provider fees, and your insurance plan.</p>

        <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Two questions to ask</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>
              <strong>Is this provider in-network?</strong>
            </li>
            <li>
              <strong>What will I pay per session?</strong> (copay/coinsurance, deductible rules)
            </li>
          </ul>
        </div>

        <p className="mt-3 text-sm text-slate-700">If it’s confusing, it’s okay to ask for a clear breakdown.</p>

        <OptionalDetails>
          Plans can differ in deductibles, coinsurance, and session limits. Asking a provider’s office for a “good faith
          estimate” or an estimated per-session cost can help you plan.
        </OptionalDetails>

        <p className="mt-4 text-sm font-semibold text-slate-900">Reliable basics</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            <a
              className={linkCls}
              href="https://www.healthcare.gov/coverage/mental-health-substance-abuse-coverage/"
              target="_blank"
              rel="noreferrer"
            >
              Healthcare.gov: mental health coverage
            </a>
          </li>
          <li>
            <a
              className={linkCls}
              href="https://www.medicare.gov/coverage/mental-health-care-outpatient"
              target="_blank"
              rel="noreferrer"
            >
              Medicare: outpatient mental health coverage
            </a>
          </li>
          <li>
            <a
              className={linkCls}
              href="https://www.medicaid.gov/medicaid/benefits/behavioral-health-services/index.html"
              target="_blank"
              rel="noreferrer"
            >
              Medicaid: behavioral health overview
            </a>
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "cant-afford",
    category: "Cost & insurance",
    q: "What if I can’t afford therapy?",
    icon: "💸",
    a: (
      <>
        <p className="text-sm text-slate-700">Many people use lower-cost routes, like:</p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>sliding scale spots</li>
          <li>group therapy</li>
          <li>training clinics (supervised interns)</li>
          <li>community mental health programs</li>
          <li>EAP through work</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          For more support options beyond therapy, visit{" "}
          <a className={linkCls} href="/support">
            Community Support and Services
          </a>
          .
        </p>
      </>
    ),
  },

  {
    id: "no-insurance",
    category: "Cost & insurance",
    q: "What if I don’t have insurance?",
    icon: "🪪",
    a: (
      <>
        <p className="text-sm text-slate-700">
          Many people look for sliding scale providers, group therapy, training clinics, and community-based services.
        </p>

        <p className="mt-4 text-sm text-slate-700">
          The{" "}
          <a className={linkCls} href="/support">
            Community Support and Services
          </a>{" "}
          page can help you find options.
        </p>
      </>
    ),
  },

  // ========== SPECIAL SITUATIONS ==========
  {
    id: "minors",
    category: "Special situations",
    q: "If I’m a minor, do my parents need to know I’m going to therapy?",
    icon: "🧷",
    a: (
      <>
        <p className="text-sm text-slate-700">It depends on location, setting, and insurance.</p>

        <p className="mt-3 text-sm text-slate-700">
          A simple question to ask a clinic is:{" "}
          <strong>“What are your confidentiality rules for minors, and what shows up on insurance paperwork?”</strong>
        </p>

        <OptionalDetails>
          Some states allow minors to consent to therapy in certain situations. Insurance billing can affect what
          information appears on policyholder statements.
        </OptionalDetails>

        <p className="mt-4 text-sm text-slate-700">
          The{" "}
          <a className={linkCls} href="/credentials">
            credentials &amp; training page
          </a>{" "}
          can help you ask the right questions.
        </p>
      </>
    ),
  },

  {
    id: "outside-directory",
    category: "Special situations",
    q: "How can I find a therapist outside of Therapy Fit?",
    icon: "🗺️",
    a: (
      <>
        <p className="text-sm text-slate-700">A wider search can help. People often use:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>their insurance directory</li>
          <li>major directories (filtered by specialty/training)</li>
          <li>referrals from clinicians they trust</li>
          <li>specialty clinics (ERP/exposure-focused, trauma-focused, couples)</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          If cost is the barrier, jump to{" "}
          <a className={linkCls} href="#cant-afford">
            lower-cost options
          </a>
          .
        </p>
      </>
    ),
  },

  {
    id: "friend-family",
    category: "Special situations",
    q: "How can I help a friend or family member consider therapy?",
    icon: "🧑‍🤝‍🧑",
    a: (
      <>
        <p className="text-sm text-slate-700">Care + small steps help most.</p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>say what you notice and why you care</li>
          <li>offer one small next step (one consult call)</li>
          <li>help with logistics or drafting a message</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">Sometimes knowing support is available matters more than moving fast.</p>
      </>
    ),
  },

  {
    id: "tiktok",
    category: "About mental health content online",
    q: "What is TikTok therapy — and why isn’t it listed here?",
    icon: "📱",
    a: (
      <>
        <p className="text-sm text-slate-700">
          “TikTok therapy” is short-form mental health content on social media — quick tips, “signs you have ___,” coping
          hacks, and therapy language. Some creators are trained clinicians; many are not. And even when someone is
          credentialed, short videos can’t assess your full context or safely tailor guidance to you.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Some content can still be helpful: it can give you language for what you’re feeling, introduce coping tools,
          or help you feel less alone. The problem is when content turns into certainty — like diagnosing strangers, or
          making broad claims that “this always means ___.”
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Therapy Fit focuses on tools that help you choose care well: understanding therapy styles, what sessions feel
          like, and how training and scope actually work — so you can make decisions that fit you (not a generic video).
        </p>

        <OptionalDetails summary="A quick way to use content safely (optional)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>
              Treat videos as <strong>ideas</strong>, not conclusions.
            </li>
            <li>
              Be cautious with content that claims certainty, especially diagnosis-style content.
            </li>
            <li>
              If something resonates, bring it to a clinician:{" "}
              <strong>“I saw this concept — can we explore whether it fits my situation?”</strong>
            </li>
            <li>
              If content spikes panic, shame, or spiraling, that’s a sign to pause and step away.
            </li>
          </ul>
        </OptionalDetails>
      </>
    ),
  },

  {
    id: "armchair",
    category: "About mental health content online",
    q: "What is an armchair therapist?",
    icon: "🪑",
    a: (
      <>
        <p className="text-sm text-slate-700">
          An armchair therapist is someone who labels, diagnoses, or interprets another person with high certainty —
          without enough context, consent, or responsibility. This happens online and in real life.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          The issue isn’t curiosity or noticing patterns — it’s the certainty. Helpful support leaves room for nuance,
          questions, and your lived experience.
        </p>

        <OptionalDetails summary="How to tell the difference (optional)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>
              <strong>Helpful:</strong> “This might be a pattern — want to explore it?”
            </li>
            <li>
              <strong>Not helpful:</strong> “You definitely have ___.”
            </li>
            <li>
              <strong>Helpful:</strong> “I could be wrong, but here’s one possibility.”
            </li>
            <li>
              <strong>Not helpful:</strong> using diagnosis language as a weapon, insult, or certainty.
            </li>
          </ul>

          <p className="mt-3 text-sm text-slate-700">
            If something you see online makes you feel boxed in, minimized, or reduced to a label, it can help to pause,
            ground yourself, and check in with a trained clinician who can hold more context.
          </p>
        </OptionalDetails>
      </>
    ),
  },

  // ========== SAFETY ==========
  {
    id: "urgent",
    category: "Safety & urgent help",
    q: "When should I seek urgent help instead of therapy?",
    icon: "◯",
    a: (
      <>
        <p className="text-sm text-slate-700">
          If safety feels urgent, faster support helps — meaning you shouldn’t have to wait days or weeks to get help,
          and you deserve more support than “try to hold on until your next appointment.”
        </p>

        <p className="mt-3 text-sm text-slate-700">
          “Urgent” can look like: feeling at risk of harming yourself or someone else, being unable to keep yourself
          safe, feeling out of control, severe substance-related risk, or not being able to manage basic needs like
          sleep, eating, or daily functioning.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Sometimes the best next step is more support than weekly therapy (IOP/PHP), with more structure and check-ins.
          Other times, the best next step is crisis support right away.
        </p>

        <OptionalDetails summary="What higher support can include (optional)">
          <ul className="list-disc space-y-2 pl-5">
            <li>multiple sessions per week</li>
            <li>group support plus individual support</li>
            <li>more hands-on skill-building and monitoring</li>
            <li>help stabilizing routines (sleep, eating, safety planning)</li>
          </ul>
        </OptionalDetails>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/crisis"
            className="inline-flex items-center justify-center rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Crisis resources →
          </a>
          <a href="/care-levels" className={chipCls}>
            Care levels (IOP vs PHP) →
          </a>
          <a href="/support" className={chipCls}>
            Community support and services →
          </a>
        </div>
      </>
    ),
  },
];

export default function QuestionsPage() {
  return (
    <main className="min-h-screen bg-brand-gradient">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Common Questions About Therapy
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Common Questions About Therapy
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Scan the sections, open what you need, and skip the rest. (You can always come back.)
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/quiz"
              className="
                inline-flex items-center justify-center
                rounded-xl px-5 py-3
                text-sm font-medium
                bg-emerald-500 text-slate-950
                hover:bg-emerald-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500/40
              "
            >
              Start the quiz →
            </a>

            <a href="/therapies" className={chipCls}>
              Browse therapy styles →
            </a>

            <a href="/credentials" className={chipCls}>
              Understanding credentials &amp; training →
            </a>

            <a href="/consult-checklist" className={chipCls}>
              Consult checklist →
            </a>

            <a href="/support" className={chipCls}>
              Community support and services →
            </a>
          </div>

          {/* Decision guides (secondary-but-important) */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white text-lg"
              >
                🧭
              </span>

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">Decision guides</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Quick pages that help you choose a starting point when you feel overwhelmed.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a href="/care-levels" className={chipCls}>
                    Care levels (weekly vs group vs IOP/PHP) →
                  </a>
                  <a href="/consult-checklist" className={chipCls}>
                    Consult checklist →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <TopTherapyQuestions items={FAQ} />
        </div>
      </div>
    </main>
  );
}
