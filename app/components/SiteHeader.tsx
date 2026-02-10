// app/components/SiteHeader.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function isActivePath(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href + "/")) return true;
  return false;
}

function NavLink({
  href,
  icon,
  children,
  className = "",
  iconClassName = "",
  activeClassName = "",
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  activeClassName?: string;
}) {
  const pathname = usePathname() || "/";
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium",
        "transition whitespace-nowrap",
        active
          ? activeClassName ||
            "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          : [
              "hover:bg-slate-100",
              className || "text-slate-700 hover:text-slate-900",
            ].join(" "),
      ].join(" ")}
    >
      {icon ? (
        <span
          aria-hidden
          className={[
            "text-sm leading-none",
            active ? "text-white" : "",
            iconClassName,
          ].join(" ")}
        >
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </Link>
  );
}

function PrimaryNavButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold",
        "shadow-sm transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-300",
        active
          ? "bg-emerald-700 text-white hover:bg-emerald-800"
          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {icon ? (
        <span
          aria-hidden
          className={["text-sm leading-none", active ? "text-white" : ""].join(
            " "
          )}
        >
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() || "/";

  // Hide quiz CTA on results pages so results doesn’t feel like “take again”
  const hideQuizButton =
    pathname === "/results" || pathname.startsWith("/results/");

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-slate-200",
        "bg-white",
        "shadow-sm",
        "supports-[backdrop-filter]:bg-white/95 supports-[backdrop-filter]:backdrop-blur",
        "print:hidden",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm"
            aria-hidden
          >
            ✨
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            Therapy Fit
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1">
          <NavLink href="/about" icon="ℹ️">
            <span className="hidden sm:inline">About Therapy Fit</span>
            <span className="sm:hidden">About</span>
          </NavLink>

          {!hideQuizButton ? (
            <PrimaryNavButton href="/quiz" icon="🧠">
              Start quiz
            </PrimaryNavButton>
          ) : null}

          <NavLink href="/results" icon="🧩">
            <span className="hidden sm:inline">Results</span>
            <span className="sm:hidden">Results</span>
          </NavLink>

          <NavLink href="/therapies" icon="📚">
            <span className="hidden sm:inline">Therapy Types</span>
            <span className="sm:hidden">Library</span>
          </NavLink>

          <NavLink href="/questions" icon="❓">
            <span className="hidden sm:inline">Common Questions</span>
            <span className="sm:hidden">Questions</span>
          </NavLink>

          <NavLink href="/credentials" icon="🎓">
            <span className="hidden sm:inline">Credentials &amp; Training</span>
            <span className="sm:hidden">Credentials</span>
          </NavLink>

          <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:inline-block" />

          <NavLink
            href="/support"
            icon="🧾"
            className="text-slate-600 hover:text-slate-900"
          >
            <span className="hidden sm:inline">Support &amp; Services</span>
            <span className="sm:hidden">Support</span>
          </NavLink>

          <NavLink
            href="/crisis"
            icon="◯"
            className="text-red-700 hover:text-red-800"
            iconClassName="text-red-600"
            activeClassName="bg-red-700 text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <span className="hidden sm:inline">Crisis Resources</span>
            <span className="sm:hidden">Crisis</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
