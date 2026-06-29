'use client';

import type { ProjectPageSeed } from '@/app/projects-data';

export type ProjectFormErrors = Partial<Record<'title' | 'slug', string>>;

type ProjectFormProps = {
  draft: ProjectPageSeed;
  errors: ProjectFormErrors;
  isNew: boolean;
  onChange: <K extends keyof ProjectPageSeed>(key: K, value: ProjectPageSeed[K]) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const fieldClass =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors focus:border-white/40 focus:outline-none';

export default function ProjectForm({ draft, errors, isNew, onChange, onSave, onCancel }: ProjectFormProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Title</label>
          <input value={draft.title} onChange={(e) => onChange('title', e.target.value)} className={fieldClass} />
          {errors.title && <p className="mt-1 text-xs text-[var(--brand-color)]">{errors.title}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center justify-between text-xs text-white/40">
            <span>Slug</span>
            <button
              type="button"
              onClick={() => onChange('slug', slugify(draft.title))}
              className="text-white/40 transition-opacity hover:opacity-70"
            >
              from title
            </button>
          </label>
          <input value={draft.slug} onChange={(e) => onChange('slug', e.target.value)} className={fieldClass} />
          {errors.slug && <p className="mt-1 text-xs text-[var(--brand-color)]">{errors.slug}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Project type</label>
          <input value={draft.projectType} onChange={(e) => onChange('projectType', e.target.value)} className={fieldClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/40">Location</label>
          <input value={draft.location} onChange={(e) => onChange('location', e.target.value)} className={fieldClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-white/40">Dates</label>
          <input value={draft.dates} onChange={(e) => onChange('dates', e.target.value)} className={fieldClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-white/40">Short description</label>
          <input
            value={draft.shortDescription}
            onChange={(e) => onChange('shortDescription', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-white/40">Description (blank line = new paragraph)</label>
          <textarea
            value={draft.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={9}
            className={fieldClass}
          />
        </div>
      </div>

      <p className="text-xs text-white/40">
        Images are read from <span className="text-white/60">public/projectImages/{draft.slug || 'slug'}/</span>{' '}
        (01.webp, 02.webp, …).
      </p>

      <div className="flex gap-2">
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
