'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  type SaveStatus,
  type ShaderSettings,
} from '@/app/hooks/useShaderSettings';
import SliderControl from './ui/SliderControl';

type NumericKey = {
  [K in keyof ShaderSettings]: ShaderSettings[K] extends number ? K : never;
}[keyof ShaderSettings];

type Control = {
  key: NumericKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
};

type ControlGroup = {
  title: string;
  controls: Control[];
};

// Slider groups are data-driven so the markup stays declarative and ranges live
// in one place. Spectral controls only apply in spectral colour mode.
const BASE_GROUPS: ControlGroup[] = [
  {
    title: 'Animation & motion',
    controls: [
      { key: 'animationSpeed', label: 'Animation speed', min: 0.1, max: 2, step: 0.1, format: (v) => `${v.toFixed(2)}x` },
      { key: 'rippleIntensity', label: 'Ripple intensity', min: 0, max: 1, step: 0.05, format: (v) => v.toFixed(2) },
    ],
  },
  {
    title: 'Cursor',
    controls: [
      { key: 'circleRadius', label: 'Circle radius', min: 50, max: 400, step: 10, format: (v) => `${v.toFixed(0)}px` },
      { key: 'trailDrag', label: 'Cursor drag', min: 0.01, max: 0.2, step: 0.005, format: (v) => v.toFixed(3) },
    ],
  },
  {
    title: 'Texture',
    controls: [
      { key: 'grainIntensity', label: 'Grain intensity', min: 0, max: 0.5, step: 0.01, format: (v) => v.toFixed(2) },
    ],
  },
];

const SPECTRAL_GROUP: ControlGroup = {
  title: 'Spectral',
  controls: [
    { key: 'spectralHueShift', label: 'Hue shift', min: -120, max: 120, step: 1, format: (v) => `${v.toFixed(0)}nm` },
    { key: 'spectralScale', label: 'Scale', min: 15, max: 120, step: 1, format: (v) => v.toFixed(0) },
    { key: 'spectralTimeShift', label: 'Time shift', min: 0, max: 80, step: 1, format: (v) => v.toFixed(0) },
    { key: 'spectralSaturation', label: 'Saturation', min: 0, max: 2, step: 0.05, format: (v) => v.toFixed(2) },
  ],
};

type ShaderEditorProps = {
  settings: ShaderSettings;
  onUpdateSetting: <K extends keyof ShaderSettings>(key: K, value: ShaderSettings[K]) => void;
  onReplaceSettings: (value: unknown) => void;
  onResetDefaults: () => void;
  saveStatus: SaveStatus;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const colorFields: Array<{ key: 'customColor1' | 'customColor2' | 'customColor3'; label: string }> = [
  { key: 'customColor1', label: 'Colour 1' },
  { key: 'customColor2', label: 'Colour 2' },
  { key: 'customColor3', label: 'Colour 3' },
];

export default function ShaderEditor({
  settings,
  onUpdateSetting,
  onReplaceSettings,
  onResetDefaults,
  saveStatus,
  isOpen,
  setIsOpen,
}: ShaderEditorProps) {
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Open automatically from a shareable URL (?editor or #editor), which works
  // everywhere and takes deliberate intent. The Cmd/Ctrl+. toggle is a
  // development convenience only — on the live site a visitor pressing it
  // should not surface an internal tool. Escape always closes.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('editor') || window.location.hash === '#editor') {
      setIsOpen(true);
    }

    const shortcutEnabled = process.env.NODE_ENV !== 'production';

    const onKeyDown = (event: KeyboardEvent) => {
      if (shortcutEnabled && (event.metaKey || event.ctrlKey) && event.key === '.') {
        event.preventDefault();
        setIsOpen((open) => !open);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setIsOpen]);

  if (!isOpen) return null;

  const groups = settings.colorMode === 'spectral' ? [...BASE_GROUPS, SPECTRAL_GROUP] : BASE_GROUPS;

  // Unknown or malformed fields are filled from the defaults by coerceSettings,
  // so a partial paste applies what it can rather than being rejected.
  const handleApply = () => {
    try {
      onReplaceSettings(JSON.parse(importText));
      setImportError(null);
      setImportOpen(false);
      setImportText('');
    } catch {
      setImportError('That is not valid JSON.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-2xl bg-black/85 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="text-base font-medium text-white">Shader editor</h2>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs transition-opacity ${saveStatus === 'saved' ? 'text-white/60 opacity-100' : 'opacity-0'}`}
          >
            Saved
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Close (Esc)"
            aria-label="Close editor"
            className="text-white/60 transition-opacity hover:opacity-70"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="mb-5">
          <label className="mb-2 block text-xs text-white/40">Colour mode</label>
          <select
            value={settings.colorMode}
            onChange={(e) => onUpdateSetting('colorMode', e.target.value === 'custom' ? 'custom' : 'spectral')}
            aria-label="Colour mode"
            className="w-full rounded border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-white/40 focus:outline-none"
          >
            <option value="spectral">Spectral</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {settings.colorMode === 'custom' && (
          <div className="mb-5">
            <span className="mb-3 block text-xs text-white/40">Custom colours</span>
            {colorFields.map(({ key, label }) => (
              <div key={key} className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm text-white/80">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings[key]}
                    onChange={(e) => onUpdateSetting(key, e.target.value)}
                    aria-label={`${label} hex`}
                    className="w-24 rounded border border-white/15 bg-white/5 px-2 py-1 text-right text-xs tabular-nums text-white focus:border-white/40 focus:outline-none"
                  />
                  <input
                    type="color"
                    value={settings[key]}
                    onChange={(e) => onUpdateSetting(key, e.target.value)}
                    aria-label={`${label} picker`}
                    className="h-7 w-9 cursor-pointer rounded bg-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {groups.map((group) => (
          <div key={group.title} className="mb-5">
            <span className="mb-3 block text-xs text-white/40">{group.title}</span>
            {group.controls.map((control) => (
              <SliderControl
                key={control.key}
                label={control.label}
                value={settings[control.key]}
                defaultValue={DEFAULT_SETTINGS[control.key]}
                min={control.min}
                max={control.max}
                step={control.step}
                format={control.format}
                onChange={(value) => onUpdateSetting(control.key, value)}
              />
            ))}
          </div>
        ))}

        {importOpen && (
          <div className="mb-4">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste settings JSON…"
              rows={5}
              className="w-full rounded border border-white/15 bg-white/5 px-2 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
            />
            {importError && <p className="mt-1 text-xs text-[var(--brand-color)]">{importError}</p>}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 rounded bg-white/20 px-3 py-2 text-sm text-white transition-opacity hover:opacity-80"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportOpen(false);
                  setImportError(null);
                }}
                className="flex-1 rounded bg-white/10 px-3 py-2 text-sm text-white transition-opacity hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={onResetDefaults}
          className="flex-1 rounded bg-white/10 px-3 py-2 text-sm text-white transition-opacity hover:opacity-80"
        >
          Reset all
        </button>
        <button
          type="button"
          onClick={() => setImportOpen((open) => !open)}
          className="flex-1 rounded bg-white/10 px-3 py-2 text-sm text-white transition-opacity hover:opacity-80"
        >
          Apply JSON
        </button>
      </div>
    </div>
  );
}
