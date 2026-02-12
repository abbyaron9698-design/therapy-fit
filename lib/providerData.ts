// lib/providerData.ts
import { PROVIDERS as GENERATED_PROVIDERS, type Provider } from "./providerData.generated";

export type { Provider };

/**
 * Hard rule: demo providers should never show on the website.
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
 * Optional: basic integrity checks so you catch bad/partial rows early.
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
  // Always warn during development so you notice you’re still feeding demo rows.
  // eslint-disable-next-line no-console
  console.warn(
    `[TherapyFit] Filtered out ${demoCount} demo provider row(s). ` +
      `Demo data will NEVER be shown on the site. ` +
      `Update data/providers.csv with real providers to populate the directory.`
  );

  // Recommended: in production, fail fast so demo data can’t silently ship.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[TherapyFit] Demo provider rows detected in production build (count=${demoCount}). ` +
        `Remove/replace demo rows in data/providers.csv before deploying.`
    );
  }
}

if (invalidCount > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `[TherapyFit] Found ${invalidCount} invalid provider row(s) (missing required fields). ` +
      `These rows will be filtered out.`
  );
}

export const PROVIDERS: Provider[] = raw
  .filter((p) => !isDemoProvider(p))
  .filter(isValidProvider);
