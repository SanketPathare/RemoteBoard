"use client";

import { useState } from "react";

export type CompanyLogoSize = "sm" | "md" | "lg" | "xl";

interface CompanyLogoProps {
  name: string;
  logo?: string | null;
  size?: CompanyLogoSize;
  className?: string;
  priority?: boolean;
}

const SIZES: Record<
  CompanyLogoSize,
  { container: string; padding: string; font: string }
> = {
  sm: {
    container: "h-8 w-8 rounded-lg",
    padding: "p-1",
    font: "text-xs",
  },
  md: {
    container: "h-10 w-10 rounded-lg",
    padding: "p-1.5",
    font: "text-sm",
  },
  lg: {
    container: "h-14 w-14 rounded-xl",
    padding: "p-2",
    font: "text-lg",
  },
  xl: {
    container: "h-16 w-16 sm:h-20 sm:w-20 rounded-2xl",
    padding: "p-2 sm:p-2.5",
    font: "text-2xl sm:text-3xl",
  },
};

export function CompanyLogo({
  name,
  logo,
  size = "md",
  className = "",
  priority = false,
}: CompanyLogoProps) {
  const [logoOk, setLogoOk] = useState(true);
  const showLogo = Boolean(logo) && logoOk;
  const config = SIZES[size] || SIZES.md;

  if (showLogo) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-[#e5e5e5] bg-white shadow-sm ring-1 ring-black/5 dark:border-[#262626] dark:bg-[#111111] dark:ring-white/10 ${config.container} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo as string}
          alt={`${name} logo`}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          className={`h-full w-full object-contain ${config.padding}`}
          onError={() => setLogoOk(false)}
        />
      </div>
    );
  }

  // Branded fallback tile based on company name
  const cleanName = (name || "Company").trim();
  const letter = (cleanName[0] || "?").toUpperCase();
  const hues = [220, 250, 170, 340, 30, 200, 280, 15];
  const hue = hues[cleanName.charCodeAt(0) % hues.length];

  return (
    <div
      aria-hidden
      style={{
        background: `radial-gradient(circle at 35% 35%, hsl(${hue} 65% 18%), hsl(${hue} 70% 8%))`,
        color: `hsl(${hue} 85% 72%)`,
      }}
      className={`flex shrink-0 items-center justify-center font-bold tracking-tight shadow-sm ring-1 ring-white/10 select-none ${config.container} ${config.font} ${className}`}
    >
      {letter}
    </div>
  );
}
