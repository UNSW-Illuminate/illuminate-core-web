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

/**
 * The corner controls float above whatever is scrolling past — often a
 * full-bleed photograph — so each tray carries its own tint and blur to stay
 * readable rather than relying on the page background.
 */
const floatingTrayClassName = 'rounded-full bg-black/50 p-1 backdrop-blur-md';

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

  // A single-project site would otherwise link a project to itself.
  const adjacentPrevious =
    previousProject && previousProject.href !== `/${currentSlug}` ? previousProject : undefined;
  const adjacentNext = nextProject && nextProject.href !== `/${currentSlug}` ? nextProject : undefined;

  return (
    <main id="project-top" className="min-h-screen  text-white px-6 pb-16 pt-28 md:px-12 md:pt-32 lg:px-20">
      <ContentContainer>
        <div className="grid gap-x-10 gap-y-4 md:grid-cols-4 md:gap-x-12 md:gap-y-8 lg:gap-x-16">
          <motion.aside className="order-2 md:order-none md:col-span-1" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <SectionLabel className="text-lg text-white/95 md:mt-3">{projectType}</SectionLabel>
            </div>
          </motion.aside>

          <motion.article className="order-3 md:order-none md:col-span-3" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <SectionHeading as="h1" className="text-6xl md:text-8xl">{title}</SectionHeading>
          </motion.article>

          <motion.aside className="order-4 md:order-none md:col-span-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <p className="text-base leading-relaxed text-white/80 md:mt-3">{shortDescription}</p>
            </div>
          </motion.aside>

          <article className="contents md:col-span-3 md:block">
            {/* The hero deliberately has no entry animation: arriving from a
                project card it is mid-morph (see useViewTransitionNavigate),
                and fading it in would leave a hole where the image should be.
                It is also the largest paint on the page, so it earns its keep
                by showing immediately. */}
            {heroImage && (
              <button
                type="button"
                aria-label={`Enlarge ${heroImage.alt}`}
                className={`${enlargeableImageClassName} order-1 md:order-none`}
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

            <motion.div className="order-5 md:order-none" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex flex-wrap items-center gap-3 text-base text-white md:mt-6 md:gap-6">
                <p>{location}</p>
                <p>{dates}</p>
              </div>

              <div className="mt-5 max-w-4xl text-2xl text-white/90 md:mt-8 md:text-4xl">
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

      {/* App-style controls that hover over the page in the bottom-right corner,
          so moving between projects never means scrolling back to the top. They
          sit over photography, hence the tinted, blurred trays. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed bottom-6 right-6 z-20 flex flex-col items-end gap-2"
      >
        <div className={`pointer-events-auto hidden w-[172px] md:block ${floatingTrayClassName}`}>
          <ButtonLink
            href="#project-top"
            ariaLabel="Scroll back to top"
            title="Scroll back to top"
            variant="arrow"
            size="small"
            arrowClassName="bg-white/[0.12]"
            arrowIconClassName="-rotate-90"
            onClick={(event) => {
              event.preventDefault();
              window.dispatchEvent(new Event('lenis-scroll-top'));
            }}
          >
            <span className="text-sm text-white">Scroll Up</span>
          </ButtonLink>
        </div>

        {(adjacentPrevious || adjacentNext) && (
          <div className={`pointer-events-auto flex items-center gap-1 ${floatingTrayClassName}`}>
            {adjacentPrevious ? (
              <div>
                <ButtonLink
                  href={adjacentPrevious.href}
                  ariaLabel={`Go to previous project: ${adjacentPrevious.title}`}
                  title={adjacentPrevious.title}
                  variant="arrow"
                  size="extraSmall"
                  arrowPlacement="left"
                  arrowClassName="bg-white/[0.12]"
                  arrowIconClassName="rotate-180"
                >
                  <span className="whitespace-nowrap pr-1 text-xs text-white sm:text-sm">Previous</span>
                </ButtonLink>
              </div>
            ) : null}

            {adjacentNext ? (
              <div>
                <ButtonLink
                  href={adjacentNext.href}
                  ariaLabel={`Go to next project: ${adjacentNext.title}`}
                  title={adjacentNext.title}
                  variant="arrow"
                  size="extraSmall"
                  arrowClassName="bg-white/[0.12]"
                >
                  <span className="whitespace-nowrap pl-1 text-xs text-white sm:text-sm">Next</span>
                </ButtonLink>
              </div>
            ) : null}
          </div>
        )}
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
