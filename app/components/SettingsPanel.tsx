'use client';

import { ShaderSettings } from '@/app/hooks/useShaderSettings';

interface SettingsPanelProps {
  settings: ShaderSettings;
  onUpdateSetting: <K extends keyof ShaderSettings>(key: K, value: ShaderSettings[K]) => void;
  onSaveDefaults: () => void;
  onResetDefaults: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SettingsPanel({
  settings,
  onUpdateSetting,
  onSaveDefaults,
  onResetDefaults,
  isOpen,
  setIsOpen,
}: SettingsPanelProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold flex items-center justify-center cursor-none border border-white/20 transition-all text-[20px]"
        title="Toggle settings"
      >
        ⚙️
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-h-96 overflow-y-auto bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-4">Settings</h2>

          {/* Color Mode */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-2">Color Mode</label>
            <select
              value={settings.colorMode}
              onChange={(e) =>
                onUpdateSetting('colorMode', e.target.value as 'spectral' | 'custom')
              }
              title="Choose color mode: Spectral or Custom"
              className="w-full bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-sm"
            >
              <option value="spectral">Spectral</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom Colors */}
          {settings.colorMode === 'custom' && (
            <>
              <div className="mb-3">
                <label className="text-white text-sm block mb-2">Color 1</label>
                <input
                  type="color"
                  value={settings.customColor1}
                  onChange={(e) => onUpdateSetting('customColor1', e.target.value)}
                  title="Select color 1"
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div className="mb-3">
                <label className="text-white text-sm block mb-2">Color 2</label>
                <input
                  type="color"
                  value={settings.customColor2}
                  onChange={(e) => onUpdateSetting('customColor2', e.target.value)}
                  title="Select color 2"
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div className="mb-4">
                <label className="text-white text-sm block mb-2">Color 3</label>
                <input
                  type="color"
                  value={settings.customColor3}
                  onChange={(e) => onUpdateSetting('customColor3', e.target.value)}
                  title="Select color 3"
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Spectral Controls */}
          {settings.colorMode === 'spectral' && (
            <>
              <div className="mb-4">
                <label className="text-white text-sm block mb-2">
                  Spectral Hue Shift: {settings.spectralHueShift.toFixed(0)}nm
                </label>
                <input
                  type="range"
                  min="-120"
                  max="120"
                  step="1"
                  value={settings.spectralHueShift}
                  onChange={(e) => onUpdateSetting('spectralHueShift', parseFloat(e.target.value))}
                  title="Shift the spectral wavelength center"
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="text-white text-sm block mb-2">
                  Spectral Scale: {settings.spectralScale.toFixed(0)}
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="1"
                  value={settings.spectralScale}
                  onChange={(e) => onUpdateSetting('spectralScale', parseFloat(e.target.value))}
                  title="Control how quickly wavelengths change across the gradient"
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="text-white text-sm block mb-2">
                  Spectral Time Shift: {settings.spectralTimeShift.toFixed(0)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={settings.spectralTimeShift}
                  onChange={(e) => onUpdateSetting('spectralTimeShift', parseFloat(e.target.value))}
                  title="Set temporal wavelength drift amount"
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="text-white text-sm block mb-2">
                  Spectral Saturation: {settings.spectralSaturation.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={settings.spectralSaturation}
                  onChange={(e) => onUpdateSetting('spectralSaturation', parseFloat(e.target.value))}
                  title="Adjust spectral color saturation"
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Animation Speed */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-2">
              Animation Speed: {settings.animationSpeed.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={settings.animationSpeed}
              onChange={(e) => onUpdateSetting('animationSpeed', parseFloat(e.target.value))}
              title="Adjust animation speed"
              className="w-full"
            />
          </div>

          {/* Grain Intensity */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-2">
              Grain Intensity: {settings.grainIntensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={settings.grainIntensity}
              onChange={(e) => onUpdateSetting('grainIntensity', parseFloat(e.target.value))}
              title="Adjust grain intensity"
              className="w-full"
            />
          </div>

          {/* Circle Radius */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-2">
              Circle Radius: {settings.circleRadius}px
            </label>
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={settings.circleRadius}
              onChange={(e) => onUpdateSetting('circleRadius', parseFloat(e.target.value))}
              title="Adjust circle radius"
              className="w-full"
            />
          </div>

          {/* Trail Drag */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-2">
              Cursor Drag: {settings.trailDrag.toFixed(3)}
            </label>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.005"
              value={settings.trailDrag}
              onChange={(e) => onUpdateSetting('trailDrag', parseFloat(e.target.value))}
              title="Adjust cursor drag"
              className="w-full"
            />
          </div>

          {/* Ripple Intensity */}
          <div className="mb-4">
            <label className="text-white text-sm block mb-2">
              Ripple Intensity: {settings.rippleIntensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.rippleIntensity}
              onChange={(e) => onUpdateSetting('rippleIntensity', parseFloat(e.target.value))}
              title="Adjust ripple intensity"
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={onSaveDefaults}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded text-sm transition-all"
            >
              Save Defaults
            </button>
            <button
              onClick={onResetDefaults}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}
