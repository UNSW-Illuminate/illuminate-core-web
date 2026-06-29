'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { ProjectPageSeed } from '@/app/projects-data';
import ProjectForm from './ProjectForm';

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

const isSeedArray = (value: unknown): value is ProjectPageSeed[] =>
  Array.isArray(value) && value.every((item) => item !== null && typeof item === 'object' && 'slug' in item);

export default function AdminDashboard({ seed }: { seed: ProjectPageSeed[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectPageSeed[]>(seed);
  const [editing, setEditing] = useState<EditingState>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from this browser's localStorage, falling back to the committed seed.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (isSeedArray(parsed)) setProjects(parsed);
      } catch {
        /* ignore malformed storage; keep the seed */
      }
    }
    hydrated.current = true;
  }, []);

  // Auto-save every change to localStorage (debounced).
  useEffect(() => {
    if (!hydrated.current) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      setSaveStatus('saved');
    }, 250);
    return () => clearTimeout(timeout);
  }, [projects]);

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timeout = setTimeout(() => setSaveStatus('idle'), 1200);
    return () => clearTimeout(timeout);
  }, [saveStatus]);

  const handleSave = (value: ProjectPageSeed) => {
    setProjects((prev) => {
      if (editing?.mode === 'edit') {
        return prev.map((project) => (project.slug === editing.slug ? value : project));
      }
      return [...prev, value];
    });
    setEditing(null);
  };

  const handleDelete = (slug: string, title: string) => {
    if (!window.confirm(`Remove “${title || slug}”? This only affects your local copy.`)) return;
    setProjects((prev) => prev.filter((project) => project.slug !== slug));
  };

  const handleReset = () => {
    if (!window.confirm('Discard local changes and reload the committed projects?')) return;
    setProjects(seed);
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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  if (editing) {
    const initial =
      editing.mode === 'edit'
        ? projects.find((project) => project.slug === editing.slug) ?? BLANK_PROJECT
        : BLANK_PROJECT;
    const existingSlugs = projects
      .filter((project) => !(editing.mode === 'edit' && project.slug === editing.slug))
      .map((project) => project.slug);

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ProjectForm
          initial={initial}
          existingSlugs={existingSlugs}
          isNew={editing.mode === 'new'}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Projects</h1>
          <p className="text-sm text-white/50">{projects.length} project{projects.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs text-white/50 transition-opacity ${saveStatus === 'saved' ? 'opacity-100' : 'opacity-0'}`}>
            Saved locally
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm transition-opacity hover:opacity-80"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mb-6 rounded-xl bg-white/[0.04] p-3 text-xs text-white/50">
        Changes are saved in this browser only and don&apos;t affect the live site. Use{' '}
        <span className="text-white/70">Copy JSON</span> to move them into <span className="text-white/70">app/projects-data.ts</span>{' '}
        or a backend.
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setEditing({ mode: 'new' })}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
        >
          New project
        </button>
        <button onClick={handleCopy} className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-opacity hover:opacity-80">
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
        <button onClick={handleReset} className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-opacity hover:opacity-80">
          Reset to committed
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li
            key={project.slug || project.title}
            className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3 transition-opacity hover:opacity-90"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{project.title || 'Untitled'}</p>
              <p className="truncate text-xs text-white/40">
                /projects/{project.slug} · {project.projectType} · {project.dates}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <a
                href={`/projects/${project.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-white/50 transition-opacity hover:opacity-70"
              >
                View
              </a>
              <button
                onClick={() => setEditing({ mode: 'edit', slug: project.slug })}
                className="text-white/80 transition-opacity hover:opacity-70"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.slug, project.title)}
                className="text-[var(--brand-color)] transition-opacity hover:opacity-70"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="rounded-xl bg-white/[0.03] px-4 py-8 text-center text-sm text-white/40">
            No projects yet. Create one to get started.
          </li>
        )}
      </ul>
    </div>
  );
}
