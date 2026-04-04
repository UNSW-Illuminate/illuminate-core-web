'use client';

import { useEffect, useRef } from 'react';
import { CursorIcon } from './CursorIcon';

export default function SmoothCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const smoothPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const smoothingFactor = 0.15; // Adjust this for more/less drag (lower = more drag)
      smoothPosRef.current.x += (mousePosRef.current.x - smoothPosRef.current.x) * smoothingFactor;
      smoothPosRef.current.y += (mousePosRef.current.y - smoothPosRef.current.y) * smoothingFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${smoothPosRef.current.x}px, ${smoothPosRef.current.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-8 w-8 md:block"
    >
      <div className="drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
        <CursorIcon size={32} />
      </div>
    </div>
  );
}
