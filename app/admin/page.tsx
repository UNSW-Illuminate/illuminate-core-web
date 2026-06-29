import { projectPages, projectSeeds } from '@/app/projects-data';
import { teamSeed } from '@/app/team-data';
import AdminApp from './AdminApp';

// Access is gated by middleware.ts (redirects to /admin/login without a session).
export default function AdminPage() {
  // Map each project's on-disk gallery image srcs so the client can show
  // thumbnails and previews without filesystem access.
  const imagesBySlug: Record<string, string[]> = Object.fromEntries(
    projectPages.map((project) => [project.slug, project.galleryImages.map((image) => image.src)]),
  );

  return <AdminApp projectSeed={projectSeeds} imagesBySlug={imagesBySlug} teamSeed={teamSeed} />;
}
