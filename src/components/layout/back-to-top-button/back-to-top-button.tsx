"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={[
        "fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--card-strong)] text-[var(--foreground)] shadow-[0_18px_40px_rgba(31,42,38,0.18)] backdrop-blur-[16px] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-0 sm:bottom-8 sm:right-8",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_62%)] opacity-70" />
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        className="relative z-10 h-5 w-5"
      >
        <path d="M12 18V6" strokeLinecap="round" />
        <path d="m7.5 10.5 4.5-4.5 4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
