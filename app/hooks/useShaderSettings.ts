'use client';

import { useState, useEffect } from 'react';

export interface ShaderSettings {
  animationSpeed: number;
  grainIntensity: number;
  circleRadius: number;
  trailDrag: number;
  rippleIntensity: number;
  colorMode: 'spectral' | 'custom';
  spectralHueShift: number;
  spectralScale: number;
  spectralTimeShift: number;
  spectralSaturation: number;
  customColor1: string;
  customColor2: string;
  customColor3: string;
}

export const DEFAULT_SETTINGS: ShaderSettings = {
  animationSpeed: 1.0,
  grainIntensity: 0.05,
  circleRadius: 200,
  trailDrag: 0.04,
  rippleIntensity: 0.4,
  colorMode: 'spectral',
  spectralHueShift: 200,
  spectralScale: 50,
  spectralTimeShift: 80,
  spectralSaturation: 1,
  customColor1: '#000000',
  customColor2: '#ff00cc',
  customColor3: '#ff0000',
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
        const parsed = JSON.parse(stored) as Partial<ShaderSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
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
