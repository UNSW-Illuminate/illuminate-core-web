'use client';

import { useState, useEffect } from 'react';

export interface ShaderSettings {
  animationSpeed: number;
  grainIntensity: number;
  circleRadius: number;
  trailDrag: number;
  rippleIntensity: number;
  colorMode: 'spectral' | 'custom';
  customColor1: string;
  customColor2: string;
  customColor3: string;
}

export const DEFAULT_SETTINGS: ShaderSettings = {
  animationSpeed: 1.0,
  grainIntensity: 0.15,
  circleRadius: 200,
  trailDrag: 0.04,
  rippleIntensity: 0.3,
  colorMode: 'spectral',
  customColor1: '#FF0000',
  customColor2: '#00FF00',
  customColor3: '#0000FF',
};

const STORAGE_KEY = 'illuminate-settings';

export const useShaderSettings = () => {
  const [settings, setSettings] = useState<ShaderSettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const updateSetting = <K extends keyof ShaderSettings>(key: K, value: ShaderSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveDefaults = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert('Settings saved as default!');
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    settings,
    updateSetting,
    saveDefaults,
    resetToDefaults,
    isOpen,
    setIsOpen,
  };
};
