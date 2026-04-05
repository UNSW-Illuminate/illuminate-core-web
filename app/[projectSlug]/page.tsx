import { notFound } from 'next/navigation';
import ProjectPageLayout from '../components/ProjectPageLayout';
import { getAdjacentProjects, getDiscoverMoreProjects, getProjectBySlug, projectPages } from '../projects-data';

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
      previousProject={previousProject ? { title: previousProject.title, href: `/${previousProject.slug}` } : undefined}
      nextProject={nextProject ? { title: nextProject.title, href: `/${nextProject.slug}` } : undefined}
      discoverMoreProjects={getDiscoverMoreProjects(project.slug)}
    />
  );
}