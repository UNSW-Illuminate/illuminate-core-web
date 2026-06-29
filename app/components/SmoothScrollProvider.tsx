'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Create Lenis instance for smooth scrolling
    const lenis = new Lenis({
      duration: 0.75, // Lower duration = less smoothing, closer to native scroll
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    const handleScrollToTop = () => {
      lenis.scrollTo(0, {
        duration: 1,
      });
    };

    // Animation loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    window.addEventListener('lenis-scroll-top', handleScrollToTop);
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('lenis-scroll-top', handleScrollToTop);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
