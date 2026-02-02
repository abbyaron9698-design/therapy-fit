// app/components/CredentialsSearchBar.tsx
"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CredentialsSearchBar({
  initialQuery = "",
  placeholder = "Search a credential (LCSW, PMHNP, ATR-BC, BCBA, OT, SLP)…",
  action = "/credentials",
}: {
  initialQuery?: string;
  placeholder?: string;
  action?: string;
}) {
  const [value, setValue] = React.useState(initialQuery);

  React.useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  return (
    <form
      action={action}
      method="get"
      className="bg-transparent"
      aria-label="Search credentials"
    >
      <label className="sr-only" htmlFor="credentials-search">
        Search credentials
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span aria-hidden className="text-slate-400">
              🔎
            </span>

            <input
              id="credentials-search"
              name="q"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />

            {value.trim() ? (
              <button
                type="button"
                onClick={() => setValue("")}
                className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Best when you already have letters from a provider profile.
          </p>
        </div>

        <button
          type="submit"
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
            "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}
