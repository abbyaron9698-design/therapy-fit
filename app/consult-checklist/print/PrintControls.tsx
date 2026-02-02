"use client";

export function PrintControls() {
  return (
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
  );
}
