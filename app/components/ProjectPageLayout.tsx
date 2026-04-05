'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedTextLink from './ui/AnimatedTextLink';
import ButtonLink from './ui/ButtonLink';
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

type ProjectNavItem = {
  title: string;
  href: string;
};

type ProjectPageLayoutProps = {
  currentSlug: string;
  title: string;
  projectType: string;
  shortDescription: string;
  location: string;
  dates: string;
  description: string;
  heroImage?: ProjectImage;
  galleryImages: ProjectImage[];
  previousProject?: ProjectNavItem;
  nextProject?: ProjectNavItem;
  discoverMoreProjects: DiscoverProject[];
};

const enterUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const enterSoft = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

export default function ProjectPageLayout({
  currentSlug,
  title,
  projectType,
  shortDescription,
  location,
  dates,
  description,
  heroImage,
  galleryImages,
  previousProject,
  nextProject,
  discoverMoreProjects,
}: ProjectPageLayoutProps) {
  const galleryGroups: ProjectImage[][] = [];

  for (let i = 0; i < galleryImages.length; i += 3) {
    galleryGroups.push(galleryImages.slice(i, i + 3));
  }

  return (
    <main id="project-top" className="min-h-screen  text-white px-6 py-16 md:px-12 lg:px-20">
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-wrap items-center justify-between gap-4"
        >
          <Link
            href="/"
            aria-label="Return to home"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] text-lg text-white/85 transition-colors hover:bg-white/[0.1]"
          >
            <span aria-hidden="true">&times;</span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {previousProject && previousProject.href !== `/${currentSlug}` ? (
              <div className="w-full sm:w-auto sm:min-w-[168px]">
                <ButtonLink
                  href={previousProject.href}
                  ariaLabel={`Go to previous project: ${previousProject.title}`}
                  title={previousProject.title}
                  variant="arrow"
                  size="small"
                  arrowPlacement="left"
                  className="bg-white/[0.05] hover:bg-white/[0.1]"
                  arrowClassName="bg-white/[0.08]"
                  arrowIconClassName="rotate-180"
                >
                  <span className="text-sm text-white">Previous</span>
                </ButtonLink>
              </div>
            ) : null}

            {nextProject && nextProject.href !== `/${currentSlug}` ? (
              <div className="w-full sm:w-auto sm:min-w-[152px]">
                <ButtonLink
                  href={nextProject.href}
                  ariaLabel={`Go to next project: ${nextProject.title}`}
                  title={nextProject.title}
                  variant="arrow"
                  size="small"
                  className="bg-white/[0.05] hover:bg-white/[0.1]"
                  arrowClassName="bg-white/[0.08]"
                >
                  <span className="text-sm text-white">Next</span>
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </motion.div>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-4 md:gap-x-12 lg:gap-x-16">
          <motion.aside className="md:col-span-1" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <SectionLabel className="mt-3 text-lg text-white/95">{projectType}</SectionLabel>
            </div>
          </motion.aside>

          <motion.article className="md:col-span-3" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <SectionHeading as="h1" className="text-6xl md:text-8xl">{title}</SectionHeading>
          </motion.article>

          <motion.aside className="md:col-span-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <p className="mt-3 text-base leading-relaxed text-white/80">{shortDescription}</p>
            </div>
          </motion.aside>

          <motion.article className="md:col-span-3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}>
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
          </motion.article>
        </div>
      </ContentContainer>

      {galleryImages.length > 0 && (
        <motion.section className="mt-20" {...enterUp}>
          <ContentContainer>
            <SectionHeading as="h2" className="text-2xl md:text-3xl">Image Gallery</SectionHeading>

            <div className="mt-8 space-y-8">
              {galleryGroups.map((group, groupIndex) => (
                <motion.div
                  key={`${group[0]?.src}-${groupIndex}`}
                  className="space-y-4"
                  {...enterSoft}
                  transition={{ duration: 0.75, delay: groupIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
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
                </motion.div>
              ))}
            </div>
          </ContentContainer>
        </motion.section>
      )}

      <motion.section className="mt-20 pb-8" {...enterUp}>
        <ContentContainer>
        <SectionHeading as="h2" className="text-2xl md:text-3xl">Discover More</SectionHeading>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {discoverMoreProjects.map((project) => (
            <motion.article
              key={project.title}
              className="bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
              {...enterSoft}
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
            </motion.article>
          ))}
        </div>
        </ContentContainer>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed bottom-6 right-6 z-20 hidden md:block"
      >
        <div className="pointer-events-auto w-[172px]">
          <ButtonLink
            href="#project-top"
            ariaLabel="Scroll back to top"
            title="Scroll back to top"
            variant="arrow"
            size="small"
            className="bg-white/[0.05] hover:bg-white/[0.1]"
            arrowClassName="bg-white/[0.08]"
            arrowIconClassName="-rotate-90"
            onClick={(event) => {
              event.preventDefault();
              window.dispatchEvent(new Event('lenis-scroll-top'));
            }}
          >
            <span className="text-sm text-white">Scroll Up</span>
          </ButtonLink>
        </div>
      </motion.div>
    </main>
  );
}