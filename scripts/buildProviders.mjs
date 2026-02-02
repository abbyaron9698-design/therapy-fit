// scripts/buildProviders.mjs
// @ts-nocheck
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const csvPath = path.join(root, "data", "providers.csv");
const outPath = path.join(root, "lib", "providerData.generated.ts");

function parseBool(v) {
  return String(v ?? "").trim().toLowerCase() === "true";
}

function parseNumber(v) {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : undefined;
}

function parsePipeList(v) {
  const s = String(v ?? "").trim();
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

function escapeStr(s) {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/"/g, '\\"');
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++; // CRLF
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
      }
      row = [];
      cur = "";
      continue;
    }

    cur += ch;
  }

  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

const csv = fs.readFileSync(csvPath, "utf8");
const rows = parseCSV(csv).filter((r) => r.some((c) => String(c).trim().length));

if (rows.length < 2) {
  throw new Error("providers.csv must include a header row and at least one data row.");
}

const header = rows[0].map((h) => String(h).trim());
const dataRows = rows.slice(1);
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

function get(row, key) {
  const i = idx[key];
  return i == null ? "" : String(row[i] ?? "").trim();
}

const providers = dataRows.map((r) => {
  return {
    id: get(r, "id"),
    name: get(r, "name"),

    address: get(r, "address"),
    city: get(r, "city"),
    state: get(r, "state"),
    zip: get(r, "zip"),

    telehealth: parseBool(get(r, "telehealth")),
    acceptingNewClients: parseBool(get(r, "acceptingNewClients")),

    insurance: parsePipeList(get(r, "insurance")),
    modalities: parsePipeList(get(r, "modalities")),

    website: get(r, "website") || undefined,
    intakeUrl: get(r, "intakeUrl") || undefined,
    directionsUrl: get(r, "directionsUrl") || undefined,
    parkingUrl: get(r, "parkingUrl") || undefined,
    notes: get(r, "notes") || undefined,
    sourceUrl: get(r, "sourceUrl") || undefined,

    verified: get(r, "verified") ? parseBool(get(r, "verified")) : undefined,
    lastVerified: get(r, "lastVerified") || undefined,

    featured: get(r, "featured") ? parseBool(get(r, "featured")) : undefined,
    featuredRank: parseNumber(get(r, "featuredRank")),
    featuredUntil: get(r, "featuredUntil") || undefined,
    featuredTagline: get(r, "featuredTagline") || undefined,
  };
});

const out = `// AUTO-GENERATED. DO NOT EDIT BY HAND.
// Source: data/providers.csv
import type { ModalityId } from "./quizData";

export type Provider = {
  id: string;
  name: string;

  address: string;
  city: string;
  state: string;
  zip: string;

  telehealth: boolean;
  acceptingNewClients: boolean;

  insurance: string[];
  modalities: ModalityId[];

  website?: string;
  intakeUrl?: string;
  directionsUrl?: string;
  parkingUrl?: string;
  notes?: string;
  sourceUrl?: string;

  verified?: boolean;
  lastVerified?: string;

  featured?: boolean;
  featuredRank?: number;
  featuredUntil?: string;
  featuredTagline?: string;
};

export const PROVIDERS: Provider[] = [
${providers
  .map((p) => {
    return `  {
    id: "${escapeStr(p.id)}",
    name: "${escapeStr(p.name)}",

    address: "${escapeStr(p.address)}",
    city: "${escapeStr(p.city)}",
    state: "${escapeStr(p.state)}",
    zip: "${escapeStr(p.zip)}",

    telehealth: ${p.telehealth},
    acceptingNewClients: ${p.acceptingNewClients},

    insurance: ${JSON.stringify(p.insurance)},
    modalities: ${JSON.stringify(p.modalities)} as ModalityId[],

    website: ${p.website ? `"${escapeStr(p.website)}"` : "undefined"},
    intakeUrl: ${p.intakeUrl ? `"${escapeStr(p.intakeUrl)}"` : "undefined"},
    directionsUrl: ${p.directionsUrl ? `"${escapeStr(p.directionsUrl)}"` : "undefined"},
    parkingUrl: ${p.parkingUrl ? `"${escapeStr(p.parkingUrl)}"` : "undefined"},
    notes: ${p.notes ? `"${escapeStr(p.notes)}"` : "undefined"},
    sourceUrl: ${p.sourceUrl ? `"${escapeStr(p.sourceUrl)}"` : "undefined"},

    verified: ${typeof p.verified === "boolean" ? p.verified : "undefined"},
    lastVerified: ${p.lastVerified ? `"${escapeStr(p.lastVerified)}"` : "undefined"},

    featured: ${typeof p.featured === "boolean" ? p.featured : "undefined"},
    featuredRank: ${typeof p.featuredRank === "number" ? p.featuredRank : "undefined"},
    featuredUntil: ${p.featuredUntil ? `"${escapeStr(p.featuredUntil)}"` : "undefined"},
    featuredTagline: ${p.featuredTagline ? `"${escapeStr(p.featuredTagline)}"` : "undefined"},
  },`;
  })
  .join("\n")}
];
`;

fs.writeFileSync(outPath, out, "utf8");
console.log(`Header columns: ${header.length}`);
console.log(`Data rows: ${dataRows.length}`);
console.log(`Wrote ${providers.length} providers -> ${path.relative(root, outPath)}`);
console.log("First provider:", providers[0]);
