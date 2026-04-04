'use client';

import ShaderGradient from './ShaderGradient';
import { useShaderSettings } from '@/app/hooks/useShaderSettings';
import { useScrollColor } from '@/app/hooks/useScrollColor';

export default function InteractiveGradient() {
  const { settings } = useShaderSettings();
  const { currentColor, currentColorRgb, scrollProgress } = useScrollColor();

  return (
    <ShaderGradient 
      settings={settings} 
      scrollColor={currentColor}
      scrollColorRgb={currentColorRgb}
      scrollProgress={scrollProgress}
    />
  );
}
