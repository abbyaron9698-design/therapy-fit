// app/faq/page.tsx
import { redirect } from "next/navigation";

export default function FAQRedirectPage() {
  redirect("/questions");
}
