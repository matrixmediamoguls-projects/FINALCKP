import React, { useEffect, useRef } from "react";

const ELEMENTS = ["fire", "water", "air", "earth"];

const COLOR_MAP = {
  fire: { glow: "255,90,52", bg: "255,90,52" },
  water: { glow: "56,217,255", bg: "56,217,255" },
  air: { glow: "245,208,97", bg: "245,208,97" },
  earth: { glow: "61,255,136", bg: "61,255,136" },
};

const ICONS = {
  fire: "/icons/fire.svg",
  water: "/icons/water.svg",
  air: "/icons/air.svg",
  earth: "/icons/earth.svg",
};

export default function ElementalBackground({ act = "fire", audioLevel = 0 }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(audioLevel);

  useEffect(() => {
    audioRef.current = audioLevel;
    document.documentElement.style.setProperty("--audio-level", audioLevel.toFixed(3));
    document.documentElement.style.setProperty("--audio-logo-scale", (1 + audioLevel * 0.075).toFixed(3));
    document.documentElement.style.setProperty("--audio-logo-glow", (0.18 + audioLevel * 0.5).toFixed(3));
  }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let frameId;
    let time = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const images = {};
    Object.entries(ICONS).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      images[key] = img;
    });

    const particleCount = reducedMotion ? 8 : window.innerWidth < 700 ? 14 : 24;
    const particles = Array.from({ length: particleCount }).map(() => {
      const depth = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 16 + depth * 42,
        speed: reducedMotion ? 0 : 0.08 + depth * 0.34,
        drift: reducedMotion ? 0 : (Math.random() - 0.5) * 0.14,
        type: ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)],
        opacity: 0.008 + depth * 0.028,
        depth,
      };
    });

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(168,198,255,0.045)";
      ctx.lineWidth = 1;
      const grid = 86;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      const level = audioRef.current;

      particles.forEach((particle) => {
        const wind = Math.sin((particle.y + time) * 0.002) * (0.12 + level * 0.7);

        particle.x += particle.speed + wind;
        particle.y += particle.drift;

        if (particle.x > width + 80) particle.x = -80;
        if (particle.y > height + 80) particle.y = -80;
        if (particle.y < -80) particle.y = height + 80;

        const img = images[particle.type];
        if (!img?.complete) return;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.globalAlpha = particle.opacity * (1 + level * 0.75);
        ctx.shadowBlur = 18 * particle.depth * (1 + level);
        ctx.shadowColor = `rgba(${COLOR_MAP[particle.type].glow},${0.28 + level * 0.28})`;
        ctx.drawImage(img, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      });

      time += 0.6 + level;
      if (!reducedMotion) frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const active = COLOR_MAP[act] || COLOR_MAP.fire;
  const pulse = 0.18 + audioLevel * 0.18;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          background: `
            linear-gradient(115deg, rgba(${active.bg},${Math.min(0.2, pulse * 0.6)}) 0%, transparent 28%),
            linear-gradient(180deg, #3141ff 0%, #1634ff 43%, #0717a7 100%)
          `,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          background: `
            linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 100%),
            linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 100%),
            linear-gradient(90deg, transparent, rgba(${active.glow},${0.05 + audioLevel * 0.06}), transparent)
          `,
          backgroundSize: "96px 96px, 96px 96px, 100% 100%",
          opacity: 0.46,
          transition: "opacity 180ms linear",
        }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
