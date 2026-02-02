// app/api/geo/route.ts
import { NextResponse } from "next/server";

type GeoOut =
  | { ok: true; zip: string; lat: number; lng: number }
  | { ok: false; error: string };

const cache = new Map<string, { lat: number; lng: number; cachedAt: number }>();
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function normalizeZip(z: string) {
  return (z ?? "").replace(/[^\d]/g, "").slice(0, 5);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const zip = normalizeZip(url.searchParams.get("zip") ?? "");

    if (zip.length !== 5) {
      return NextResponse.json<GeoOut>(
        { ok: false, error: "zip_must_be_5_digits" },
        { status: 400 }
      );
    }

    const hit = cache.get(zip);
    if (hit && Date.now() - hit.cachedAt < TTL_MS) {
      return NextResponse.json<GeoOut>({
        ok: true,
        zip,
        lat: hit.lat,
        lng: hit.lng,
      });
    }

    // Privacy note:
    // This calls a third-party ZIP lookup using ONLY the ZIP.
    // Your user's IP will be your server/Vercel's IP (not the user's client IP).
    const r = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      headers: { accept: "application/json" },
      // Next.js cache hint (safe to omit)
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!r.ok) {
      return NextResponse.json<GeoOut>(
        { ok: false, error: "zip_not_found" },
        { status: 404 }
      );
    }

    const data: any = await r.json();
    const place = data?.places?.[0];
    const lat = Number(place?.latitude);
    const lng = Number(place?.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json<GeoOut>(
        { ok: false, error: "geo_parse_failed" },
        { status: 500 }
      );
    }

    cache.set(zip, { lat, lng, cachedAt: Date.now() });

    return NextResponse.json<GeoOut>({ ok: true, zip, lat, lng });
  } catch {
    return NextResponse.json<GeoOut>(
      { ok: false, error: "unknown_error" },
      { status: 500 }
    );
  }
}
