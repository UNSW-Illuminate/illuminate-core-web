import { notFound } from 'next/navigation';
import ProjectPageLayout from '../components/ProjectPageLayout';
import { getDiscoverMoreProjects, getProjectBySlug, projectPages } from '../projects-data';

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

  return (
    <ProjectPageLayout
      title={project.title}
      projectType={project.projectType}
      shortDescription={project.shortDescription}
      location={project.location}
      dates={project.dates}
      description={project.description}
      heroImage={project.heroImage}
      galleryImages={project.galleryImages}
      discoverMoreProjects={getDiscoverMoreProjects(project.slug)}
    />
  );
}