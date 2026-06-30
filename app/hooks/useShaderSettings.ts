'use client';

import { useState, useEffect, useRef } from 'react';

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

// Coerce an untrusted object (parsed JSON / localStorage) into valid settings by
// keeping only known keys whose type matches the default, merged over the defaults.
const coerceSettings = (value: unknown): ShaderSettings => {
  const next: ShaderSettings = { ...DEFAULT_SETTINGS };
  if (value === null || typeof value !== 'object') return next;
  const source = value as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof ShaderSettings>) {
    const candidate = source[key];
    if (key === 'colorMode') {
      if (candidate === 'spectral' || candidate === 'custom') next.colorMode = candidate;
    } else if (typeof candidate === typeof DEFAULT_SETTINGS[key]) {
      // numbers and colour strings carry through once the primitive type matches
      (next[key] as ShaderSettings[typeof key]) = candidate as ShaderSettings[typeof key];
    }
  }
  return next;
};

export type SaveStatus = 'idle' | 'saved';

export const useShaderSettings = () => {
  const [settings, setSettings] = useState<ShaderSettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const hydrated = useRef(false);

  // Load persisted settings once on mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(coerceSettings(JSON.parse(stored)));
      } catch (e) {
        console.error('Failed to load shader settings:', e);
      }
    }
    hydrated.current = true;
  }, []);

  // Auto-save on every change (debounced), once the initial load has happened so
  // we never overwrite stored values with the defaults during hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaveStatus('saved');
      } catch (e) {
        // e.g. private-browsing storage limits — keep the in-memory settings.
        console.error('Could not persist shader settings:', e);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [settings]);

  // Clear the transient "saved" flash a moment after the last save.
  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timeout = setTimeout(() => setSaveStatus('idle'), 1200);
    return () => clearTimeout(timeout);
  }, [saveStatus]);

  const updateSetting = <K extends keyof ShaderSettings>(key: K, value: ShaderSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const replaceSettings = (value: unknown) => {
    setSettings(coerceSettings(value));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    replaceSettings,
    resetToDefaults,
    isOpen,
    setIsOpen,
    saveStatus,
  };
};
