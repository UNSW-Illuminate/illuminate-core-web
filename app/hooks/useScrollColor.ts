import { useEffect, useMemo, useState } from 'react';

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

type ScrollState = {
  color: SectionColor;
  section: string;
  progress: number;
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Skips a re-render when a scroll frame lands on the same colour and section. */
function isSameScrollState(a: ScrollState, b: ScrollState): boolean {
  return (
    a.section === b.section &&
    a.progress === b.progress &&
    a.color.hue === b.color.hue &&
    a.color.saturation === b.color.saturation &&
    a.color.lightness === b.color.lightness
  );
}

/** HSL to hex, for CSS consumers. */
function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgbNormalized(h, s, l);
  return '#' + [r, g, b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

/** HSL to normalised 0..1 RGB, the form the shader uniforms expect. */
function hslToRgbNormalized(h: number, s: number, l: number): [number, number, number] {
  const saturation = s / 100;
  const lightness = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = saturation * Math.min(lightness, 1 - lightness);
  const f = (n: number) => lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

export function useScrollColor() {
  // One state object, updated at most once per frame: the previous version set
  // three pieces of state on every scroll event, re-rendering the whole gradient
  // tree several times per frame while Lenis was animating.
  const [scrollState, setScrollState] = useState<ScrollState>(() => ({
    color: FRAMES[0].from,
    section: FRAMES[0].id,
    progress: 0,
  }));

  useEffect(() => {
    let frameId = 0;

    const readScrollState = (): ScrollState => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp01(window.scrollY / maxScroll);

      const firstFrame = FRAMES[0];
      const lastFrame = FRAMES[FRAMES.length - 1];

      if (progress <= firstFrame.start) {
        return { color: firstFrame.from, section: firstFrame.id, progress };
      }

      if (progress >= lastFrame.end) {
        return { color: lastFrame.to, section: lastFrame.id, progress };
      }

      const frame = FRAMES.find((f) => progress >= f.start && progress <= f.end) ?? lastFrame;
      const frameRange = Math.max(frame.end - frame.start, 1e-6);
      const localT = clamp01((progress - frame.start) / frameRange);

      return { color: mixColor(frame.from, frame.to, localT), section: frame.id, progress };
    };

    const handleScroll = () => {
      // Coalesce bursts of scroll events into a single update per frame.
      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        frameId = 0;
        const next = readScrollState();
        setScrollState((previous) => (isSameScrollState(previous, next) ? previous : next));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    setScrollState(readScrollState());

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const { color, section, progress } = scrollState;

  // Derived colours are memoised so consumers get stable references and their
  // own effects don't re-run on every unrelated render.
  const currentColorHex = useMemo(
    () => hslToHex(color.hue, color.saturation, color.lightness),
    [color],
  );

  const currentColorRgb = useMemo(
    () => hslToRgbNormalized(color.hue, color.saturation, color.lightness),
    [color],
  );

  return {
    currentColor: color,
    currentColorHex,
    currentColorRgb,
    currentSection: section,
    scrollProgress: progress,
    sections: FRAMES,
  };
}
