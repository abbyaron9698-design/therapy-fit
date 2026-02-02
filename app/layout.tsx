// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { GlobalFeedback } from "./components/GlobalFeedback";
import { StickyQuizCTA } from "./components/StickyQuizCTA";

export const metadata = {
  title: "Therapy Fit",
  description:
    "Find therapy approaches and providers that fit your needs. Educational tool, not medical advice.",
};

function NavLink({
  href,
  icon,
  children,
  className = "",
  iconClassName = "",
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium",
        "hover:bg-slate-100 transition",
        "whitespace-nowrap",
        className || "text-slate-700 hover:text-slate-900",
      ].join(" ")}
    >
      {icon ? (
        <span
          aria-hidden
          className={["text-sm leading-none", iconClassName].join(" ")}
        >
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </a>
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
  return (
    <a
      href={href}
      className="
        inline-flex items-center gap-1.5
        rounded-xl px-3 py-2
        text-xs font-semibold
        bg-emerald-700 text-white
        shadow-sm transition
        hover:bg-emerald-800
        focus:outline-none focus:ring-2 focus:ring-emerald-300
        whitespace-nowrap
      "
    >
      {icon ? (
        <span aria-hidden className="text-sm leading-none">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </a>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="flex min-h-screen flex-col">
          {/* Header */}
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
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm"
                  aria-hidden
                >
                  ✨
                </span>
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  Therapy Fit
                </span>
              </a>

              {/* Navigation */}
              <nav className="flex flex-wrap items-center justify-end gap-1">
                <NavLink href="/about" icon="ℹ️">
                  <span className="hidden sm:inline">About Therapy Fit</span>
                  <span className="sm:hidden">About</span>
                </NavLink>

                <PrimaryNavButton href="/quiz" icon="🧠">
                  Start quiz
                </PrimaryNavButton>

                <NavLink href="/therapies" icon="📚">
                  <span className="hidden sm:inline">Modality Library</span>
                  <span className="sm:hidden">Library</span>
                </NavLink>

                <NavLink href="/questions" icon="❓">
                  <span className="hidden sm:inline">Common Questions</span>
                  <span className="sm:hidden">Questions</span>
                </NavLink>

                <NavLink href="/credentials" icon="🎓">
                  <span className="hidden sm:inline">
                    Understanding Credentials &amp; Training
                  </span>
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
                >
                  <span className="hidden sm:inline">Crisis Resources</span>
                  <span className="sm:hidden">Crisis</span>
                </NavLink>
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1">{children}</main>

          {/* Sticky mobile CTA */}
          <StickyQuizCTA
            href="/quiz"
            secondaryHref="/toolkit"
            secondaryLabel="Preview the Toolkit"
            secondaryShowAfterPx={1100}
          />

          {/* Global Feedback (bottom of every page, above footer) */}
          <GlobalFeedback />

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl text-center text-xs text-slate-500">
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/privacy" className="hover:underline">
                  Privacy
                </a>
                <a href="/terms" className="hover:underline">
                  Terms
                </a>
                <a href="/disclaimer" className="hover:underline">
                  Disclaimer
                </a>
                <a
                  href="/crisis"
                  className="font-medium text-red-600 hover:underline"
                >
                  Crisis Support
                </a>
              </div>

              <p className="mx-auto mt-4 max-w-xl text-[11px] text-slate-400">
                Therapy Fit is an educational tool and does not provide medical
                advice, diagnosis, or treatment. If you are in immediate danger,
                call 911 or your local emergency number.
              </p>

              {/* ✅ Illinois → expansion disclaimer */}
              <p className="mx-auto mt-2 max-w-xl text-[11px] text-slate-400">
                TherapyFit currently supports Illinois-based providers to ensure accurate, state-specific licensing
                and services. Expansion to additional states is planned.
              </p>

              <p className="mt-2 text-[11px] text-slate-400">
                © {new Date().getFullYear()} Therapy Fit
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
