'use client';

import ProjectCard, { type ProjectCardItem } from './ProjectCard';
import ContentContainer from './ui/ContentContainer';
import SectionLabel from './ui/SectionLabel';

type OtherProjectsProps = {
  /** Every project, newest first — the one in view is filtered out here. */
  projects: ProjectCardItem[];
  currentSlug: string;
};

export default function OtherProjects({ projects, currentSlug }: OtherProjectsProps) {
  const otherProjects = projects.filter((project) => project.slug !== currentSlug);

  if (otherProjects.length === 0) {
    return null;
  }

  return (
    <section className="mt-28 md:mt-40">
      <ContentContainer>
        <SectionLabel>Other projects</SectionLabel>

        <div className="mt-8 grid gap-x-8 gap-y-16 sm:grid-cols-2 md:mt-12 md:gap-y-20 lg:grid-cols-3">
          {otherProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              sourceSurface="other_projects"
              position={index + 1}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              delay={(index % 3) * 0.08}
            />
          ))}
        </div>
      </ContentContainer>
    </section>
  );
}
