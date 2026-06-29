'use client';

import { useState } from 'react';
import type { ProjectPageSeed } from '@/app/projects-data';

type ProjectFormProps = {
  initial: ProjectPageSeed;
  /** Slugs belonging to OTHER projects, for uniqueness checks. */
  existingSlugs: string[];
  isNew: boolean;
  onSave: (value: ProjectPageSeed) => void;
  onCancel: () => void;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type Errors = Partial<Record<'title' | 'slug', string>>;

const fieldClass =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none';

export default function ProjectForm({ initial, existingSlugs, isNew, onSave, onCancel }: ProjectFormProps) {
  const [draft, setDraft] = useState<ProjectPageSeed>(initial);
  const [errors, setErrors] = useState<Errors>({});

  const update = <K extends keyof ProjectPageSeed>(key: K, value: ProjectPageSeed[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const validate = (): Errors => {
    const next: Errors = {};
    if (!draft.title.trim()) next.title = 'Title is required.';
    if (!draft.slug.trim()) {
      next.slug = 'Slug is required.';
    } else if (!SLUG_PATTERN.test(draft.slug)) {
      next.slug = 'Use lowercase letters, numbers and hyphens only.';
    } else if (existingSlugs.includes(draft.slug)) {
      next.slug = 'That slug is already used by another project.';
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      onSave({ ...draft, slug: draft.slug.trim(), title: draft.title.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.03] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-medium">{isNew ? 'New project' : `Edit ${initial.title}`}</h2>
        <span className="text-xs text-white/40">/projects/{draft.slug || '…'}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Title</label>
          <input value={draft.title} onChange={(e) => update('title', e.target.value)} className={fieldClass} />
          {errors.title && <p className="mt-1 text-xs text-[var(--brand-color)]">{errors.title}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center justify-between text-xs text-white/40">
            <span>Slug</span>
            <button
              type="button"
              onClick={() => update('slug', slugify(draft.title))}
              className="text-white/40 transition-opacity hover:opacity-70"
            >
              from title
            </button>
          </label>
          <input value={draft.slug} onChange={(e) => update('slug', e.target.value)} className={fieldClass} />
          {errors.slug && <p className="mt-1 text-xs text-[var(--brand-color)]">{errors.slug}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Project type</label>
          <input value={draft.projectType} onChange={(e) => update('projectType', e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Location</label>
          <input value={draft.location} onChange={(e) => update('location', e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Dates</label>
          <input value={draft.dates} onChange={(e) => update('dates', e.target.value)} className={fieldClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-white/40">Short description</label>
          <input
            value={draft.shortDescription}
            onChange={(e) => update('shortDescription', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-white/40">Description (use a blank line for paragraph breaks)</label>
          <textarea
            value={draft.description}
            onChange={(e) => update('description', e.target.value)}
            rows={8}
            className={fieldClass}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-white/40">
        Images are read from <span className="text-white/60">public/projectImages/{draft.slug || 'slug'}/</span> (01.webp,
        02.webp, …) and aren&apos;t edited here.
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
        >
          {isNew ? 'Add project' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-opacity hover:opacity-80"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
