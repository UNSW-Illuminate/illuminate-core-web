import Image from 'next/image';
import { type TeamMember } from '@/app/team-data';
import SectionHeading from './ui/SectionHeading';

type TeamPortraitProps = {
  member: TeamMember;
  /** Size hint matched to the grid the portrait sits in. */
  sizes: string;
  /** Leads read larger than the rest of the roster. */
  size?: 'feature' | 'regular';
};

/** Falls back to initials so a missing headshot never leaves a hole in the grid. */
function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

export default function TeamPortrait({ member, sizes, size = 'regular' }: TeamPortraitProps) {
  const isFeature = size === 'feature';

  return (
    <figure>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/[0.05]">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill sizes={sizes} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span aria-hidden="true" className="text-5xl font-light text-white/25">
              {initialsOf(member.name)}
            </span>
          </div>
        )}
      </div>

      <figcaption className="mt-5">
        <SectionHeading as="h3" className={isFeature ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}>
          {member.name}
        </SectionHeading>
        <p className="mt-1 text-sm text-white/50 md:text-base">{member.role}</p>
      </figcaption>
    </figure>
  );
}
