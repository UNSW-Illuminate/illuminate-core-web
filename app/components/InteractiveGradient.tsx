'use client';

import ShaderGradient from './ShaderGradient';
import ShaderEditor from './ShaderEditor';
import GrainOverlay from './GrainOverlay';
import { useShaderSettings } from '@/app/hooks/useShaderSettings';
import { useScrollColor } from '@/app/hooks/useScrollColor';

export default function InteractiveGradient() {
  const {
    settings,
    updateSetting,
    replaceSettings,
    resetToDefaults,
    saveStatus,
    isOpen,
    setIsOpen,
  } = useShaderSettings();
  const { currentColor, currentColorRgb, scrollProgress } = useScrollColor();

  return (
    <>
      <ShaderGradient
        settings={settings}
        scrollColor={currentColor}
        scrollColorRgb={currentColorRgb}
        scrollProgress={scrollProgress}
      />
      <GrainOverlay />
      <ShaderEditor
        settings={settings}
        onUpdateSetting={updateSetting}
        onReplaceSettings={replaceSettings}
        onResetDefaults={resetToDefaults}
        saveStatus={saveStatus}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
