import InteractiveGradient from '@/app/components/InteractiveGradient';
import CenterTitle from '@/app/components/CenterTitle';
import ProjectShowcase from '@/app/components/ProjectShowcase';
import ContentContainer from '@/app/components/ui/ContentContainer';
import SectionLabel from '@/app/components/ui/SectionLabel';
import { projectPages } from '@/app/projects-data';

export default function Home() {
  const showcaseProjects = projectPages.map((project) => ({
    slug: project.slug,
    title: project.title,
    projectType: project.projectType,
    shortDescription: project.shortDescription,
    location: project.location,
    dates: project.dates,
    thumbnail: project.heroImage,
  }));

  return (
    <main className="relative w-full">
      <InteractiveGradient />
      <div className="relative z-10 text-white w-full">
        <section className="min-h-screen flex items-center justify-center">
          <CenterTitle />
        </section>

        <section id="projects" className="px-6 py-24 scroll-mt-24 md:px-12 md:py-32 lg:px-20">
          <ContentContainer>
            <div className="mb-12 flex items-baseline justify-between gap-6 md:mb-16">
              <SectionLabel className="text-white/60">Showcase</SectionLabel>
              <SectionLabel className="text-sm">{showcaseProjects.length} projects</SectionLabel>
            </div>

            <ProjectShowcase projects={showcaseProjects} />
          </ContentContainer>
        </section>
      </div>
    </main>
  );
}
