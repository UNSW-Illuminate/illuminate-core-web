import { useEffect, useState, useRef } from 'react';

export interface SectionColor {
  hue: number;
  saturation: number;
  lightness: number;
}

interface ScrollSection {
  id: string;
  start: number;
  end: number;
  color: SectionColor;
  name: string;
}

// Define color sections - hue in 0-360 range
const SECTIONS: ScrollSection[] = [
  {
    id: 'hero',
    start: 0,
    end: 1200,
    name: 'Hero',
    color: { hue: 280, saturation: 70, lightness: 50 }, // Purple
  },
  {
    id: 'projects',
    start: 1200,
    end: 3000,
    name: 'Past Projects',
    color: { hue: 20, saturation: 75, lightness: 50 }, // Orange
  },
  {
    id: 'team',
    start: 3000,
    end: 5000,
    name: 'Team',
    color: { hue: 150, saturation: 70, lightness: 50 }, // Cyan/Teal
  },
  {
    id: 'footer',
    start: 5000,
    end: 6000,
    name: 'Footer',
    color: { hue: 260, saturation: 65, lightness: 45 }, // Deep Purple
  },
];

export function useScrollColor() {
  const [currentColor, setCurrentColor] = useState<SectionColor>(SECTIONS[0].color);
  const [currentSection, setCurrentSection] = useState<string>(SECTIONS[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollProgress(scrollY);

      // Find current section and interpolate between colors
      let foundSection = false;
      
      for (let i = 0; i < SECTIONS.length; i++) {
        const section = SECTIONS[i];
        const nextSection = SECTIONS[i + 1];

        if (scrollY >= section.start && scrollY < section.end) {
          setCurrentSection(section.id);
          
          // Interpolate color between current and next section if we're transitioning
          if (nextSection && scrollY > section.start + 100) {
            const sectionRange = section.end - section.start;
            const scrollInSection = scrollY - section.start;
            const transitionStart = sectionRange * 0.7; // Start transitioning at 70% through section

            if (scrollInSection > transitionStart) {
              const transitionProgress = (scrollInSection - transitionStart) / (sectionRange * 0.3);
              const t = Math.min(transitionProgress, 1);
              
              // Interpolate hue (handle wrap-around)
              let hueDiff = nextSection.color.hue - section.color.hue;
              if (hueDiff > 180) hueDiff -= 360;
              if (hueDiff < -180) hueDiff += 360;
              
              const interpolatedColor: SectionColor = {
                hue: (section.color.hue + hueDiff * t + 360) % 360,
                saturation: section.color.saturation + (nextSection.color.saturation - section.color.saturation) * t,
                lightness: section.color.lightness + (nextSection.color.lightness - section.color.lightness) * t,
              };
              
              setCurrentColor(interpolatedColor);
              foundSection = true;
              break;
            }
          }
          
          setCurrentColor(section.color);
          foundSection = true;
          break;
        }
      }

      // If scrolled past all sections, use the last one
      if (!foundSection) {
        const lastSection = SECTIONS[SECTIONS.length - 1];
        setCurrentSection(lastSection.id);
        setCurrentColor(lastSection.color);
      }
    };

    scrollListenerRef.current = handleScroll;
    window.addEventListener('scroll', handleScroll, { passive: true });

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
    sections: SECTIONS,
  };
}
