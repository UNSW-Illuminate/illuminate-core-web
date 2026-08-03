import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectPageLayout from '@/app/components/ProjectPageLayout';
import { getAdjacentProjects, getProjectBySlug, projectPages } from '@/app/projects-data';
import { PUBLIC_ROBOTS, SITE_NAME, SITE_URL, absoluteUrl } from '@/app/site-config';

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

export const dynamicParams = false;

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    return {};
  }

  const title = `${project.title} interactive light installation`;
  const canonicalPath = `/${project.slug}`;
  const images = project.heroImage
    ? [{ url: project.heroImage.src, alt: `${project.title} by ${SITE_NAME}` }]
    : undefined;

  return {
    title,
    description: project.shortDescription,
    robots: PUBLIC_ROBOTS,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      locale: 'en_AU',
      url: canonicalPath,
      siteName: SITE_NAME,
      title,
      description: project.shortDescription,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.shortDescription,
      images: project.heroImage ? [project.heroImage.src] : undefined,
    },
  };
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VisualArtwork',
            '@id': `${SITE_URL}/${project.slug}#artwork`,
            name: project.title,
            description: project.shortDescription,
            url: absoluteUrl(`/${project.slug}`),
            image: project.galleryImages.map((image) => absoluteUrl(image.src)),
            artform: project.projectType,
            dateCreated: project.dates,
            locationCreated: {
              '@type': 'Place',
              name: project.location,
            },
            creator: {
              '@id': `${SITE_URL}/#organization`,
            },
            mainEntityOfPage: absoluteUrl(`/${project.slug}`),
          }).replace(/</g, '\\u003c'),
        }}
      />
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
    </>
  );
}
