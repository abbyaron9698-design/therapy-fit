// app/api/geocode/route.ts
import { NextResponse } from "next/server";

type GeoResponse =
  | { ok: true; zip: string; lat: number; lng: number; source: string }
  | { ok: false; error: string };

function cleanZip(raw: unknown) {
  const s = String(raw ?? "").replace(/[^\d]/g, "").slice(0, 5);
  return s.length === 5 ? s : "";
}

/**
 * Privacy notes:
 * - We do NOT log the ZIP here.
 * - We return only lat/lng for distance sorting.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const zip = cleanZip(body?.zip);

    if (!zip) {
      const res: GeoResponse = { ok: false, error: "Invalid ZIP (must be 5 digits)." };
      return NextResponse.json(res, { status: 400 });
    }

    // Primary: Zippopotam (simple, no key)
    // https://api.zippopotam.us/us/60611
    try {
      const r = await fetch(`https://api.zippopotam.us/us/${zip}`, {
        // Avoid caching stale responses in serverless environments
        cache: "no-store",
      });

      if (r.ok) {
        const data = await r.json();
        const place = data?.places?.[0];
        const lat = Number(place?.latitude);
        const lng = Number(place?.longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const res: GeoResponse = { ok: true, zip, lat, lng, source: "zippopotam" };
          return NextResponse.json(res);
        }
      }
    } catch {
      // fall through
    }

    // Fallback: Census "onelineaddress" using ZIP as address
    // (Not perfect for ZIP-only, but often works well enough as a fallback.)
    // Docs: https://geocoding.geo.census.gov/geocoder/
    try {
      const url =
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress" +
        `?address=${encodeURIComponent(zip)}` +
        "&benchmark=Public_AR_Current" +
        "&format=json";

      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) {
        const data = await r.json();
        const match = data?.result?.addressMatches?.[0];
        const lat = Number(match?.coordinates?.y);
        const lng = Number(match?.coordinates?.x);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const res: GeoResponse = { ok: true, zip, lat, lng, source: "census" };
          return NextResponse.json(res);
        }
      }
    } catch {
      // fall through
    }

    const res: GeoResponse = {
      ok: false,
      error: "Could not geocode ZIP (try again later).",
    };
    return NextResponse.json(res, { status: 502 });
  } catch {
    const res: GeoResponse = { ok: false, error: "Bad request." };
    return NextResponse.json(res, { status: 400 });
  }
}
