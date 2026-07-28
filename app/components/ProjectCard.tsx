'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';
import TransitionLink from './ui/TransitionLink';

export type ProjectCardItem = {
  slug: string;
  title: string;
  projectType: string;
  location: string;
  dates: string;
  thumbnail?: {
    src: string;
    alt: string;
  };
};

type ProjectCardProps = {
  project: ProjectCardItem;
  /** Size hint matched to the grid the card sits in. */
  sizes?: string;
  /** Stagger offset, in seconds, for the scroll-in animation. */
  delay?: number;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Media frame shared with the featured project on the home showcase. */
export const mediaFrameClassName = 'group/media relative w-full overflow-hidden bg-white/[0.05]';

/**
 * On hover the image grows past its frame and crops against it. Keyed to the
 * media group so pointing at the copy beside a card leaves the image still.
 */
export const mediaImageClassName =
  'object-cover transition-transform duration-700 ease-out group-hover/media:scale-105';

export default function ProjectCard({
  project,
  sizes = '(min-width: 768px) 50vw, 100vw',
  delay = 0,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
    >
      <TransitionLink
        href={`/${project.slug}`}
        sharedMediaSlug={project.slug}
        className="group block"
      >
        <div className={`${mediaFrameClassName} aspect-[4/3]`} data-shared-media={project.slug}>
          {project.thumbnail && (
            <Image
              src={project.thumbnail.src}
              alt={project.thumbnail.alt}
              fill
              sizes={sizes}
              className={mediaImageClassName}
            />
          )}
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-6">
          <SectionHeading as="h3" className="text-3xl md:text-4xl">
            {project.title}
          </SectionHeading>
          <span className="shrink-0 text-sm text-white/50">{project.dates}</span>
        </div>

        <p className="mt-2 text-sm text-white/50 md:text-base">
          {project.projectType} · {project.location}
        </p>
      </TransitionLink>
    </motion.article>
  );
}
