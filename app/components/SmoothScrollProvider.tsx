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

    // Next puts the window back to the top on navigation, but Lenis holds its
    // own scroll position and drives the window back to it on the next frame.
    // Only Lenis can settle that argument, so navigations say so explicitly.
    const handleScrollReset = () => {
      // Lenis skips the work when it already believes it is at the top, so the
      // window gets told directly as well — the two can disagree after Next
      // has moved the page out from under it.
      lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };

    // Animation loop for Lenis
    let animationFrameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    window.addEventListener('lenis-scroll-top', handleScrollToTop);
    window.addEventListener('lenis-scroll-reset', handleScrollReset);
    window.addEventListener('lenis-stop', handleStop);
    window.addEventListener('lenis-start', handleStart);
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('lenis-scroll-top', handleScrollToTop);
      window.removeEventListener('lenis-scroll-reset', handleScrollReset);
      window.removeEventListener('lenis-stop', handleStop);
      window.removeEventListener('lenis-start', handleStart);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
