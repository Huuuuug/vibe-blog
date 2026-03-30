"use client";

import { useCallback, useEffect, useRef } from "react";

type StepFn = () => void;

export function Plum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height };
  }, []);

  const polar2cart = useCallback((x: number, y: number, r: number, theta: number) => {
    return [x + r * Math.cos(theta), y + r * Math.sin(theta)] as const;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let animationId = 0;
    let rafActive = true;
    const steps: StepFn[] = [];
    let pending: StepFn[] = [];

    const r180 = Math.PI;
    const r90 = Math.PI / 2;
    const r15 = Math.PI / 12;

    const redraw = () => {
      const initialized = initCanvas(canvas);
      if (!initialized) {
        return;
      }

      const { ctx, width, height } = initialized;
      const minBranch = 30;
      const branchLen = width < 768 ? 4 : 6;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#88888825";

      const step = (
        x: number,
        y: number,
        rad: number,
        counter: { value: number } = { value: 0 },
      ) => {
        const length = Math.random() * branchLen;
        counter.value += 1;

        const [nx, ny] = polar2cart(x, y, length, rad);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100) {
          return;
        }

        const nextLeft = rad + Math.random() * r15;
        const nextRight = rad - Math.random() * r15;
        const rate = counter.value <= minBranch ? 0.8 : 0.5;

        if (Math.random() < rate) {
          steps.push(() => step(nx, ny, nextLeft, counter));
        }

        if (Math.random() < rate) {
          steps.push(() => step(nx, ny, nextRight, counter));
        }
      };

      const randomMiddle = () => Math.random() * 0.6 + 0.2;
      steps.length = 0;
      pending = [
        () => step(randomMiddle() * width, -5, r90),
        () => step(randomMiddle() * width, height + 5, -r90),
        () => step(-5, randomMiddle() * height, 0),
        () => step(width + 5, randomMiddle() * height, r180),
      ];
    };

    const loop = () => {
      if (!rafActive) {
        return;
      }

      const queue = pending;
      pending = [];

      if (!queue.length) {
        animationId = requestAnimationFrame(loop);
        return;
      }

      queue.forEach((runner) => {
        if (Math.random() < 0.5) {
          pending.push(runner);
        } else {
          runner();
        }
      });

      if (steps.length) {
        pending.push(...steps.splice(0, steps.length));
      }

      animationId = requestAnimationFrame(loop);
    };

    redraw();
    animationId = requestAnimationFrame(loop);

    const onResize = () => redraw();
    window.addEventListener("resize", onResize);

    return () => {
      rafActive = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [initCanvas, polar2cart]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
