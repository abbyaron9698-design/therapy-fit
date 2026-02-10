// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { GlobalFeedback } from "./components/GlobalFeedback";
import { StickyQuizCTA } from "./components/StickyQuizCTA";
import { SiteHeader } from "./components/SiteHeader";

export const metadata = {
  title: "Therapy Fit",
  description:
    "Find therapy approaches and providers that fit your needs. Educational tool, not medical advice.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Server-rendered value (no client recompute during hydration)
  const year = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-white text-slate-900"
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <SiteHeader />

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

              <p className="mx-auto mt-2 max-w-xl text-[11px] text-slate-400">
                TherapyFit currently supports Illinois-based providers to ensure
                accurate, state-specific licensing and services. Expansion to
                additional states is planned.
              </p>

              <p className="mt-2 text-[11px] text-slate-400">© {year} Therapy Fit</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
