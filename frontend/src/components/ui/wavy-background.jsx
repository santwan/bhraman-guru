"use client";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);
  const ntRef = useRef(0);
  const observerRef = useRef(null);
  const isVisibleRef = useRef(true);

  const getSpeed = () =>
    speed === "fast" ? 0.002 : speed === "slow" ? 0.001 : 0.001;

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const drawWave = (n, w, h) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ntRef.current += getSpeed();

    // dynamic sampling step for performance
    const step = window.innerWidth < 768 ? 8 : 5;

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < w; x += step) {
        const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = (w, h) => {
    if (!isVisibleRef.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = waveOpacity ?? 0.5;
    drawWave(5, w, h);
    rafRef.current = requestAnimationFrame(() => render(w, h));
  };

  const resizeCanvasToDisplaySize = (canvas, width, height) => {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const needResize =
      canvas.width !== Math.floor(width * dpr) ||
      canvas.height !== Math.floor(height * dpr);
    if (needResize) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    ctxRef.current = ctx;
    canvas.style.filter = `blur(${blur}px)`;

    const parent = canvas.parentElement;
    let resizeTimer;

    const computeAndStart = () => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      resizeCanvasToDisplaySize(canvas, width, height);
      cancelAnimationFrame(rafRef.current);
      render(width, height);
    };

    // Resize observer with debounce
    observerRef.current = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(computeAndStart, 120);
    });
    observerRef.current.observe(parent);
    computeAndStart();

    // Intersection observer to pause offscreen
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        isVisibleRef.current = e.isIntersecting;
        if (e.isIntersecting) computeAndStart();
      },
      { threshold: 0.01 }
    );
    io.observe(parent);

    // Page visibility pause
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else if (isVisibleRef.current) {
        computeAndStart();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Safari blur fallback
    const isSafari =
      typeof navigator !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
    if (isSafari) canvas.style.filter = `blur(${blur}px)`;

    return () => {
      cancelAnimationFrame(rafRef.current);
      observerRef.current?.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blur, waveWidth, JSON.stringify(waveColors), speed, waveOpacity]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-white dark:bg-neutral-950 transition-colors duration-500 relative overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};