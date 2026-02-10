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

  // ✅ Never show sticky CTA on quiz flow OR results pages
  const hideOnThisRoute =
    !!pathname &&
    (pathname.startsWith("/quiz") || pathname === "/results" || pathname.startsWith("/results/"));

  const [visible, setVisible] = useState(false);
  const [threshold, setThreshold] = useState<number>(showAfterPx);
  const [variant] = useState<0 | 1>(() => getStickyVariant());
  const [scrollY, setScrollY] = useState(0);

  const computedLabel = useMemo(() => {
    if (label) return label;
    return abLabels?.[variant] ?? "Start the quiz";
  }, [label, abLabels, variant]);

  // ✅ Reset state on route changes so it can't "carry over" into /results
  useEffect(() => {
    setVisible(false);
    setScrollY(0);
  }, [pathname]);

  useEffect(() => {
    if (hideOnThisRoute) return;

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
  }, [hideOnThisRoute, afterElementId, showAfterPx]);

  useEffect(() => {
    if (hideOnThisRoute) return;

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
  }, [hideOnThisRoute, threshold]);

  if (hideOnThisRoute) return null;
  if (!visible) return null;

  const showSecondary =
    !!secondaryHref && !!secondaryLabel && scrollY >= (secondaryShowAfterPx ?? 1100);

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

  const primaryClass =
    "inline-flex shrink-0 items-center justify-center rounded-2xl " +
    "bg-emerald-700 px-4 py-3 text-sm font-semibold text-white " +
    "border border-emerald-700 shadow-sm transition " +
    "hover:bg-emerald-800 hover:border-emerald-800 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-300";

  const PrimaryLink = isInternalHref(href) ? (
    <Link href={href} className={primaryClass}>
      {computedLabel} →
    </Link>
  ) : (
    <a href={href} className={primaryClass} target="_blank" rel="noreferrer">
      {computedLabel} →
    </a>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] sm:hidden">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900">Main next step</div>
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
