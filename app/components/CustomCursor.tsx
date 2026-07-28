'use client';

import { useEffect, useRef } from 'react';
import { CursorIcon } from './CursorIcon';

/**
 * Viewport width says nothing about whether a pointer exists — a narrow desktop
 * window still deserves the cursor, and a wide tablet in touch mode does not.
 * Gating on pointer capability instead mirrors the `cursor: none` rule in
 * globals.css, so the native cursor is only hidden where ours is drawn.
 */
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setCursorVisibility = (isVisible: boolean) => {
      if (!cursorRef.current) {
        return;
      }

      cursorRef.current.style.opacity = isVisible ? '1' : '0';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      setCursorVisibility(true);
    };

    const handleMouseLeaveWindow = () => {
      setCursorVisibility(false);
    };

    const handleMouseEnterWindow = () => {
      setCursorVisibility(true);
    };

    const startTracking = () => {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeaveWindow);
      document.addEventListener('mouseenter', handleMouseEnterWindow);
    };

    const stopTracking = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      setCursorVisibility(false);
    };

    const finePointer = window.matchMedia(FINE_POINTER_QUERY);

    // Re-runs when a mouse is plugged into (or unplugged from) a touch device.
    const syncPointerCapability = () => {
      stopTracking();

      if (finePointer.matches) {
        startTracking();
      }
    };

    syncPointerCapability();
    finePointer.addEventListener('change', syncPointerCapability);

    return () => {
      finePointer.removeEventListener('change', syncPointerCapability);
      stopTracking();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] hidden h-8 w-8 opacity-0 [@media_(hover:hover)_and_(pointer:fine)]:block"
    >
      <div className="drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
        <CursorIcon size={32} />
      </div>
    </div>
  );
}
