'use client';

import { useState, useEffect, useRef } from 'react';

export type ShaderSettings = {
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
};

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

// Narrowing guard for inspecting untrusted input without an `as` cast.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const numberOr = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const stringOr = (value: unknown, fallback: string) =>
  typeof value === 'string' ? value : fallback;

// Build valid settings from untrusted input (parsed JSON / localStorage), reading
// each known field with a type guard and filling any gaps from the defaults.
const coerceSettings = (value: unknown): ShaderSettings => {
  if (!isRecord(value)) return { ...DEFAULT_SETTINGS };
  return {
    animationSpeed: numberOr(value.animationSpeed, DEFAULT_SETTINGS.animationSpeed),
    grainIntensity: numberOr(value.grainIntensity, DEFAULT_SETTINGS.grainIntensity),
    circleRadius: numberOr(value.circleRadius, DEFAULT_SETTINGS.circleRadius),
    trailDrag: numberOr(value.trailDrag, DEFAULT_SETTINGS.trailDrag),
    rippleIntensity: numberOr(value.rippleIntensity, DEFAULT_SETTINGS.rippleIntensity),
    colorMode: value.colorMode === 'custom' ? 'custom' : 'spectral',
    spectralHueShift: numberOr(value.spectralHueShift, DEFAULT_SETTINGS.spectralHueShift),
    spectralScale: numberOr(value.spectralScale, DEFAULT_SETTINGS.spectralScale),
    spectralTimeShift: numberOr(value.spectralTimeShift, DEFAULT_SETTINGS.spectralTimeShift),
    spectralSaturation: numberOr(value.spectralSaturation, DEFAULT_SETTINGS.spectralSaturation),
    customColor1: stringOr(value.customColor1, DEFAULT_SETTINGS.customColor1),
    customColor2: stringOr(value.customColor2, DEFAULT_SETTINGS.customColor2),
    customColor3: stringOr(value.customColor3, DEFAULT_SETTINGS.customColor3),
  };
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
