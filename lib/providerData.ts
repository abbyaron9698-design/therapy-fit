// lib/providerData.ts
import {
  PROVIDERS as GENERATED_PROVIDERS,
  type Provider,
} from "./providerData.generated";

export type { Provider };

/**
 * Hard rule: demo providers should never show on the site.
 * We treat any row with:
 * - name starting with "Demo"
 * - OR id starting with "demo-"
 * as demo content and filter it out.
 */
function isDemoProvider(p: Provider) {
  const name = String(p.name ?? "").trim().toLowerCase();
  const id = String(p.id ?? "").trim().toLowerCase();
  return name.startsWith("demo") || id.startsWith("demo-");
}

/**
 * Basic integrity checks so you catch bad/partial rows early.
 */
function isValidProvider(p: Provider) {
  return Boolean(
    p &&
      p.id &&
      p.name &&
      p.city &&
      p.state &&
      p.zip &&
      Array.isArray(p.modalities) &&
      p.modalities.length > 0
  );
}

const raw = Array.isArray(GENERATED_PROVIDERS) ? GENERATED_PROVIDERS : [];
const demoCount = raw.filter(isDemoProvider).length;
const invalidCount = raw.filter((p) => !isValidProvider(p)).length;

if (demoCount > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `[TherapyFit] Filtered out ${demoCount} demo provider row(s). ` +
      `Demo data will NEVER be shown. Replace data/providers.csv with real providers to populate the directory.`
  );
}

if (invalidCount > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `[TherapyFit] Found ${invalidCount} invalid provider row(s). These rows will be filtered out.`
  );
}

export const PROVIDERS: Provider[] = raw
  .filter((p) => !isDemoProvider(p))
  .filter(isValidProvider);
