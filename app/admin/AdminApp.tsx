'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ProjectPageSeed } from '@/app/projects-data';
import type { TeamMember } from '@/app/team-data';
import ProjectsSection from './ProjectsSection';
import TeamSection from './TeamSection';

type Section = 'projects' | 'team';

type AdminAppProps = {
  projectSeed: ProjectPageSeed[];
  imagesBySlug: Record<string, string[]>;
  teamSeed: TeamMember[];
};

const navItems: Array<{ id: Section; label: string }> = [
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
];

export default function AdminApp({ projectSeed, imagesBySlug, teamSeed }: AdminAppProps) {
  const router = useRouter();
  const [section, setSection] = useState<Section>('projects');

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 bg-white/[0.02] px-3 py-4 md:w-60 md:py-6">
        <div className="mb-4 px-3">
          <p className="text-sm font-medium text-white">Illuminate</p>
          <p className="text-xs text-white/40">Admin</p>
        </div>

        <nav className="flex gap-1 md:flex-col">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-opacity hover:opacity-80 ${
                section === item.id ? 'bg-white/10 text-white' : 'text-white/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden flex-col gap-1 md:flex">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3 py-2 text-sm text-white/50 transition-opacity hover:opacity-80"
          >
            View site ↗
          </a>
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-left text-sm text-white/50 transition-opacity hover:opacity-80"
          >
            Log out
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="ml-auto rounded-lg bg-white/10 px-3 py-2 text-sm transition-opacity hover:opacity-80 md:hidden"
        >
          Log out
        </button>
      </aside>

      <main className="min-w-0 flex-1">
        {section === 'projects' ? (
          <ProjectsSection seed={projectSeed} imagesBySlug={imagesBySlug} />
        ) : (
          <TeamSection seed={teamSeed} />
        )}
      </main>
    </div>
  );
}
