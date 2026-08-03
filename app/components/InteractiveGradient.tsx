'use client';

import ShaderGradient from './ShaderGradient';
import GrainOverlay from './GrainOverlay';
import { useScrollColor } from '@/app/hooks/useScrollColor';

export default function InteractiveGradient() {
  const { currentColor, currentColorRgb, scrollProgress } = useScrollColor();

  return (
    <>
      <ShaderGradient
        scrollColor={currentColor}
        scrollColorRgb={currentColorRgb}
        scrollProgress={scrollProgress}
      />
      <GrainOverlay />
    </>
  );
}
