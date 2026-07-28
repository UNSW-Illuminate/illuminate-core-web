'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AnimatedTextLink from './ui/AnimatedTextLink';
import TransitionLink from './ui/TransitionLink';

const navItems = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function NavBar() {
  const pathname = usePathname();

  // `site-nav` names the bar for view transitions so it holds still while the
  // page underneath it changes — see globals.css.
  return (
    <nav className="site-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-6 py-5 md:px-12 md:py-6 lg:px-20">
      <TransitionLink
        href="/"
        aria-label="UNSW Illuminate — home"
        className="flex shrink-0 items-center transition-opacity hover:opacity-80"
      >
        <Image
          src="/logos/illuminate_wordmark.svg"
          alt="Illuminate"
          width={242}
          height={62}
          priority
          className="h-6 w-auto md:h-7"
        />
      </TransitionLink>

      <div className="flex items-center gap-6 md:gap-8">
        {navItems.map((item) => (
          <AnimatedTextLink
            key={item.label}
            href={item.href}
            // Anchor links never match a pathname, so only the standalone pages
            // ever read as current.
            className={`text-sm transition-colors md:text-base ${
              pathname === item.href ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            {item.label}
          </AnimatedTextLink>
        ))}
      </div>
    </nav>
  );
}
