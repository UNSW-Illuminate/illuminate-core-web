'use client';

import ShaderGradient from './ShaderGradient';
import SettingsPanel from './SettingsPanel';
import { useShaderSettings } from '@/app/hooks/useShaderSettings';

export default function InteractiveGradient() {
  const {
    settings,
    updateSetting,
    saveDefaults,
    resetToDefaults,
    isOpen,
    setIsOpen,
  } = useShaderSettings();

  return (
    <>
      <ShaderGradient settings={settings} />
      <SettingsPanel
        settings={settings}
        onUpdateSetting={updateSetting}
        onSaveDefaults={saveDefaults}
        onResetDefaults={resetToDefaults}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
