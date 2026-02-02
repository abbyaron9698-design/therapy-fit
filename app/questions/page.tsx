// app/questions/page.tsx
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
          <strong>Short answer:</strong> Therapy works differently for different people.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          For many, it helps by offering a steady space to understand patterns, try new ways of coping,
          and practice responding differently — with support instead of doing it all alone.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          You don’t need to know exactly <em>how</em> it will help you before starting.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What therapy often includes</p>
        <p className="mt-2 text-sm text-slate-700">
          Depending on the therapist and approach, sessions might involve:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>noticing patterns in thoughts, emotions, or relationships</li>
          <li>learning practical tools for stress, emotions, or daily life</li>
          <li>practicing new responses in a safe setting</li>
          <li>making sense of experiences at your own pace</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          Some therapists focus more on skills and structure. Others focus more on emotions,
          relationships, or the body. Many blend these over time.
        </p>

        <p className="mt-3 text-sm text-slate-700">There isn’t one “right” way for therapy to look.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If you want a starting point</p>
        <p className="mt-2 text-sm text-slate-700">You don’t need to figure this out on your own.</p>

        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            The{" "}
            <a className={linkCls} href="/quiz">
              quiz
            </a>{" "}
            can help narrow down therapy styles based on how you tend to think, cope, and process.
          </li>
          <li>
            The{" "}
            <a className={linkCls} href="/therapies">
              therapy styles library
            </a>{" "}
            explains what sessions often feel like in real life — not just textbook definitions.
          </li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          If this feels like too much right now, you can come back later.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/quiz" className={chipCls}>
            Take the quiz →
          </a>
          <a href="/therapies" className={chipCls}>
            Browse therapy styles →
          </a>
        </div>
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
          <strong>Short answer:</strong> You don’t have to be “at rock bottom” to consider therapy.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          For many people, therapy becomes useful when something feels persistent, painful,
          or harder to manage alone.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">Common signs people notice</p>
        <p className="mt-2 text-sm text-slate-700">You might consider therapy if:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>you feel stuck in the same patterns</li>
          <li>stress, mood, or anxiety is affecting sleep, focus, or relationships</li>
          <li>you’re functioning, but it doesn’t feel sustainable</li>
          <li>something feels “off,” even if you can’t explain it clearly</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">None of these need to be extreme to matter.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">A gentle rule of thumb</p>
        <p className="mt-2 text-sm text-slate-700">
          If something keeps showing up — and you’ve tried handling it on your own — therapy is a reasonable next step.
          You don’t need a diagnosis or a crisis to start.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If you want help deciding</p>
        <p className="mt-2 text-sm text-slate-700">
          The{" "}
          <a className={linkCls} href="/quiz">
            quiz
          </a>{" "}
          can give you a starting point without overthinking it.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          If this question brings up doubt, that’s common. You can come back to it.
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
          <strong>Short answer:</strong> This is very common — and it usually doesn’t mean therapy “doesn’t work.”
        </p>

        <p className="mt-3 text-sm text-slate-700">
          More often, it means the <strong>fit</strong> wasn’t right.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What mismatch can look like</p>
        <p className="mt-2 text-sm text-slate-700">For example:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>you wanted tools and structure, but sessions stayed open-ended</li>
          <li>you had strong body symptoms, but therapy stayed talk-focused</li>
          <li>you wanted trauma-informed pacing, but things moved too fast</li>
          <li>you wanted a more active therapist, but sessions felt passive</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">These are about <strong>fit</strong>, not failure.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If you want a smarter retry</p>
        <p className="mt-2 text-sm text-slate-700">
          Use{" "}
          <a className={linkCls} href="/quiz">
            the quiz
          </a>{" "}
          to get a better shortlist, then explore options in the{" "}
          <a className={linkCls} href="/therapies">
            therapy styles library
          </a>
          .
        </p>

        <p className="mt-3 text-sm text-slate-700">You’re allowed to be selective this time.</p>
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
          <strong>Short answer:</strong> For many people, fit matters as much as the therapy approach itself.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          The same therapy can feel very different depending on the therapist and how sessions are structured.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">Fit often shows up as:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>feeling respected</li>
          <li>having a shared sense of direction</li>
          <li>being able to ask questions or give feedback</li>
          <li>pacing that matches your needs</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          Comfort isn’t required right away — <strong>safety and collaboration matter more.</strong>
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">A helpful check-in</p>
        <p className="mt-2 text-sm text-slate-700">Instead of asking “Is this perfect?” try:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>“Do I feel safe enough to keep showing up?”</li>
          <li>“Do I understand what we’re working toward?”</li>
          <li>“Can I imagine being more honest over time?”</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">Those answers can change as therapy progresses.</p>

        <p className="mt-4 text-sm text-slate-700">
          If you want help matching to a style (structured vs open-ended, skills vs exploratory), start with{" "}
          <a className={linkCls} href="/quiz">
            the quiz
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> You don’t need therapy jargon to choose well.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Most people find a good fit by noticing what they want help with — and how they tend to process things.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What people often match on</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            <strong>what they want help with</strong> (stress, relationships, trauma, motivation, identity)
          </li>
          <li>
            <strong>how they process</strong> (talking, doing, reflecting, creating)
          </li>
          <li>
            <strong>how structured they want sessions</strong> (tools and homework vs open exploration)
          </li>
        </ul>

        <p className="mt-4 text-sm font-semibold text-slate-900">A helpful reframe</p>
        <p className="mt-2 text-sm text-slate-700">Instead of “What therapy is right?” try:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>“Do I want more structure or more space?”</li>
          <li>“Do I want skills, insight, or both?”</li>
          <li>“Do I want to focus on the present, the past, or a mix?”</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">Those answers can change over time.</p>

        <p className="mt-4 text-sm text-slate-700">
          The fastest way to narrow it down is{" "}
          <a className={linkCls} href="/quiz">
            the quiz
          </a>{" "}
          — then use the{" "}
          <a className={linkCls} href="/therapies">
            therapy styles library
          </a>{" "}
          to understand what sessions often feel like.
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
          <strong>Short answer:</strong> That’s allowed. You don’t have to start with your history for therapy to be helpful.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What therapy can focus on instead</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>coping skills and emotional regulation</li>
          <li>stress, anxiety, or burnout in daily life</li>
          <li>relationship patterns happening now</li>
          <li>practical problem-solving or goals</li>
        </ul>

        <p className="mt-4 text-sm font-semibold text-slate-900">About pacing</p>
        <p className="mt-2 text-sm text-slate-700">
          For many people, talking about the past becomes easier after trust and stability are built.
          A therapist should respect your pace — including if “not yet” is your answer.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If it helps to say it out loud</p>
        <p className="mt-2 text-sm text-slate-700">
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> You don’t need a perfect script or your full story. A few clear steps are enough.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">A simple way to start</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Choose 2–5 therapists you’d be open to</li>
          <li>Use their website, intake form, or phone call</li>
          <li>Share what you want help with in 1–2 sentences</li>
          <li>Ask about availability and cost</li>
        </ol>

        <p className="mt-4 text-sm font-semibold text-slate-900">What to say (brief is fine)</p>
        <p className="mt-2 text-sm text-slate-700">
          “I’m looking for therapy for stress and relationships and wanted to ask about availability and fees.”
        </p>

        <p className="mt-3 text-sm text-slate-700">You don’t need to explain everything up front.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If reaching out feels hard</p>
        <p className="mt-2 text-sm text-slate-700">
          Freezing, procrastinating, or overthinking this step is very common.
          If it helps, use your{" "}
          <a className={linkCls} href="/quiz">
            quiz results
          </a>{" "}
          as a starting point.
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
          <strong>Short answer:</strong> Therapy can be uncomfortable — but you should still feel safe, respected, and oriented.
        </p>

        <p className="mt-3 text-sm text-slate-700">Feeling challenged is different from feeling dismissed or lost.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What growth discomfort often feels like</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>talking about things you usually avoid</li>
          <li>noticing patterns you hadn’t seen before</li>
          <li>feeling emotions more clearly</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          This can feel hard <em>and</em> supportive at the same time.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">Signs it may be worth addressing</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>you feel unclear what therapy is for</li>
          <li>sessions feel repetitive without direction</li>
          <li>you don’t feel able to give feedback</li>
        </ul>

        <p className="mt-4 text-sm font-semibold text-slate-900">When switching makes sense</p>
        <p className="mt-2 text-sm text-slate-700">
          Switching can be reasonable if boundaries are crossed, you feel judged or coerced,
          or your concerns are consistently dismissed.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If you’re unsure</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>“What approach are we using right now?”</li>
          <li>“What would progress look like in a month?”</li>
          <li>“Can we clarify goals together?”</li>
        </ul>
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> For many people and many concerns, yes.
        </p>

        <p className="mt-3 text-sm text-slate-700">Both formats can be effective — and preferences vary.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What online therapy can offer</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>easier scheduling</li>
          <li>no commute</li>
          <li>access from your own space</li>
          <li>more options if local care is limited</li>
        </ul>

        <p className="mt-4 text-sm font-semibold text-slate-900">What in-person therapy can offer</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>a dedicated space away from daily life</li>
          <li>physical presence and shared environment</li>
          <li>fewer distractions for some people</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          It can help to ask: “Where do I feel more at ease talking?” and “What fits my life right now?”
          You’re allowed to change formats later.
        </p>
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
          <strong>Short answer:</strong> It means talking to more than one therapist before deciding.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          That’s normal — and often helpful — especially when you’re investing time, energy, and money.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What this usually looks like</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>scheduling 1–3 consult calls or intakes</li>
          <li>comparing how each therapist communicates</li>
          <li>noticing differences in style, pacing, and clarity</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">You’re not wasting anyone’s time by doing this.</p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What you’re actually comparing</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>who you feel understood by</li>
          <li>who explains things clearly</li>
          <li>who feels collaborative rather than directive</li>
        </ul>

        <p className="mt-4 text-sm text-slate-700">
          If you don’t know what to ask, the{" "}
          <a className={linkCls} href="/credentials">
            credentials &amp; training page
          </a>{" "}
          can help.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Want a quick checklist you can tap through during a consult? Use the{" "}
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> The cost of therapy depends on location, provider fees, and insurance rules.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Insurance can reduce costs — but it varies widely, even within the same company.
        </p>

        <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">The two questions that usually matter most</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>
              <strong>Is this provider in-network with my plan?</strong>
            </li>
            <li>
              <strong>What will I pay per session?</strong> (copay/coinsurance, deductible rules)
            </li>
          </ul>
        </div>

        <p className="mt-3 text-sm text-slate-700">
          If something feels confusing, it’s okay to ask the provider or insurer to explain it again.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">If you want reliable basics</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            <a
              className={linkCls}
              href="https://www.healthcare.gov/coverage/mental-health-substance-abuse-coverage/"
              target="_blank"
              rel="noreferrer"
            >
              Healthcare.gov: mental health &amp; substance use coverage
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
              Medicaid: behavioral health services overview
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> You still have options. Many people find support through lower-cost routes.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">Common ways people reduce cost</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            <strong>Sliding scale</strong>: ask “Do you have sliding-scale spots?”
          </li>
          <li>
            <strong>Group therapy</strong>: often cheaper than individual
          </li>
          <li>
            <strong>Training clinics</strong>: supervised interns; lower fees
          </li>
          <li>
            <strong>Community mental health</strong>: income-based programs
          </li>
          <li>
            <strong>EAP</strong> through work: short-term counseling + referrals
          </li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          Needing affordable care is not a personal failure. Access barriers are common — and navigating them takes effort.
        </p>

        <p className="mt-4 text-sm text-slate-700">
          For more routes beyond therapy, visit{" "}
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
          <strong>Short answer:</strong> You can still access care — but focusing on lower-cost options often helps.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          People without insurance often look for sliding-scale providers, group therapy, training clinics,
          and community-based services.
        </p>

        <p className="mt-4 text-sm text-slate-700">
          The{" "}
          <a className={linkCls} href="/support">
            Community Support and Services
          </a>{" "}
          page can also help you find non-therapy supports that still make a meaningful difference.
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> It depends. Rules vary by location, setting, and insurance.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Confidentiality for minors can depend on state laws, whether therapy is through a school or clinic,
          and how insurance billing works.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">A practical step</p>
        <p className="mt-2 text-sm text-slate-700">
          You can ask a clinic directly:{" "}
          <strong>“What are your confidentiality rules for minors, and what appears on insurance paperwork?”</strong>
        </p>

        <p className="mt-3 text-sm text-slate-700">
          If you’re choosing a provider, the{" "}
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> Sometimes it helps to widen the search. Therapy Fit is growing — and other tools can complement it.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">Places people often look</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>your insurance directory (if you have coverage)</li>
          <li>major directories (filter carefully by specialty/training)</li>
          <li>referrals from clinicians you trust</li>
          <li>specialty clinics (trauma, OCD/ERP, couples methods)</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
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
        <p className="text-sm text-slate-700">
          <strong>Short answer:</strong> You can’t force someone — but you can make it easier.
        </p>

        <p className="mt-4 text-sm font-semibold text-slate-900">What often helps</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>express care without pressure</li>
          <li>offer a small next step (“one consult call”)</li>
          <li>help with logistics or drafting a message</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          It’s okay if they’re not ready yet. Sometimes knowing support is available matters more than immediate action.
        </p>
      </>
    ),
  },

  {
    id: "tiktok",
    category: "About mental health content online",
    q: "What is TikTok therapy — and why isn’t it listed here?",
    icon: "📱",
    // --- TikTok therapy ---
a: (
  <>
    <p className="text-sm text-slate-700">
      TikTok therapy is short-form mental health content (videos, tips, “signs you have ___,” coping hacks)
      shared on social media — often by creators who may or may not be clinically trained.
    </p>

    <p className="mt-3 text-sm text-slate-700">
      Some content can be validating or give people language for their experience. But it can also oversimplify,
      encourage self-diagnosis, or present “one-size-fits-all” advice without context. Therapy Fit focuses on
      information that helps you choose care responsibly (approaches, what sessions feel like, and how to evaluate training).
    </p>
  </>
),

  },

  {
    id: "armchair",
    category: "About mental health content online",
    q: "What is an armchair therapist?",
    icon: "🪑",
    // --- Armchair therapist ---
a: (
  <>
    <p className="text-sm text-slate-700">
      An armchair therapist is someone who gives confident “clinical” judgments about others — diagnosing,
      labeling, or interpreting behavior — without real context, consent, or accountability.
    </p>

    <p className="mt-3 text-sm text-slate-700">
      The issue isn’t curiosity — it’s certainty. Real therapy involves training, ethics, and responsibility
      for harm: privacy, informed consent, scope of practice, and a relationship where the person can disagree,
      ask questions, and set boundaries.
    </p>
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
          <strong>Short answer:</strong> Therapy is ongoing care — not emergency care.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          If safety feels like an immediate concern, you deserve faster support than a weekly session cadence.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Sometimes the right next step isn’t emergency care — but a{" "}
          <strong>higher level of support</strong> than weekly therapy.
        </p>

        <p className="mt-3 text-sm text-slate-700">
          Programs like <strong>Intensive Outpatient (IOP)</strong> or{" "}
          <strong>Partial Hospitalization (PHP)</strong> offer more structure and frequency while still letting you live
          at home.
        </p>

        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>multiple sessions per week</li>
          <li>group + individual support</li>
          <li>more hands-on skill-building and monitoring</li>
        </ul>

        <p className="mt-3 text-sm text-slate-700">
          These can be a good fit if symptoms feel overwhelming between sessions — even if you’re not in immediate danger.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/crisis"
            className="inline-flex items-center justify-center rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Crisis resources →
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
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm btn-brand"
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

          <TopTherapyQuestions items={FAQ} />
        </div>
      </div>
    </main>
  );
}
