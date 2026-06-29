'use client';

type SliderControlProps = {
  label: string;
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function SliderControl({
  label,
  value,
  defaultValue,
  min,
  max,
  step,
  onChange,
  format,
}: SliderControlProps) {
  const isModified = value !== defaultValue;
  const display = format ? format(value) : String(value);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm text-white/80">{label}</label>
        <div className="flex items-center gap-2">
          {isModified && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              title={`Reset to ${format ? format(defaultValue) : defaultValue}`}
              className="text-xs text-white/40 transition-opacity hover:opacity-70"
            >
              reset
            </button>
          )}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              if (!Number.isNaN(parsed)) onChange(clamp(parsed, min, max));
            }}
            aria-label={`${label} value`}
            className="w-20 rounded border border-white/15 bg-white/5 px-2 py-1 text-right text-xs tabular-nums text-white focus:border-white/40 focus:outline-none"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        title={display}
        className="w-full accent-[var(--brand-color)]"
      />
    </div>
  );
}
