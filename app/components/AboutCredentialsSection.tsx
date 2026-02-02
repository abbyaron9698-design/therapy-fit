// app/components/AboutCredentialsSection.tsx
import React from "react";
import { InfoCard, Callout, BulletList, DividerLabel } from "./InfoSection";

export function AboutCredentialsSection() {
  return (
    <InfoCard title="About training & credentials (plain-language guide)">
      <p>
        Therapist titles can be confusing — especially when you’re just trying to
        get help. Here’s a simple way to understand what different credentials
        usually mean in Illinois.
      </p>

      <Callout title="Important">
        Credentials describe <strong>training and scope</strong>, not “who is
        better.” Many effective therapists have different paths.
      </Callout>

      <DividerLabel>Licensed therapists (state-regulated)</DividerLabel>

      <div className="space-y-3">
        <div>
          <div className="font-semibold text-slate-900">LPC / LCPC</div>
          <div className="mt-1">
            Master’s degree in counseling/psychology. Often trained in CBT, DBT,
            trauma-informed care. <strong>LCPC</strong> typically means more
            supervised post-grad hours completed.
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-900">LCSW</div>
          <div className="mt-1">
            Master’s degree in social work. Trained in therapy and also systems
            (family/community stressors). Often strong at connecting mental
            health + practical barriers.
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-900">LMFT</div>
          <div className="mt-1">
            Master’s degree focused on relationships. Trained for couples,
            families, and relational patterns — and many also see individuals.
          </div>
        </div>
      </div>

      <DividerLabel>Doctoral-level clinicians</DividerLabel>

      <div className="space-y-3">
        <div>
          <div className="font-semibold text-slate-900">PhD / PsyD</div>
          <div className="mt-1">
            Doctoral degree (years of advanced training). Trained in assessment,
            diagnosis, and therapy. Some focus more on testing; others on
            therapy/specialty care.
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-900">
            Prescribing psychologist (rare in Illinois)
          </div>
          <div className="mt-1">
            A doctoral psychologist with extra medical training in limited
            settings. Most medication is prescribed by psychiatrists or primary
            care doctors.
          </div>
        </div>
      </div>

      <DividerLabel>Other mental-health professionals you may see</DividerLabel>

      <div className="space-y-3">
        <div>
          <div className="font-semibold text-slate-900">LCDC</div>
          <div className="mt-1">
            Specialized training in substance use/addiction treatment. Often
            part of treatment teams or recovery programs.
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-900">School counselor</div>
          <div className="mt-1">
            Focused on academic, social, and emotional support in schools. Not
            the same as outpatient therapy, but can be helpful short-term.
          </div>
        </div>
      </div>

      <DividerLabel>License vs certification</DividerLabel>

      <BulletList
        items={[
          <>
            <strong>License:</strong> issued by the state; required to legally
            practice therapy (examples: LPC, LCPC, LCSW, LMFT, PhD/PsyD).
          </>,
          <>
            <strong>Certification:</strong> additional training in a specific
            method; does <em>not</em> replace a license (examples: EMDR, sex
            therapy, eating disorder treatment, specialized trauma methods).
          </>,
        ]}
      />

      <DividerLabel>What is an intern / associate?</DividerLabel>

      <p>
        You may see “intern,” “associate,” or “pre-licensed clinician.” This
        usually means the therapist is completing required supervised hours and
        cannot practice independently.
      </p>

      <BulletList
        items={[
          <>Many are more affordable.</>,
          <>They receive <strong>extra supervision</strong>.</>,
          <>They’re often trained in current, evidence-based approaches.</>,
        ]}
      />

      <Callout tone="neutral" title="You can always ask">
        “Are you licensed?” • “What’s your supervision structure?” • “What’s
        your training in this approach?”
      </Callout>
    </InfoCard>
  );
}
