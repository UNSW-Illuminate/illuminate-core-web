'use client';

import Image from 'next/image';
import type { ProjectPageSeed } from '@/app/projects-data';

type ProjectPreviewProps = {
  draft: ProjectPageSeed;
  /** Gallery image srcs for the project (hero is the first). */
  images: string[];
};

// A faithful-but-compact rendering of the real /projects/[slug] page so editors
// can see roughly what they're shipping while they type.
export default function ProjectPreview({ draft, images }: ProjectPreviewProps) {
  const hero = images[0];
  const gallery = images.slice(1);

  return (
    <div className="overflow-hidden rounded-2xl bg-white/[0.03]">
      {/* faux browser chrome */}
      <div className="flex items-center gap-2 bg-white/[0.06] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 truncate text-xs text-white/40">illuminate.unsw / projects / {draft.slug || 'slug'}</span>
      </div>

      <div className="max-h-[70vh] overflow-y-auto bg-black px-6 py-8 text-white">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          <div className="col-span-1 text-sm text-white/60">{draft.projectType || 'Type'}</div>
          <h1 className="col-span-3 text-4xl font-light leading-[1.05] tracking-tight">
            {draft.title || 'Untitled project'}
          </h1>

          <div className="col-span-1" />
          <p className="col-span-3 text-sm leading-relaxed text-white/70">
            {draft.shortDescription || 'Short description appears here.'}
          </p>

          <div className="col-span-4 mt-2">
            {hero ? (
              <Image
                src={hero}
                alt={draft.title}
                width={1200}
                height={800}
                className="h-auto w-full rounded-lg object-cover"
                unoptimized
              />
            ) : (
              <div className="flex aspect-[3/2] w-full items-center justify-center rounded-lg bg-white/[0.04] text-xs text-white/30">
                No hero image — add files to public/projectImages/{draft.slug || 'slug'}/
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-6 text-sm text-white/90">
              {draft.location && <span>{draft.location}</span>}
              {draft.dates && <span>{draft.dates}</span>}
            </div>

            <p className="mt-5 whitespace-pre-line text-lg leading-snug text-white/90">
              {draft.description || 'The full project description renders here.'}
            </p>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-sm text-white/80">Image gallery</p>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={600}
                  height={420}
                  className="h-32 w-full rounded-lg object-cover"
                  unoptimized
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
