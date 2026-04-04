import Image from 'next/image';
import AnimatedTextLink from './ui/AnimatedTextLink';
import ContentContainer from './ui/ContentContainer';
import SectionHeading from './ui/SectionHeading';
import SectionLabel from './ui/SectionLabel';

type ProjectImage = {
  src: string;
  alt: string;
};

type DiscoverProject = {
  title: string;
  href?: string;
  type: string;
  shortDescription: string;
};

type ProjectPageLayoutProps = {
  title: string;
  projectType: string;
  shortDescription: string;
  location: string;
  dates: string;
  description: string;
  heroImage?: ProjectImage;
  galleryImages: ProjectImage[];
  discoverMoreProjects: DiscoverProject[];
};

export default function ProjectPageLayout({
  title,
  projectType,
  shortDescription,
  location,
  dates,
  description,
  heroImage,
  galleryImages,
  discoverMoreProjects,
}: ProjectPageLayoutProps) {
  const galleryGroups: ProjectImage[][] = [];

  for (let i = 0; i < galleryImages.length; i += 3) {
    galleryGroups.push(galleryImages.slice(i, i + 3));
  }

  return (
    <main className="min-h-screen  text-white px-6 py-16 md:px-12 lg:px-20">
      <ContentContainer>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-4 md:gap-x-12 lg:gap-x-16">
          <aside className="md:col-span-1">
            <div>
              <SectionLabel className="mt-3 text-lg text-white/95">{projectType}</SectionLabel>
            </div>
          </aside>

          <article className="md:col-span-3">
            <SectionHeading as="h1" className="text-6xl md:text-8xl">{title}</SectionHeading>
          </article>

          <aside className="md:col-span-1">
            <div>
              <p className="mt-3 text-base leading-relaxed text-white/80">{shortDescription}</p>
            </div>
          </aside>

          <article className="md:col-span-3">
            {heroImage && (
              <div className="relative overflow-hidden ">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  width={1800}
                  height={1200}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6 text-base text-white">
              <p>{location}</p>
              <p>{dates}</p>
            </div>

            <div className="mt-8 max-w-4xl text-4xl text-white/92">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </article>
        </div>
      </ContentContainer>

      {galleryImages.length > 0 && (
        <section className="mt-20">
          <ContentContainer>
            <SectionHeading as="h2" className="text-2xl md:text-3xl">Image Gallery</SectionHeading>

            <div className="mt-8 space-y-8">
              {galleryGroups.map((group, groupIndex) => (
                <div key={`${group[0]?.src}-${groupIndex}`} className="space-y-4">
                  {group[0] && (
                    <div className="relative w-full overflow-hidden  ">
                      <Image
                        src={group[0].src}
                        alt={group[0].alt}
                        width={1800}
                        height={1100}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}

                  {group.length > 1 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {group.slice(1).map((image) => (
                        <div key={image.src + image.alt} className="relative overflow-hidden ">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={900}
                            height={650}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ContentContainer>
        </section>
      )}

      <section className="mt-20 pb-8">
        <ContentContainer>
        <SectionHeading as="h2" className="text-2xl md:text-3xl">Discover More</SectionHeading>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {discoverMoreProjects.map((project) => (
            <article
              key={project.title}
              className="bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
            >
              <SectionLabel className="text-sm text-white/55">{project.type}</SectionLabel>
              {project.href ? (
                <AnimatedTextLink href={project.href} className="mt-2 text-2xl font-light text-white hover:text-white/80">
                  {project.title}
                </AnimatedTextLink>
              ) : (
                <SectionHeading as="h3" className="mt-2 text-2xl">{project.title}</SectionHeading>
              )}
              <p className="mt-3 text-sm leading-relaxed text-white/75">{project.shortDescription}</p>
            </article>
          ))}
        </div>
        </ContentContainer>
      </section>
    </main>
  );
}