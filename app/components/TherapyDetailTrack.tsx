// app/components/TherapyDetailTrack.tsx
"use client";

import { useEffect } from "react";
import { track } from "../../lib/analytics";

export function TherapyDetailTrack({
  slug,
  name,
  family,
}: {
  slug: string;
  name: string;
  family: string;
}) {
  useEffect(() => {
    // Fires once on load for the detail page
    track("therapy_detail_view", { slug, name, family });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}
