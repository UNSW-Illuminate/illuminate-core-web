'use client';

import { useRef, useState } from 'react';
import type { TeamMember } from '@/app/team-data';
import { useLocalCollection } from './useLocalCollection';
import SectionHeader from './SectionHeader';

const STORAGE_KEY = 'illuminate-admin-team';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `m-${Date.now()}`;

const blankMember = (): TeamMember => ({ id: newId(), name: '', role: '' });

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';

const fieldClass =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors focus:border-white/40 focus:outline-none';

export default function TeamSection({ seed }: { seed: TeamMember[] }) {
  const { items: team, setItems: setTeam, saveStatus, reset } = useLocalCollection<TeamMember>(STORAGE_KEY, seed);
  const [draft, setDraft] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setDraft(blankMember());
    setIsNew(true);
    setError(null);
  };

  const openEdit = (member: TeamMember) => {
    setDraft(member);
    setIsNew(false);
    setError(null);
  };

  const handlePhoto = (file: File | undefined) => {
    if (!file || !draft) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('Please choose an image under 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      setDraft((prev) => (prev ? { ...prev, photo: String(reader.result) } : prev));
    };
    reader.onerror = () => setError('Could not read that image. Try a different file.');
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setError('Name is required.');
      return;
    }
    const value: TeamMember = { ...draft, name: draft.name.trim(), role: draft.role.trim() };
    setTeam((prev) => (prev.some((m) => m.id === value.id) ? prev.map((m) => (m.id === value.id ? value : m)) : [...prev, value]));
    setDraft(null);
  };

  const handleDelete = (member: TeamMember) => {
    if (!window.confirm(`Remove ${member.name || 'this member'}?`)) return;
    setTeam((prev) => prev.filter((m) => m.id !== member.id));
  };

  const handleReset = () => {
    if (!window.confirm('Discard local changes and reload the committed team?')) return;
    reset();
    setDraft(null);
  };

  return (
    <div className="px-5 py-6 sm:px-8">
      <SectionHeader
        title="Team"
        subtitle={`${team.length} member${team.length === 1 ? '' : 's'}`}
        saveStatus={saveStatus}
        actions={
          <>
            <button
              onClick={openNew}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
            >
              Add member
            </button>
            <button onClick={handleReset} className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-opacity hover:opacity-80">
              Reset
            </button>
          </>
        }
      />

      <p className="mb-6 rounded-xl bg-white/[0.04] p-3 text-xs text-white/50">
        Members and uploaded photos are saved in this browser only (photos stored as data URLs).
      </p>

      {team.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.03] px-4 py-16 text-center text-sm text-white/40">
          No team members yet. Add your first one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {team.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-2xl bg-white/[0.03]">
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white/[0.04]">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URLs
                  <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-light text-white/30">{initials(member.name)}</span>
                )}
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-medium text-white">{member.name || 'Unnamed'}</p>
                <p className="mt-0.5 truncate text-xs text-white/40">{member.role || 'No role set'}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <button onClick={() => openEdit(member)} className="text-white/80 transition-opacity hover:opacity-70">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="ml-auto text-[var(--brand-color)] transition-opacity hover:opacity-70"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setDraft(null)}>
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-5 text-lg font-medium">{isNew ? 'Add member' : 'Edit member'}</h2>

            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.06]">
                {draft.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URLs
                  <img src={draft.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-light text-white/30">{initials(draft.name)}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-sm transition-opacity hover:opacity-80"
                >
                  {draft.photo ? 'Replace photo' : 'Upload photo'}
                </button>
                {draft.photo && (
                  <button
                    onClick={() => setDraft((prev) => (prev ? { ...prev, photo: undefined } : prev))}
                    className="text-left text-xs text-white/40 transition-opacity hover:opacity-70"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <label className="mb-1.5 block text-xs text-white/40">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
              className={`${fieldClass} mb-4`}
              autoFocus
            />

            <label className="mb-1.5 block text-xs text-white/40">Role</label>
            <input
              value={draft.role}
              onChange={(e) => setDraft((prev) => (prev ? { ...prev, role: e.target.value } : prev))}
              className={fieldClass}
            />

            {error && <p className="mt-3 text-xs text-[var(--brand-color)]">{error}</p>}

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSave}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
              >
                {isNew ? 'Add member' : 'Save'}
              </button>
              <button
                onClick={() => setDraft(null)}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-opacity hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
