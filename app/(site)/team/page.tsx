import type { Metadata } from 'next';
import InteractiveGradient from '@/app/components/InteractiveGradient';
import TeamPortrait from '@/app/components/TeamPortrait';
import ButtonLink from '@/app/components/ui/ButtonLink';
import ContentContainer from '@/app/components/ui/ContentContainer';
import RevealOnScroll from '@/app/components/ui/RevealOnScroll';
import SectionHeading from '@/app/components/ui/SectionHeading';
import SectionLabel from '@/app/components/ui/SectionLabel';
import { DEFAULT_SOCIAL_IMAGE, PUBLIC_ROBOTS, SITE_NAME } from '@/app/site-config';
import { portfolios, teamSeed } from '@/app/team-data';

export const metadata: Metadata = {
  title: 'The team',
  description:
    'The students behind UNSW Illuminate: project leads, technical leads, and the art & design, mechanical, electrical, and software portfolios that build each installation.',
  robots: PUBLIC_ROBOTS,
  alternates: {
    canonical: '/team',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/team',
    siteName: SITE_NAME,
    title: 'The team behind UNSW Illuminate',
    description:
      'Meet the UNSW students who design, engineer, and build our interactive light installations.',
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        alt: 'An interactive light installation by UNSW Illuminate',
      },
    ],
  },
};

export default function TeamPage() {
  const leadership = teamSeed.filter((member) => member.group === 'leadership');
  const technicalLeads = teamSeed.filter((member) => member.group === 'technical');
  const members = teamSeed.filter((member) => member.group === 'members');

  return (
    <main className="relative w-full">
      <InteractiveGradient />

      <div className="relative z-10 w-full px-6 py-24 text-white md:px-12 md:py-32 lg:px-20">
        <ContentContainer>
          <RevealOnScroll>
            <SectionLabel>The team</SectionLabel>
            <SectionHeading as="h1" className="mt-6 max-w-4xl text-6xl leading-[0.95] md:text-8xl">
              The students behind every installation.
            </SectionHeading>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              Illuminate is run entirely by UNSW students across four distinct portfolios.
            </p>
          </RevealOnScroll>
        </ContentContainer>

        <section className="mt-24 md:mt-36">
          <ContentContainer>
            <RevealOnScroll>
              <SectionLabel>Leadership</SectionLabel>
            </RevealOnScroll>

            <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-12 lg:max-w-4xl">
              {leadership.map((member, index) => (
                <RevealOnScroll key={member.id} delay={index * 0.08}>
                  <TeamPortrait
                    member={member}
                    size="feature"
                    sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                  />
                </RevealOnScroll>
              ))}
            </div>
          </ContentContainer>
        </section>

        <section className="mt-24 md:mt-36">
          <ContentContainer>
            <RevealOnScroll>
              <SectionLabel>Technical leads</SectionLabel>
            </RevealOnScroll>

            <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
              {technicalLeads.map((member, index) => (
                <RevealOnScroll key={member.id} delay={(index % 3) * 0.08}>
                  <TeamPortrait
                    member={member}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </RevealOnScroll>
              ))}
            </div>
          </ContentContainer>
        </section>

        <section id="portfolios" className="mt-28 scroll-mt-24 md:mt-44">
          <ContentContainer>
            <RevealOnScroll>
              <SectionLabel>Portfolios</SectionLabel>
              <SectionHeading as="h2" className="mt-6 max-w-3xl text-4xl md:text-6xl">
                The four portfolios.
              </SectionHeading>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Every member joins a portfolio, and every project draws on all four.
              </p>
            </RevealOnScroll>

            <div className="mt-14 md:mt-20">
              {portfolios.map((portfolio, index) => (
                <RevealOnScroll key={portfolio.id} delay={0.04}>
                  <div className="grid gap-2 py-10 md:grid-cols-[auto_1fr_1.4fr] md:items-baseline md:gap-12 md:py-14">
                    <p className="text-sm text-white/35 md:text-base">
                      {String(index + 1).padStart(2, '0')}
                    </p>

                    <SectionHeading as="h3" className="text-3xl md:text-4xl">
                      {portfolio.name}
                    </SectionHeading>

                    <p className="text-lg text-white/50">{portfolio.tagline}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </ContentContainer>
        </section>

        {members.length > 0 && (
          <section className="mt-24 md:mt-36">
            <ContentContainer>
              <RevealOnScroll>
                <SectionLabel>Members</SectionLabel>
             
              </RevealOnScroll>

              <RevealOnScroll delay={0.08}>
                <ul className="mt-10 grid gap-x-8 gap-y-4 text-xl text-white/90 sm:grid-cols-2 md:mt-14 md:text-2xl lg:grid-cols-3">
                  {members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </ul>
              </RevealOnScroll>
            </ContentContainer>
          </section>
        )}

        <section className="mt-28 md:mt-44">
          <ContentContainer>
            <RevealOnScroll>
              <SectionHeading as="h2" className="max-w-3xl text-4xl md:text-6xl">
                Join next year&rsquo;s team.
              </SectionHeading>
             

              <div className="mt-8 w-full sm:w-[260px]">
                <ButtonLink
                  href="/contact"
                  ariaLabel="Read about joining Illuminate"
                  title="Join Illuminate"
                  variant="arrow"
                  className="bg-white/[0.05] hover:bg-white/[0.1]"
                  arrowClassName="bg-white/[0.08]"
                >
                  <span className="text-base text-white">Join Illuminate</span>
                </ButtonLink>
              </div>
            </RevealOnScroll>
          </ContentContainer>
        </section>
      </div>
    </main>
  );
}
