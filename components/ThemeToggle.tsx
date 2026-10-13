"use client";

import { Moon, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** Pixel-perfect desktop system icon matching Radix / Tailwind theme switch */
export function SystemIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1.5 3C1.5 2.17157 2.17157 1.5 3 1.5H12C12.8284 1.5 13.5 2.17157 13.5 3V12C13.5 12.8284 12.8284 13.5 12 13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V3ZM3 2.5C2.72386 2.5 2.5 2.72386 2.5 3V9.5H12.5V3C12.5 2.72386 12.2761 2.5 12 2.5H3ZM10.5 11C10.2239 11 10 11.2239 10 11.5C10 11.7761 10.2239 12 10.5 12H11.5C11.7761 12 12 11.7761 12 11.5C12 11.2239 11.7761 11 11.5 11H10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-block h-9 w-9 rounded-lg border border-neutral-200 bg-neutral-100 dark:border-[#404040] dark:bg-[#080808]"
      />
    );
  }

  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-black dark:border-[#404040] dark:bg-[#080808] dark:text-[#a3a3a3] dark:hover:border-[#737373] dark:hover:bg-[#111] dark:hover:text-white"
    >
      {dark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-700" />
      )}
    </button>
  );
}

/** Segmented pill theme toggle: [ System | Light | Dark ] matching user screenshot */
export function ThemePillToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const activeTheme = mounted ? (theme || "system") : "system";

  const options = [
    {
      value: "system",
      label: "System theme",
      icon: <SystemIcon className="h-3.5 w-3.5" />,
    },
    {
      value: "light",
      label: "Light theme",
      icon: <Sun className="h-3.5 w-3.5" />,
    },
    {
      value: "dark",
      label: "Dark theme",
      icon: <MoonStar className="h-3.5 w-3.5" />,
    },
  ] as const;

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={`inline-flex items-center gap-0.5 rounded-full border border-neutral-300/80 bg-neutral-200/50 p-1 dark:border-neutral-800 dark:bg-neutral-900/90 ${className}`}
    >
      {options.map((opt) => {
        const isActive = activeTheme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            title={opt.label}
            aria-pressed={isActive}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 ${
              isActive
                ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800 dark:text-white dark:ring-white/10"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}

