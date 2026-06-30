import { useEffect, useState, useRef } from 'react';

export type SectionColor = {
  hue: number;
  saturation: number;
  lightness: number;
};

type ScrollFrame = {
  id: string;
  start: number; // normalized 0..1
  end: number; // normalized 0..1
  from: SectionColor;
  to: SectionColor;
  name: string;
};

// Frame-based color progression across the page.
// Each frame clamps hue to a bounded range and interpolates within that range.
const FRAMES: ScrollFrame[] = [
  {
    id: 'intro',
    start: 0,
    end: 0.2,
    name: 'Intro',
    from: { hue: 252, saturation: 72, lightness: 50 },
    to: { hue: 282, saturation: 74, lightness: 53 },
  },
  {
    id: 'showcase',
    start: 0.2,
    end: 0.4,
    name: 'Showcase',
    from: { hue: 282, saturation: 74, lightness: 53 },
    to: { hue: 210, saturation: 70, lightness: 48 },
  },
  {
    id: 'projects',
    start: 0.4,
    end: 0.6,
    name: 'Past Projects',
    from: { hue: 210, saturation: 70, lightness: 48 },
    to: { hue: 36, saturation: 80, lightness: 54 },
  },
  {
    id: 'team',
    start: 0.6,
    end: 0.8,
    name: 'Team',
    from: { hue: 36, saturation: 80, lightness: 54 },
    to: { hue: 148, saturation: 72, lightness: 50 },
  },
  {
    id: 'contact',
    start: 0.8,
    end: 1,
    name: 'Contact',
    from: { hue: 148, saturation: 72, lightness: 50 },
    to: { hue: 320, saturation: 68, lightness: 47 },
  },
];

function lerpHue(a: number, b: number, t: number): number {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (a + diff * t + 360) % 360;
}

function mixColor(from: SectionColor, to: SectionColor, t: number): SectionColor {
  return {
    hue: lerpHue(from.hue, to.hue, t),
    saturation: from.saturation + (to.saturation - from.saturation) * t,
    lightness: from.lightness + (to.lightness - from.lightness) * t,
  };
}

export function useScrollColor() {
  const [currentColor, setCurrentColor] = useState<SectionColor>(FRAMES[0].from);
  const [currentSection, setCurrentSection] = useState<string>(FRAMES[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);

      const frame = FRAMES.find((f) => progress >= f.start && progress <= f.end) ?? FRAMES[FRAMES.length - 1];
      const frameRange = Math.max(frame.end - frame.start, 1e-6);
      const localT = Math.min(Math.max((progress - frame.start) / frameRange, 0), 1);

      setCurrentSection(frame.id);
      setCurrentColor(mixColor(frame.from, frame.to, localT));

      if (progress <= FRAMES[0].start) {
        setCurrentSection(FRAMES[0].id);
        setCurrentColor(FRAMES[0].from);
      }

      if (progress >= FRAMES[FRAMES.length - 1].end) {
        const last = FRAMES[FRAMES.length - 1];
        setCurrentSection(last.id);
        setCurrentColor(last.to);
      }
    };

    scrollListenerRef.current = handleScroll;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Convert HSL to RGB hex for shader use
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const r = Math.round(f(0) * 255);
    const g = Math.round(f(8) * 255);
    const b = Math.round(f(4) * 255);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Convert HSL to normalized RGB (0-1 range) for WebGL
  const hslToRgbNormalized = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
  };

  return {
    currentColor,
    currentColorHex: hslToHex(currentColor.hue, currentColor.saturation, currentColor.lightness),
    currentColorRgb: hslToRgbNormalized(currentColor.hue, currentColor.saturation, currentColor.lightness),
    currentSection,
    scrollProgress,
    sections: FRAMES,
  };
}
