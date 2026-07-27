import { notFound } from 'next/navigation';
import ProjectPageLayout from '@/app/components/ProjectPageLayout';
import { getAdjacentProjects, getProjectBySlug, projectPages } from '@/app/projects-data';

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

  const allProjects = projectPages.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    projectType: entry.projectType,
    location: entry.location,
    dates: entry.dates,
    thumbnail: entry.heroImage,
  }));

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
      allProjects={allProjects}
    />
  );
}