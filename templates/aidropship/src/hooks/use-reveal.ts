'use client';

import { useEffect, useRef } from 'react';

// IntersectionObserver-based reveal hook
// Elements with class "reveal" get class "reveal-visible" when they enter the viewport
// Animation: opacity 0 + scale(0.96) translateY(56px) → opacity 1 + none

export function useReveal() {
  const ref = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    ref.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // Once visible, stop observing
            ref.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // trigger when 10% visible
        rootMargin: '0px 0px -40px 0px', // slightly before element enters
      }
    );

    // Observe all .reveal elements
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => ref.current?.observe(el));

    return () => {
      ref.current?.disconnect();
    };
  }, []);

  // Return a function to re-scan for new .reveal elements (call after dynamic content loads)
  const refresh = () => {
    const elements = document.querySelectorAll('.reveal:not(.reveal-visible)');
    elements.forEach((el) => ref.current?.observe(el));
  };

  return { refresh };
}
