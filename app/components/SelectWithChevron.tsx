import React from "react";

export function SelectWithChevron(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  const { className, style, children, ...rest } = props;

  return (
    <div className="relative">
      <select
        {...rest}
        style={{
          ...style,
          // Extra-sticky: some browsers ignore appearance:none unless explicitly set inline
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
          backgroundImage: "none",
        }}
        className={[
          // Kill native arrows + any bg icons
          "appearance-none bg-none [&::-ms-expand]:hidden",
          // Your styling
          "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900",
          "focus:outline-none focus:border-slate-500",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </select>

      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
