// app/toolkit/components/ToolkitPricingClient.tsx
"use client";

import * as React from "react";
import PWYCPriceCard from "./PWYCPriceCard";
import { track } from "../../../lib/analytics";

type Props = {
  focus?: string;
  profileLabel?: string;
  src?: string;
};

type Attrib = {
  product: "toolkit";
  src: string;
  focus?: string;
  profile?: string;
  amount?: number;
  utm?: Partial<
    Record<
      "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content",
      string
    >
  >;
  ts: string;
};

function pickUtmFromLocation(): Attrib["utm"] {
  try {
    const sp = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
    const utm: Attrib["utm"] = {};
    for (const k of keys) {
      const v = sp.get(k);
      if (v) utm[k] = v.slice(0, 120);
    }
    return Object.keys(utm).length ? utm : undefined;
  } catch {
    return undefined;
  }
}

function writeAttrib(partial: Partial<Attrib>) {
  try {
    const existingRaw = sessionStorage.getItem("tf_attrib");
    const existing = existingRaw ? (JSON.parse(existingRaw) as Partial<Attrib>) : {};
    const next: Partial<Attrib> = {
      ...existing,
      ...partial,
      ts: new Date().toISOString(),
    };
    sessionStorage.setItem("tf_attrib", JSON.stringify(next));
  } catch {
    // no-op
  }
}

export function ToolkitPricingClient({ focus, profileLabel, src = "toolkit_page" }: Props) {
  React.useEffect(() => {
    const utm = pickUtmFromLocation();

    track("toolkit_pricing_view", {
      src,
      focus: focus ?? null,
      profileLabel: profileLabel ?? null,
      hasUtm: Boolean(utm),
    });

    writeAttrib({
      product: "toolkit",
      src,
      focus: focus ?? undefined,
      profile: profileLabel ?? undefined,
      utm,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PWYCPriceCard
      title="Therapy Decision Toolkit"
      subtitle="One-page toolkit + scripts you can reuse."
      presets={[
        { label: "$0", value: 0, helper: "Free access" },
        { label: "$5", value: 5, helper: "Student / low budget" }, // ✅ changed
        { label: "$19", value: 19, helper: "Standard" },
        { label: "$49", value: 49, helper: "Sponsor access" },
      ]}
      defaultValue={19}
      ctaLabel="Continue →"
      onSelect={(amount, mode) => {
        // optional, low-noise: track only when they meaningfully choose
        track("toolkit_pricing_select_amount", {
          src,
          amount,
          mode,
        });
        writeAttrib({ amount });
      }}
      onContinue={(amount: number) => {
        track("toolkit_pricing_continue", {
          src,
          amount,
          focus: focus ?? null,
          profileLabel: profileLabel ?? null,
        });

        writeAttrib({ amount });

        const q = new URLSearchParams();
        q.set("product", "toolkit");
        q.set("amount", String(amount));
        if (focus) q.set("focus", focus);
        if (profileLabel) q.set("profile", profileLabel);
        if (src) q.set("src", src);

        window.location.href = `/checkout?${q.toString()}`;
      }}
    />
  );
}

export default ToolkitPricingClient;
