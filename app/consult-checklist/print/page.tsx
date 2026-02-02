// app/consult-checklist/print/page.tsx
import type { Metadata } from "next";
import ClientPrintPage from "./ClientPrintPage";

export const metadata: Metadata = {
  title: "Print Consult Checklist • Therapy Fit",
  description: "Print-friendly one-card consult checklist (save as PDF).",
};

export default function ConsultChecklistPrintPage() {
  return <ClientPrintPage />;
}
