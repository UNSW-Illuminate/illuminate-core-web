'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProjectPageSeed } from '@/app/projects-data';
import { useLocalCollection } from './useLocalCollection';
import ProjectForm, { type ProjectFormErrors, SLUG_PATTERN } from './ProjectForm';
import ProjectPreview from './ProjectPreview';
import SectionHeader from './SectionHeader';

const STORAGE_KEY = 'illuminate-admin-projects';

const BLANK_PROJECT: ProjectPageSeed = {
  slug: '',
  title: '',
  projectType: 'Installation',
  shortDescription: '',
  location: '',
  dates: '',
  description: '',
};

type EditingState = { mode: 'new' } | { mode: 'edit'; slug: string } | null;

type ProjectsSectionProps = {
  seed: ProjectPageSeed[];
  imagesBySlug: Record<string, string[]>;
};

export default function ProjectsSection({ seed, imagesBySlug }: ProjectsSectionProps) {
  const { items: projects, setItems: setProjects, saveStatus, reset } = useLocalCollection<ProjectPageSeed>(
    STORAGE_KEY,
    seed,
  );
  const [editing, setEditing] = useState<EditingState>(null);
  const [draft, setDraft] = useState<ProjectPageSeed>(BLANK_PROJECT);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [copied, setCopied] = useState(false);

  const openNew = () => {
    setDraft(BLANK_PROJECT);
    setErrors({});
    setEditing({ mode: 'new' });
  };

  const openEdit = (project: ProjectPageSeed) => {
    setDraft(project);
    setErrors({});
    setEditing({ mode: 'edit', slug: project.slug });
  };

  const changeDraft = <K extends keyof ProjectPageSeed>(key: K, value: ProjectPageSeed[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const otherSlugs = projects
      .filter((p) => !(editing?.mode === 'edit' && p.slug === editing.slug))
      .map((p) => p.slug);

    const nextErrors: ProjectFormErrors = {};
    if (!draft.title.trim()) nextErrors.title = 'Title is required.';
    if (!draft.slug.trim()) nextErrors.slug = 'Slug is required.';
    else if (!SLUG_PATTERN.test(draft.slug)) nextErrors.slug = 'Lowercase letters, numbers and hyphens only.';
    else if (otherSlugs.includes(draft.slug)) nextErrors.slug = 'That slug is already used.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const value: ProjectPageSeed = { ...draft, slug: draft.slug.trim(), title: draft.title.trim() };
    setProjects((prev) =>
      editing?.mode === 'edit' ? prev.map((p) => (p.slug === editing.slug ? value : p)) : [...prev, value],
    );
    setEditing(null);
  };

  const handleDelete = (project: ProjectPageSeed) => {
    if (!window.confirm(`Remove “${project.title || project.slug}”? This only affects your local copy.`)) return;
    setProjects((prev) => prev.filter((p) => p.slug !== project.slug));
  };

  const handleReset = () => {
    if (!window.confirm('Discard local changes and reload the committed projects?')) return;
    reset();
    setEditing(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  if (editing) {
    const previewImages = imagesBySlug[draft.slug] ?? [];
    return (
      <div className="px-5 py-6 sm:px-8">
        <button
          onClick={() => setEditing(null)}
          className="mb-5 text-sm text-white/50 transition-opacity hover:opacity-70"
        >
          ← Back to projects
        </button>
        <h1 className="mb-6 text-2xl font-medium">{editing.mode === 'new' ? 'New project' : `Edit ${draft.title || 'project'}`}</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <ProjectForm
            draft={draft}
            errors={errors}
            isNew={editing.mode === 'new'}
            onChange={changeDraft}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="mb-3 text-xs text-white/30">Live preview</p>
            <ProjectPreview draft={draft} images={previewImages} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 sm:px-8">
      <SectionHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length === 1 ? '' : 's'}`}
        saveStatus={saveStatus}
        actions={
          <>
            <button
              onClick={openNew}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
            >
              New project
            </button>
            <button onClick={handleCopy} className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-opacity hover:opacity-80">
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button onClick={handleReset} className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-opacity hover:opacity-80">
              Reset
            </button>
          </>
        }
      />

      <p className="mb-6 rounded-xl bg-white/[0.04] p-3 text-xs text-white/50">
        Changes save to this browser only and don&apos;t affect the live site. Use Copy JSON to move them into{' '}
        <span className="text-white/70">app/projects-data.ts</span>.
      </p>

      {projects.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.03] px-4 py-16 text-center text-sm text-white/40">
          No projects yet. Create your first one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const thumb = imagesBySlug[project.slug]?.[0];
            const count = imagesBySlug[project.slug]?.length ?? 0;
            return (
              <article key={project.slug || project.title} className="group overflow-hidden rounded-2xl bg-white/[0.03]">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-white/[0.04]">
                  {thumb ? (
                    <Image src={thumb} alt={project.title} fill sizes="360px" className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/25">No image</div>
                  )}
                  {count > 0 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] text-white/80">
                      {count} image{count === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate text-sm font-medium text-white">{project.title || 'Untitled'}</p>
                  <p className="mt-0.5 truncate text-xs text-white/40">
                    {project.projectType}
                    {project.dates ? ` · ${project.dates}` : ''}
                    {project.location ? ` · ${project.location}` : ''}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <button onClick={() => openEdit(project)} className="text-white/80 transition-opacity hover:opacity-70">
                      Edit
                    </button>
                    <a
                      href={`/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/50 transition-opacity hover:opacity-70"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(project)}
                      className="ml-auto text-[var(--brand-color)] transition-opacity hover:opacity-70"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
