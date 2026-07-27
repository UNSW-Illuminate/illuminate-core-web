import Image from 'next/image';
import AnimatedTextLink from './ui/AnimatedTextLink';
import ButtonLink from './ui/ButtonLink';
import ContentContainer from './ui/ContentContainer';
import SectionHeading from './ui/SectionHeading';
import SectionLabel from './ui/SectionLabel';

const footerLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
  { label: 'Join Us', href: 'mailto:admin@unswilluminate.com?subject=Join%20UNSW%20Illuminate' },
];

const partnerLinks = [
  { name: 'UNSW', href: 'https://www.unsw.edu.au/', src: '/logos/unsw.png' },
  { name: 'CREATE', href: 'https://www.createunsw.com.au/', src: '/logos/create.png' },
  { name: 'Arc', href: 'https://campus.hellorubric.com/?s=12502', src: '/logos/arc.png' },
];

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/unswilluminate/',
    icon: (
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.75 1.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.3A4.7 4.7 0 1 1 7.3 12 4.7 4.7 0 0 1 12 7.3Zm0 2.2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Z" fill="currentColor" />
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/unsw.illuminate/',
    icon: (
      <path d="M13.35 22v-8.22h2.76l.41-3.2h-3.17V8.54c0-.93.26-1.56 1.6-1.56h1.71V4.12A22.1 22.1 0 0 0 14.17 4c-2.47 0-4.16 1.5-4.16 4.26v2.32H7.2v3.2h2.81V22h3.34Z" fill="currentColor" />
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/project-illuminate/?originalSubdomain=au',
    icon: (
      <path d="M5.44 8.86A1.94 1.94 0 1 1 5.4 5a1.94 1.94 0 0 1 .04 3.87ZM7 22H3.88V10.52H7V22Zm11 0h-3.11v-5.59c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95V22H7.78V10.52h2.98v1.57h.04a3.27 3.27 0 0 1 2.95-1.62c3.15 0 3.73 2.07 3.73 4.76V22Z" fill="currentColor" />
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black text-white">
      <ContentContainer className="flex flex-col gap-14 px-6 py-14 md:px-12 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.75fr_1.1fr]">
          <div>
            <SectionLabel>UNSW Illuminate</SectionLabel>
            <SectionHeading as="h2" className="mt-4 max-w-xl text-3xl md:text-3xl">
              Interactive experiences shaped by students, partners, and emerging creative technology.
            </SectionHeading>
            <AnimatedTextLink
              href="mailto:admin@unswilluminate.com"
              className="mt-6 text-base text-white/80 transition-colors hover:text-white"
            >
              admin@unswilluminate.com
            </AnimatedTextLink>
          </div>

          <div>
            <SectionLabel>Navigate</SectionLabel>
            <nav className="mt-4 flex flex-col gap-3 text-lg text-white/82">
              {footerLinks.map((link) => (
                <AnimatedTextLink key={link.label} href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </AnimatedTextLink>
              ))}
            </nav>
          </div>

          <div>
            <SectionLabel>Follow</SectionLabel>
            <div className="mt-4 flex flex-col gap-3 text-white">
              {socialLinks.map((social) => (
                <ButtonLink
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  ariaLabel={social.name}
                  title={social.name}
                  variant="arrow"
                    size="small"
                    iconClassName="h-12 w-12"
                  arrowClassName="bg-white/[0.06]"
                  icon={
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-7 w-7 ${social.name === 'LinkedIn' ? '-mt-1.5' : ''}`}
                        aria-hidden="true"
                      >
                      {social.icon}
                    </svg>
                  }
                >
                    <span className="text-base text-white">{social.name}</span>
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Major Partners</SectionLabel>
          <div className="mt-5 flex flex-wrap items-center gap-10">
            {partnerLinks.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                aria-label={partner.name}
                title={partner.name}
                className="link-reset flex items-center justify-center opacity-100 transition-opacity hover:opacity-85"
              >
                <Image
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  width={260}
                  height={112}
                  className="h-auto max-h-16 w-auto object-contain opacity-100"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {year} UNSW Illuminate. All rights reserved.</p>
        </div>
      </ContentContainer>
    </footer>
  );
}