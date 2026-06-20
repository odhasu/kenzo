'use client';

import { useEffect, useRef, useState } from 'react';

export function PageReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => setReady(true);
    // 800ms max — video is 228KB so it loads fast
    const timer = setTimeout(reveal, 800);

    video.addEventListener('canplay', reveal, { once: true });
    return () => {
      clearTimeout(timer);
      video.removeEventListener('canplay', reveal);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
        autoPlay muted loop playsInline preload="auto"
      >
        <source src="/innercircle/back.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(5,5,5,0.35)', pointerEvents: 'none' }} />

      {/* SPINNER */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#050505',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: ready ? 0 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: ready ? 'none' : 'all',
      }}>
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="26" stroke="rgba(57,255,20,0.12)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="26"
            stroke="#39FF14"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="60 103"
            style={{ transformOrigin: '32px 32px', animation: 'spin 0.8s linear infinite' }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      </div>

      {/* CONTENT — fades in + slides up */}
      <div style={{
        position: 'relative', zIndex: 2,
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {children}
      </div>
    </>
  );
}
