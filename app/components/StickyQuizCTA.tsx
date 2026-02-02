// app/components/StickyQuizCTA.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href?: string;
  abLabels?: [string, string];
  label?: string;
  showAfterPx?: number;
  afterElementId?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryShowAfterPx?: number;
};

function getStickyVariant(): 0 | 1 {
  // Runs only on client (component is "use client"), but still guard for safety.
  if (typeof window === "undefined") return 0;

  try {
    const key = "tf_sticky_quiz_cta_variant_v1";
    const existing = window.localStorage.getItem(key);
    if (existing === "0" || existing === "1") return existing === "0" ? 0 : 1;

    const v: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
    window.localStorage.setItem(key, String(v));
    return v;
  } catch {
    return 0;
  }
}

function isInternalHref(href?: string) {
  if (!href) return false;
  // Treat relative paths like "/quiz" or "/toolkit?x=y" as internal.
  return href.startsWith("/");
}

export function StickyQuizCTA({
  href = "/quiz",
  abLabels = ["Start the quiz", "Continue with the quiz"],
  label,
  showAfterPx = 260,
  afterElementId = "home-hero-end",
  secondaryHref,
  secondaryLabel,
  secondaryShowAfterPx = 1100,
}: Props) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [threshold, setThreshold] = useState<number>(showAfterPx);

  // ✅ Lazy init variant: avoids setState-in-effect lint rule
  const [variant] = useState<0 | 1>(() => getStickyVariant());

  // ✅ Track scrollY so secondary can appear/disappear properly
  const [scrollY, setScrollY] = useState(0);

  const computedLabel = useMemo(() => {
    if (label) return label;
    return abLabels?.[variant] ?? "Start the quiz";
  }, [label, abLabels, variant]);

  // Compute threshold based on hero end marker (preferred)
  useEffect(() => {
    // Don’t show on quiz pages
    if (pathname?.startsWith("/quiz")) return;

    const computeThreshold = () => {
      if (!afterElementId) {
        setThreshold(showAfterPx);
        return;
      }

      const el = document.getElementById(afterElementId);
      if (!el) {
        setThreshold(showAfterPx);
        return;
      }

      const rect = el.getBoundingClientRect();
      const y = window.scrollY || 0;
      const elementBottom = rect.top + y + rect.height;

      setThreshold(Math.round(elementBottom + 12));
    };

    computeThreshold();
    window.addEventListener("resize", computeThreshold);
    return () => window.removeEventListener("resize", computeThreshold);
  }, [pathname, afterElementId, showAfterPx]);

  // Show/hide on scroll + update scrollY
  useEffect(() => {
    if (pathname?.startsWith("/quiz")) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setScrollY(y);
        setVisible(y >= threshold);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, threshold]);

  const showSecondary =
    !!secondaryHref &&
    !!secondaryLabel &&
    scrollY >= (secondaryShowAfterPx ?? 1100);

  if (!visible) return null;

  const SecondaryLink = showSecondary ? (
    isInternalHref(secondaryHref) ? (
      <Link
        href={secondaryHref!}
        className="text-[11px] font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
      >
        {secondaryLabel} →
      </Link>
    ) : (
      <a
        href={secondaryHref}
        className="text-[11px] font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
        target="_blank"
        rel="noreferrer"
      >
        {secondaryLabel} →
      </a>
    )
  ) : null;

  const PrimaryLink = isInternalHref(href) ? (
    <Link
      href={href}
      className="
        inline-flex shrink-0 items-center justify-center
        rounded-2xl bg-slate-900 px-4 py-3
        text-sm font-semibold text-white
        shadow-sm transition
        hover:bg-slate-800
        focus:outline-none focus:ring-2 focus:ring-slate-300
      "
    >
      {computedLabel} →
    </Link>
  ) : (
    <a
      href={href}
      className="
        inline-flex shrink-0 items-center justify-center
        rounded-2xl bg-slate-900 px-4 py-3
        text-sm font-semibold text-white
        shadow-sm transition
        hover:bg-slate-800
        focus:outline-none focus:ring-2 focus:ring-slate-300
      "
      target="_blank"
      rel="noreferrer"
    >
      {computedLabel} →
    </a>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] sm:hidden">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900">
                Main next step
              </div>
              <div className="truncate text-xs text-slate-600">
                Quick quiz → matches → provider outreach
              </div>

              {SecondaryLink ? <div className="mt-1">{SecondaryLink}</div> : null}
            </div>

            {PrimaryLink}
          </div>
        </div>
      </div>
    </div>
  );
}
