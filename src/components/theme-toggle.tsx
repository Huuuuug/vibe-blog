"use client";

import { useEffect, useRef, useState } from "react";
import { THEME_STORAGE_KEY, type ThemePreference, applyTheme } from "@/lib/theme";

type ThemeOption = {
  label: string;
  value: ThemePreference;
  icon: JSX.Element;
};

const iconClassName = "size-4.5";

const options: ThemeOption[] = [
  {
    label: "Light",
    value: "light",
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1M18.54 5.46l-1.48 1.48M6.94 17.06l-1.48 1.48M18.54 18.54l-1.48-1.48M6.94 6.94L5.46 5.46" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Dark",
    value: "dark",
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName}>
        <path d="M15.9 4.85a7.7 7.7 0 1 0 3.25 13.55A8.9 8.9 0 1 1 15.9 4.85Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "System",
    value: "system",
    icon: (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName}>
        <rect x="3.75" y="5" width="16.5" height="11.5" rx="2.25" />
        <path d="M9.5 19h5M12 16.5V19" strokeLinecap="round" />
      </svg>
    ),
  },
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const updateTheme = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setOpen(false);
  };

  const activeOption = options.find((option) => option.value === theme) ?? options[2];

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-3 text-[var(--foreground)] shadow-[0_8px_18px_rgba(31,42,38,0.08)] transition-colors duration-150 hover:bg-[var(--accent-soft)]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Theme switcher"
        title={activeOption.label}
      >
        <span className="inline-flex items-center justify-center">{activeOption.icon}</span>
        <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={["size-3.5 transition-transform duration-150", open ? "rotate-180" : ""].join(" ")}>
          <path d="M5.5 7.5 10 12l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 grid gap-1 min-w-[112px] rounded-[20px] border border-[var(--border-strong)] bg-[var(--card-strong)] p-1.5 shadow-[0_18px_36px_rgba(31,42,38,0.16)] backdrop-blur-[16px]">
          {options.map((option) => {
            const active = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateTheme(option.value)}
                className={[
                  "flex w-full items-center gap-2.5 rounded-[14px] px-3 py-2 text-left text-[0.82rem] font-semibold transition-colors duration-150",
                  active
                    ? "bg-foreground text-background"
                    : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-foreground",
                ].join(" ")}
                role="menuitemradio"
                aria-checked={active}
                title={option.label}
              >
                <span className="inline-flex items-center justify-center">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}


