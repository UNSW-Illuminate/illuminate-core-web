'use client';

import type { ReactNode } from 'react';
import type { SaveStatus } from './useLocalCollection';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  saveStatus: SaveStatus;
  actions?: ReactNode;
};

export default function SectionHeader({ title, subtitle, saveStatus, actions }: SectionHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium">{title}</h1>
          {saveStatus === 'error' ? (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] text-[var(--brand-color)]"
              title="Browser storage is full — try removing a photo or some members."
            >
              Couldn&apos;t save
            </span>
          ) : (
            <span
              className={`rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/60 transition-opacity ${
                saveStatus === 'saved' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Saved
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
