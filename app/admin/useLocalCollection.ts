'use client';

import { useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'saved';

/**
 * Holds a collection in React state, hydrating from localStorage (falling back
 * to a committed seed) and auto-saving every change back, debounced. Returns a
 * transient "saved" status for UI feedback and a reset-to-seed helper.
 */
export function useLocalCollection<T>(storageKey: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed as T[]);
      } catch {
        /* keep the seed on malformed storage */
      }
    }
    hydrated.current = true;
    // storageKey is stable for the lifetime of a mounted collection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(items));
      setSaveStatus('saved');
    }, 250);
    return () => clearTimeout(timeout);
  }, [items, storageKey]);

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timeout = setTimeout(() => setSaveStatus('idle'), 1400);
    return () => clearTimeout(timeout);
  }, [saveStatus]);

  const reset = () => setItems(seed);

  return { items, setItems, saveStatus, reset };
}
