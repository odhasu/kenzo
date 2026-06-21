'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import type { BackgroundId } from '@/types/blocks';

// ─── Particle types ───────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex?: string): string {
  if (!hex) return '57,255,20';
  const h = hex.replace('#', '');
  if (h.length !== 6) return '57,255,20';
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '57,255,20';
  return `${r},${g},${b}`;
}

// ─── Particles canvas ─────────────────────────────────────────────────────────

function ParticlesCanvas({ accentRgb }: { accentRgb: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const CONNECTION_DIST = 140;
    const PARTICLE_COUNT = 50;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth ?? window.innerWidth;
      canvas.height = parent?.clientHeight ?? window.innerHeight;
    }

    function spawn(): Particle {
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: Math.random() * (canvas?.height ?? window.innerHeight),
        vx: reducedMotion.current ? 0 : (Math.random() - 0.5) * 0.25,
        vy: reducedMotion.current ? 0 : (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      };
    }

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(spawn());

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.07;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${accentRgb},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb},${p.opacity})`;
        ctx.fill();

        if (!reducedMotion.current) {
          p.x += p.vx;
          p.y += p.vy;
        }

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener('resize', resize);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqHandler = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
      if (e.matches) particles.forEach(p => { p.vx = 0; p.vy = 0; });
      else particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * 0.25;
        p.vy = (Math.random() - 0.5) * 0.25;
      });
    };
    mq.addEventListener('change', mqHandler);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      mq.removeEventListener('change', mqHandler);
    };
  }, [accentRgb]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        opacity: 0.7,
      }}
    />
  );
}

// ─── Aurora blobs ─────────────────────────────────────────────────────────────

function AuroraBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes aurora-float1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(6%, -4%) scale(1.04); }
          66% { transform: translate(-3%, 2%) scale(0.97); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-float2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-5%, 3%) scale(0.96); }
          66% { transform: translate(4%, -2%) scale(1.03); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-float3 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -5%) scale(1.02); }
          66% { transform: translate(-4%, 1%) scale(0.98); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aurora-float4 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-5%, -1%) scale(1.01); }
          66% { transform: translate(3%, 4%) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none !important; }
        }
      `}</style>
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: 'var(--accent-glow, rgba(57,255,20,0.10))',
          filter: 'blur(100px)',
          opacity: 0.65,
          animation: 'aurora-float1 17s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '45%',
          height: '50%',
          borderRadius: '50%',
          background: 'var(--accent-dim, rgba(57,255,20,0.07))',
          filter: 'blur(90px)',
          opacity: 0.55,
          animation: 'aurora-float2 21s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '50%',
          height: '35%',
          borderRadius: '50%',
          background: 'var(--accent-glow, rgba(57,255,20,0.05))',
          filter: 'blur(75px)',
          opacity: 0.45,
          animation: 'aurora-float3 19s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          bottom: '-8%',
          right: '20%',
          width: '40%',
          height: '30%',
          borderRadius: '50%',
          background: 'var(--accent-dim, rgba(57,255,20,0.04))',
          filter: 'blur(65px)',
          opacity: 0.35,
          animation: 'aurora-float4 23s ease-in-out infinite',
        }}
      />
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function StarsBackground() {
  const stars = useMemo(() => {
    const s: { left: string; top: string; size: number; delay: string; duration: string; opacity: number }[] = [];
    for (let i = 0; i < 70; i++) {
      s.push({
        left: `${((i * 37 + 13) % 100)}%`,
        top: `${((i * 53 + 7) % 100)}%`,
        size: (i % 4 === 0) ? 1.5 : 1,
        delay: `${(i * 0.41) % 5}s`,
        duration: `${2 + (i % 3) * 1.5}s`,
        opacity: 0.12 + (i % 5) * 0.08,
      });
    }
    return s;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .funnel-star { animation: none !important; }
        }
      `}</style>
      {stars.map((s, i) => (
        <div
          key={i}
          className="funnel-star"
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'var(--accent, #39FF14)',
            opacity: s.opacity,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Noise (canvas tile → CSS background-repeat — avoids SVG feTurbulence GPU OOM) ─

function NoiseBackground() {
  const [tileUrl, setTileUrl] = useState<string | null>(null)

  useEffect(() => {
    // Render one 128×128 noise tile to canvas, export as data URL, repeat via CSS.
    // feTurbulence on full-height SVG rect = Chrome tab kill on tall funnels.
    // A small repeating tile costs the GPU ~nothing regardless of page height.
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imageData = ctx.createImageData(size, size)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255
      imageData.data[i] = v
      imageData.data[i + 1] = v
      imageData.data[i + 2] = v
      imageData.data[i + 3] = 40
    }
    ctx.putImageData(imageData, 0, 0)
    setTileUrl(canvas.toDataURL())
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        opacity: 0.35,
        ...(tileUrl ? {
          backgroundImage: `url(${tileUrl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        } : {}),
      }}
    />
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FunnelBackground({
  background,
  accent,
}: {
  background: BackgroundId;
  accent?: string;
}) {
  const accentRgb = useMemo(() => hexToRgb(accent), [accent]);

  switch (background) {
    case 'none':
      return null;

    case 'gradient':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none' as const,
            overflow: 'hidden',
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-glow, rgba(57,255,20,0.1)) 0%, transparent 60%)',
          }}
        />
      );

    case 'particles':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none' as const,
              overflow: 'hidden',
              background:
                'radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-dim, rgba(57,255,20,0.04)) 0%, transparent 60%)',
            }}
          />
          <ParticlesCanvas accentRgb={accentRgb} />
        </>
      );

    case 'grid':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none' as const,
            overflow: 'hidden',
            backgroundImage: `
              linear-gradient(var(--border, rgba(255,255,255,0.04)) 1px, transparent 1px),
              linear-gradient(90deg, var(--border, rgba(255,255,255,0.04)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, black 40%, transparent 70%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, black 40%, transparent 70%)',
          }}
        />
      );

    case 'glow':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none' as const,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              background: 'var(--accent-glow, rgba(57,255,20,0.12))',
              filter: 'blur(120px)',
              opacity: 0.55,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-15%',
              left: '-10%',
              width: '45%',
              height: '45%',
              borderRadius: '50%',
              background: 'var(--accent-dim, rgba(57,255,20,0.07))',
              filter: 'blur(100px)',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '30%',
              width: '40%',
              height: '30%',
              borderRadius: '50%',
              background: 'var(--accent-glow, rgba(57,255,20,0.06))',
              filter: 'blur(80px)',
              opacity: 0.45,
            }}
          />
        </div>
      );

    case 'aurora':
      return <AuroraBackground />;

    case 'dots':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none' as const,
            overflow: 'hidden',
            backgroundImage:
              'radial-gradient(circle, var(--border, rgba(255,255,255,0.06)) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, black 30%, transparent 65%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, black 30%, transparent 65%)',
          }}
        />
      );

    case 'noise':
      return <NoiseBackground />;

    case 'waves':
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none' as const,
            overflow: 'hidden',
            opacity: 0.25,
          }}
        >
          <style>{`
            @keyframes wave-drift1 {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(30px) translateY(-8px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes wave-drift2 {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(-20px) translateY(6px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes wave-drift3 {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(15px) translateY(-4px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              .funnel-wave { animation: none !important; }
            }
          `}</style>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0 }}
          >
            <path
              className="funnel-wave"
              d="M0,400 C200,300 400,500 600,400 C800,300 1000,500 1200,400 L1200,0 L0,0 Z"
              fill="var(--accent-dim, rgba(57,255,20,0.03))"
              style={{ animation: 'wave-drift1 18s ease-in-out infinite' }}
            />
            <path
              className="funnel-wave"
              d="M0,480 C250,400 500,560 750,480 C1000,400 1100,500 1200,460 L1200,0 L0,0 Z"
              fill="var(--accent-glow, rgba(57,255,20,0.05))"
              style={{ animation: 'wave-drift2 22s ease-in-out infinite' }}
            />
            <path
              className="funnel-wave"
              d="M0,430 C300,340 600,520 900,430 C1050,370 1125,440 1200,420 L1200,0 L0,0 Z"
              fill="var(--border, rgba(255,255,255,0.02))"
              style={{ animation: 'wave-drift3 16s ease-in-out infinite' }}
            />
          </svg>
        </div>
      );

    case 'stars':
      return <StarsBackground />;

    default:
      return null;
  }
}
