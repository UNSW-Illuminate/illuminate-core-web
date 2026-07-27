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

    // Overlays (e.g. the image lightbox) freeze the page behind them by
    // dispatching these events rather than reaching for the Lenis instance.
    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();

    // Animation loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    window.addEventListener('lenis-scroll-top', handleScrollToTop);
    window.addEventListener('lenis-stop', handleStop);
    window.addEventListener('lenis-start', handleStart);
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('lenis-scroll-top', handleScrollToTop);
      window.removeEventListener('lenis-stop', handleStop);
      window.removeEventListener('lenis-start', handleStart);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
