'use client';

import { useEffect, useRef } from 'react';

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
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        width: '32px',
        height: '32px',
        transform: 'translate(0, 0)',
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))' }}
      >
        <g>
          <rect fill="white" x="23.68" y="1.52" width="5.24" height="5.24" transform="translate(4.52 19.44) rotate(-44.07)" />
          <polygon fill="white" points="32 30.12 29.4 33.76 25.8 30 22.16 26.24 18.56 22.44 14.96 18.68 11.36 14.92 7.68 11.16 3.92 14.76 1.32 11 4.08 7.4 0.44 3.64 4.24 0 7.84 3.76 11.6 1.6 15.24 3.92 10.48 7.52 15.12 11.32 18.76 15.08 22.4 18.88 25.96 22.6 29.6 26.32 32 30.12" />
          <rect fill="white" x="1.24" y="15.84" width="5.2" height="5.24" transform="translate(-11.76 7.88) rotate(-44.07)" />
          <rect fill="white" x="1.08" y="23.24" width="5.24" height="5.2" transform="translate(-16.84 9.76) rotate(-43.77)" />
          <rect fill="white" x="16.32" y="1.4" width="5.2" height="5.24" transform="translate(2.48 14.2) rotate(-43.76)" />
        </g>
      </svg>
    </div>
  );
}
