// app/toolkit/components/ToolkitCheckoutCard.tsx
"use client";

import * as React from "react";
import PWYCPriceCard from "./PWYCPriceCard";

export function ToolkitCheckoutCard({
  title = "Therapy Decision Toolkit",
  subtitle = "One-page toolkit + scripts you can reuse.",
  presets = [
    { label: "$0", value: 0, helper: "Free access" },
    { label: "$5", value: 5, helper: "Low budget" },
    { label: "$10", value: 10, helper: "Standard" },
    { label: "$20", value: 20, helper: "Sponsor access" },
  ],
  defaultValue = 19,
  focus,
  profileLabel,
  source,
}: {
  title?: string;
  subtitle?: string;
  presets?: Array<{ label: string; value: number; helper?: string }>;
  defaultValue?: number;
  focus?: string;
  profileLabel?: string;
  source?: string;
}) {
  function buildCheckoutHref(amount: number) {
    const params = new URLSearchParams();
    params.set("product", "toolkit");
    params.set("amount", String(amount));
    if (focus) params.set("focus", focus);
    if (profileLabel) params.set("profile", profileLabel);
    if (source) params.set("src", source);
    return `/checkout?${params.toString()}`;
  }

  return (
    <PWYCPriceCard
      title={title}
      subtitle={subtitle}
      presets={presets}
      defaultValue={defaultValue}
      ctaLabel="Continue →"
      onContinue={(amount: number) => {
        window.location.href = buildCheckoutHref(amount);
      }}
    />
  );
}
