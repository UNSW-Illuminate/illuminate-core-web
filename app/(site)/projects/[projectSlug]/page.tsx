import { notFound } from 'next/navigation';
import ProjectPageLayout from '@/app/components/ProjectPageLayout';
import { getAdjacentProjects, getDiscoverMoreProjects, getProjectBySlug, projectPages } from '@/app/projects-data';

type ProjectPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

export function generateStaticParams() {
  return projectPages.map((project) => ({
    projectSlug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectSlug } = await params;
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    notFound();
  }

  const { previousProject, nextProject } = getAdjacentProjects(project.slug);

  return (
    <ProjectPageLayout
      currentSlug={project.slug}
      title={project.title}
      projectType={project.projectType}
      shortDescription={project.shortDescription}
      location={project.location}
      dates={project.dates}
      description={project.description}
      heroImage={project.heroImage}
      galleryImages={project.galleryImages}
      previousProject={previousProject ? { title: previousProject.title, href: `/projects/${previousProject.slug}` } : undefined}
      nextProject={nextProject ? { title: nextProject.title, href: `/projects/${nextProject.slug}` } : undefined}
      discoverMoreProjects={getDiscoverMoreProjects(project.slug)}
    />
  );
}