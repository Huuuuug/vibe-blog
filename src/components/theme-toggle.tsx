"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type ThemePreference, applyTheme } from "@/lib/theme";

const options: Array<{ label: string; shortLabel: string; value: ThemePreference }> = [
  { label: "浅色主题", shortLabel: "浅", value: "light" },
  { label: "深色主题", shortLabel: "深", value: "dark" },
  { label: "跟随系统", shortLabel: "系", value: "system" },
];

function getInitialTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const updateTheme = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="inline-flex min-h-[42px] items-center rounded-full border border-[var(--border-strong)] bg-[var(--card)] p-[3px] shadow-[0_8px_18px_rgba(31,42,38,0.08)]">
      {options.map((option) => {
        const active = option.value === theme;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => updateTheme(option.value)}
            className={[
              "inline-flex min-h-[34px] min-w-9 items-center justify-center rounded-full px-3 text-[0.85rem] font-bold transition-colors duration-150",
              active
                ? "bg-foreground text-background shadow-[0_8px_18px_rgba(31,42,38,0.14)]"
                : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-foreground",
            ].join(" ")}
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
          >
            <span aria-hidden>{option.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
