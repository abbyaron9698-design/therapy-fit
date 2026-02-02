// app/checkout/page.tsx
import CheckoutClient from "./CheckoutClient";

type SearchParamsShape = Record<string, string | string[] | undefined>;

function pickString(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

function safeNumber(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParamsShape> | SearchParamsShape;
}) {
  const sp: SearchParamsShape = await Promise.resolve(searchParams ?? {});

  const product = pickString(sp.product) ?? "toolkit";
  const focus = pickString(sp.focus) ?? "";
  const profile = pickString(sp.profile) ?? "";
  const src = pickString(sp.src) ?? "";
  const initialAmount = safeNumber(pickString(sp.amount), 19);

  return (
    <CheckoutClient
      product={product}
      focus={focus}
      profile={profile}
      src={src}
      initialAmount={initialAmount}
    />
  );
}
