"use client";

import { ConsultChecklistCard } from "../../components/ConsultChecklistCard";

export default function ClientPrintPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">TherapyFit</div>
            <div className="text-sm text-slate-600">Print / Save as PDF</div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Open print dialog
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Tip: choose <strong>“Save as PDF”</strong> in the print dialog.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-10 pt-4 print:px-0 print:pt-0">
        <ConsultChecklistCard variant="print" density="normal" />
        <div className="mt-4 hidden text-xs text-slate-500 print:block">
          Educational only • therapyfit.org
        </div>
      </div>

      <style>{`
        @media print {
          html, body { background: #fff !important; }
          .shadow-sm { box-shadow: none !important; }
          @page { margin: 12mm; }
        }
      `}</style>
    </main>
  );
}
