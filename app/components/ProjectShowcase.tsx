'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { trackProjectSelection } from '@/app/analytics';
import TransitionLink from './ui/TransitionLink';
import ProjectCard, {
  mediaFrameClassName,
  mediaImageClassName,
  type ProjectCardItem,
} from './ProjectCard';
import SectionHeading from './ui/SectionHeading';
import SectionLabel from './ui/SectionLabel';

export type ProjectShowcaseItem = ProjectCardItem & {
  shortDescription: string;
};

type ProjectShowcaseProps = {
  /** Newest first — the first entry becomes the featured installation. */
  projects: ProjectShowcaseItem[];
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const enterUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
} as const;

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [featured, ...archive] = projects;

  if (!featured) {
    return null;
  }

  return (
    <div className="w-full">
      <motion.article {...enterUp} transition={{ duration: 0.8, ease: easeOut }}>
        <TransitionLink
          href={`/${featured.slug}`}
          sharedMediaSlug={featured.slug}
          className="group block"
          onClick={() =>
            trackProjectSelection({
              projectSlug: featured.slug,
              projectTitle: featured.title,
              sourceSurface: 'featured',
              position: 1,
            })
          }
        >
          <div
            className={`${mediaFrameClassName} aspect-[4/5] md:aspect-[16/9]`}
            data-shared-media={featured.slug}
          >
            {featured.thumbnail && (
              <Image
                src={featured.thumbnail.src}
                alt={featured.thumbnail.alt}
                fill
                priority
                sizes="(min-width: 1280px) 1280px, 100vw"
                className={mediaImageClassName}
              />
            )}

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-5 gap-y-1 p-6 text-sm text-white/75 md:p-10 md:text-base">
              <span className="text-white">Latest installation</span>
              <span>{featured.location}</span>
              <span>{featured.dates}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-16">
            <SectionHeading as="h3" className="text-6xl leading-[0.95] md:text-8xl lg:text-9xl">
              {featured.title}
            </SectionHeading>

            <div>
              <p className="max-w-md text-lg leading-relaxed text-white/80 md:text-xl">
                {featured.shortDescription}
              </p>
              <span className="mt-6 inline-flex items-center text-base text-white">
                <span className="relative inline-flex">
                  View project
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-full mt-[0.12em] h-0.5 w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100"
                  />
                </span>

                <span className="ml-3 flex shrink-0 items-center justify-center">
                  <Image
                    src="/icons/arrow-right.svg"
                    alt=""
                    width={18}
                    height={18}
                    aria-hidden="true"
                    className="h-[18px] w-[18px] brightness-0 invert transition-transform duration-300 ease-out group-hover:translate-x-1"
                  />
                </span>
              </span>
            </div>
          </div>
        </TransitionLink>
      </motion.article>

      {archive.length > 0 && (
        <div className="mt-28 md:mt-40">
          <SectionLabel>Earlier installations</SectionLabel>

          <div className="mt-8 grid gap-x-8 gap-y-16 md:mt-12 md:grid-cols-2 md:gap-y-24">
            {archive.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                sourceSurface="archive"
                position={index + 1}
                delay={(index % 2) * 0.08}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
