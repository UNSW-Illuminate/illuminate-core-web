'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import OtherProjects from './OtherProjects';
import { type ProjectCardItem } from './ProjectCard';
import ButtonLink from './ui/ButtonLink';
import ContentContainer from './ui/ContentContainer';
import ImageLightbox from './ui/ImageLightbox';
import SectionHeading from './ui/SectionHeading';
import SectionLabel from './ui/SectionLabel';
import TransitionLink from './ui/TransitionLink';

type ProjectImage = {
  src: string;
  alt: string;
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
  /** Every project, newest first; the one in view is filtered out downstream. */
  allProjects: ProjectCardItem[];
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

/** Images per gallery block: one full-width image followed by a pair. */
const GALLERY_GROUP_SIZE = 3;

/**
 * Shared affordance for every image that opens the lightbox. Closing the
 * lightbox returns focus to the image that opened it, and the browser's default
 * focus ring reads as a stray selection rectangle around the photo — so the
 * outline is dropped in favour of the same opacity feedback used on hover.
 */
const enlargeableImageClassName =
  'block w-full overflow-hidden transition-opacity hover:opacity-80 focus:outline-none focus-visible:opacity-80';

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
  allProjects,
}: ProjectPageLayoutProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Keep each image's position in the flat gallery list so the lightbox opens
  // on whichever image was clicked and can page through the rest.
  const galleryEntries = galleryImages.map((image, index) => ({ image, index }));

  const galleryGroups = Array.from(
    { length: Math.ceil(galleryEntries.length / GALLERY_GROUP_SIZE) },
    (_, groupIndex) =>
      galleryEntries.slice(groupIndex * GALLERY_GROUP_SIZE, (groupIndex + 1) * GALLERY_GROUP_SIZE),
  );

  const heroIndex = galleryImages.findIndex((image) => image.src === heroImage?.src);

  return (
    <main id="project-top" className="min-h-screen  text-white px-6 pb-16 pt-28 md:px-12 md:pt-32 lg:px-20">
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-wrap items-center justify-between gap-4"
        >
          <TransitionLink
            href="/"
            aria-label="Return to home"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] text-lg text-white/85 transition-colors hover:bg-white/[0.1]"
          >
            <span aria-hidden="true">&times;</span>
          </TransitionLink>

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

          <article className="md:col-span-3">
            {/* The hero deliberately has no entry animation: arriving from a
                project card it is mid-morph (see useViewTransitionNavigate),
                and fading it in would leave a hole where the image should be.
                It is also the largest paint on the page, so it earns its keep
                by showing immediately. */}
            {heroImage && (
              <button
                type="button"
                aria-label={`Enlarge ${heroImage.alt}`}
                className={enlargeableImageClassName}
                data-shared-media={currentSlug}
                onClick={() => setActiveImageIndex(heroIndex === -1 ? 0 : heroIndex)}
              >
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  width={1800}
                  height={1200}
                  className="h-auto w-full object-cover"
                  priority
                />
              </button>
            )}

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-base text-white">
                <p>{location}</p>
                <p>{dates}</p>
              </div>

              <div className="mt-8 max-w-4xl text-4xl text-white/90">
                <p className="whitespace-pre-line">{description}</p>
              </div>
            </motion.div>
          </article>
        </div>
      </ContentContainer>

      {galleryImages.length > 0 && (
        <motion.section className="mt-20" {...enterUp}>
          <ContentContainer>
            <SectionHeading as="h2" className="text-2xl md:text-3xl">Image Gallery</SectionHeading>

            <div className="mt-8 space-y-8">
              {galleryGroups.map((group, groupIndex) => (
                <motion.div
                  key={`${group[0]?.image.src}-${groupIndex}`}
                  className="space-y-4"
                  {...enterSoft}
                  transition={{ duration: 0.75, delay: groupIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {group[0] && (
                    <button
                      type="button"
                      aria-label={`Enlarge ${group[0].image.alt}`}
                      className={enlargeableImageClassName}
                      onClick={() => setActiveImageIndex(group[0].index)}
                    >
                      <Image
                        src={group[0].image.src}
                        alt={group[0].image.alt}
                        width={1800}
                        height={1100}
                        className="h-auto w-full object-cover"
                      />
                    </button>
                  )}

                  {group.length > 1 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {group.slice(1).map(({ image, index }) => (
                        <button
                          key={image.src + image.alt}
                          type="button"
                          aria-label={`Enlarge ${image.alt}`}
                          className={enlargeableImageClassName}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={900}
                            height={650}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ContentContainer>
        </motion.section>
      )}

      <OtherProjects projects={allProjects} currentSlug={currentSlug} />

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

      <ImageLightbox
        images={galleryImages}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        onNavigate={setActiveImageIndex}
      />
    </main>
  );
}