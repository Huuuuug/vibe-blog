"use client";

import { useEffect } from "react";

export function Logo({ ...props }: React.ComponentProps<"svg">) {
  useEffect(() => {
    const existingStyle = document.getElementById("logo-style");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "logo-style";
    document.head.appendChild(style);
    const el = document.getElementById("logo-svg") as HTMLElement | null;

    if (!el) {
      return;
    }

    el.childNodes.forEach((path, index) => {
      const p = path as SVGPathElement;
      const len = p.getTotalLength();
      const frameName = `grow-${index}`;
      const keyframes = `
        @keyframes ${frameName} {
          0% {
            stroke-dashoffset: 0;
            stroke-dasharray: 0 ${len}px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          40% {
            stroke-dasharray: ${len}px 0;
          }
          85% {
            stroke-dasharray: ${len}px 0;
          }
          95%,
          100% {
            stroke-dasharray: 0 ${len}px;
          }
        }
      `;

      style.sheet?.insertRule(keyframes, style.sheet.cssRules.length);
      p.style.animation = `${frameName} 15s ease forwards infinite`;
    });
  }, []);

  return (
    <svg
      id="logo-svg"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m35.96,21.67c1.36,9.37,2.73,18.85,2.3,28.35s-2.83,19.17-8.16,26.26" />
      <path d="m9.91,50.74c21.56-1.15,43.33,2.12,64.65-1.9,3.72-.7,7.63-1.76,10.32-4.9,2.81-3.29,3.72-8.21,4.2-12.87.42-4.04.61-8.11.81-12.17.16-3.32-.27-7.66-2.99-8.42-1.84-.51-3.6,1.07-4.87,2.74-5.72,7.51-7.52,18.13-7.94,28.25s.29,20.37-1.38,30.31c-.66,3.9-1.72,7.82-3.82,10.92-5.37,7.92-15.28,8.05-23.82,7.5" />
    </svg>
  );
}
