import type { Metadata } from 'next';
import InteractiveGradient from '@/app/components/InteractiveGradient';
import AnimatedTextLink from '@/app/components/ui/AnimatedTextLink';
import ButtonLink from '@/app/components/ui/ButtonLink';
import ContentContainer from '@/app/components/ui/ContentContainer';
import RevealOnScroll from '@/app/components/ui/RevealOnScroll';
import SectionHeading from '@/app/components/ui/SectionHeading';
import SectionLabel from '@/app/components/ui/SectionLabel';
import { DEFAULT_SOCIAL_IMAGE, PUBLIC_ROBOTS, SITE_NAME } from '@/app/site-config';
import { portfolios } from '@/app/team-data';

export const metadata: Metadata = {
  title: 'Contact and join',
  description: 'How to join UNSW Illuminate as a member, how to sponsor a build, and how to reach us.',
  robots: PUBLIC_ROBOTS,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/contact',
    siteName: SITE_NAME,
    title: 'Contact and join UNSW Illuminate',
    description:
      'Join the student team, sponsor an interactive installation, or get in touch with UNSW Illuminate.',
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        alt: 'An interactive light installation by UNSW Illuminate',
      },
    ],
  },
};

const CONTACT_EMAIL = 'unswilluminate@gmail.com';

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/unswilluminate/' },
  { name: 'Facebook', href: 'https://www.facebook.com/unsw.illuminate/' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/project-illuminate/?originalSubdomain=au',
  },
];

export default function ContactPage() {
  const involvement = [
    {
      id: 'members',
      label: 'For students',
      title: 'Join the society',
      body: 'We take on new members every year, across all four portfolios, and we assume no experience in any of them. What we ask for is time and turning up: an installation is months of design reviews, workshop nights, and testing before anyone sees a single light. Tell us which portfolio interests you and what you would like to learn, and we will point you at the next intake.',
      action: { label: 'Email us about joining', href: `mailto:${CONTACT_EMAIL}?subject=Joining%20UNSW%20Illuminate` },
    },
    {
      id: 'sponsors',
      label: 'For sponsors',
      title: 'Back a build',
      body: 'Our installations are funded and equipped by organisations who supply materials, fabrication time, electronics, or money. In return, your name sits on a piece that thousands of people walk through over a festival season, in front of an audience of students who are about to graduate into your industry. We are happy to put together a proposal for a specific project.',
      action: { label: 'Request a sponsorship pack', href: `mailto:${CONTACT_EMAIL}?subject=Sponsoring%20UNSW%20Illuminate` },
    },
  ];

  return (
    <main className="relative w-full">
      <InteractiveGradient />

      <div className="relative z-10 w-full px-6 py-24 text-white md:px-12 md:py-32 lg:px-20">
        <ContentContainer>
          <RevealOnScroll>
            <SectionLabel>Contact</SectionLabel>
            <SectionHeading as="h1" className="mt-6 max-w-4xl text-6xl leading-[0.95] md:text-8xl">
              Come and build something that glows.
            </SectionHeading>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              UNSW Illuminate is a student society that designs and builds large-scale interactive
              light installations — pieces you walk into, touch, and change by being there. Whether
              you want to build one with us or help fund the next one, this page is the right door.
            </p>

            <div className="mt-10 w-full sm:w-[320px]">
              <ButtonLink
                href={`mailto:${CONTACT_EMAIL}`}
                ariaLabel={`Email Illuminate at ${CONTACT_EMAIL}`}
                title="Email Illuminate"
                variant="arrow"
                className="bg-white/[0.05] hover:bg-white/[0.1]"
                arrowClassName="bg-white/[0.08]"
              >
                <span className="text-base text-white">{CONTACT_EMAIL}</span>
              </ButtonLink>
            </div>
          </RevealOnScroll>
        </ContentContainer>

        <section className="mt-24 md:mt-36">
          <ContentContainer>
            <RevealOnScroll>
              <SectionLabel>Get involved</SectionLabel>
            </RevealOnScroll>

            <div className="mt-10 md:mt-14">
              {involvement.map((item, index) => (
                <RevealOnScroll key={item.id} delay={index * 0.06}>
                  <div className="grid gap-6 py-10 md:grid-cols-[1fr_1.6fr] md:gap-16 md:py-14">
                    <div>
                      <p className="text-sm text-white/45">{item.label}</p>
                      <SectionHeading as="h3" className="mt-3 text-3xl md:text-4xl">
                        {item.title}
                      </SectionHeading>
                    </div>

                    <div>
                      <p className="max-w-2xl text-lg leading-relaxed text-white/80">{item.body}</p>

                      {item.id === 'members' && (
                        <p className="mt-6 text-base text-white/60">
                          Portfolios: {portfolios.map((portfolio) => portfolio.name).join(' · ')}.{' '}
                          <AnimatedTextLink
                            href="/team#portfolios"
                            className="text-white/85 transition-colors hover:text-white"
                          >
                            Read what each one does
                          </AnimatedTextLink>
                        </p>
                      )}

                      <div className="mt-8 w-full sm:w-[330px]">
                        <ButtonLink
                          href={item.action.href}
                          ariaLabel={item.action.label}
                          title={item.action.label}
                          variant="arrow"
                          size="small"
                          className="bg-white/[0.05] hover:bg-white/[0.1]"
                          arrowClassName="bg-white/[0.08]"
                        >
                          <span className="text-sm text-white">{item.action.label}</span>
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </ContentContainer>
        </section>

        <section className="mt-24 md:mt-36">
          <ContentContainer>
            <RevealOnScroll>
              <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
                <SectionLabel>Reach us</SectionLabel>

                <div>
                  <SectionHeading as="h2" className="max-w-2xl text-4xl md:text-5xl">
Send us a message                  </SectionHeading>

                  <AnimatedTextLink
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-8 text-xl text-white/90 transition-colors hover:text-white md:text-2xl"
                  >
                    {CONTACT_EMAIL}
                  </AnimatedTextLink>

                  <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-base text-white/70">
                    {socials.map((social) => (
                      <AnimatedTextLink
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-white"
                      >
                        {social.name}
                      </AnimatedTextLink>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </ContentContainer>
        </section>
      </div>
    </main>
  );
}
