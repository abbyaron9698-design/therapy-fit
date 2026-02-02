// app/toolkit/components/ToolkitPricingSection.tsx
"use client";

import * as React from "react";
import PWYCPriceCard from "./PWYCPriceCard";

function CalmList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

export default function ToolkitPricingSection() {
  function goToCheckout(amount: number) {
    window.location.href = `/checkout?product=toolkit&amount=${encodeURIComponent(
      String(amount)
    )}`;
  }

  return (
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

      <PWYCPriceCard
        title="Therapy Decision Toolkit"
        subtitle="One-page toolkit + scripts you can reuse."
        presets={[
          { label: "$0", value: 0, helper: "Free access" },
          { label: "$5", value: 5, helper: "Low budget" }, // ✅ changed from $9
          { label: "$10", value: 10, helper: "Standard" },
          { label: "$20", value: 20, helper: "Sponsor access" },
        ]}
        defaultValue={19}
        ctaLabel="Continue →"
        onContinue={goToCheckout}
      />
    </div>
  );
}
