'use client';

import Link from 'next/link';
import { type ComponentProps, type MouseEvent } from 'react';
import { useViewTransitionNavigate } from '@/app/hooks/useViewTransitionNavigate';

type TransitionLinkProps = ComponentProps<typeof Link> & {
  /** Project whose media morphs into the destination hero, when there is one. */
  sharedMediaSlug?: string;
};

/** New-tab, download and context clicks keep the browser's own behaviour. */
const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/**
 * `next/link` that animates the page swap. Same props, plus an opt-in slug for
 * the card-to-hero morph; anything it cannot animate (external hosts, new tabs,
 * same-page hashes) falls straight through to `next/link`.
 */
export default function TransitionLink({
  sharedMediaSlug,
  href,
  target,
  onClick,
  children,
  ...linkProps
}: TransitionLinkProps) {
  const navigate = useViewTransitionNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (typeof href !== 'string' || event.defaultPrevented || target || !isPlainLeftClick(event)) {
      return;
    }

    const destination = new URL(href, window.location.href);

    // Another origin leaves the app entirely, and a hash on the page we are
    // already on scrolls rather than navigates.
    if (
      destination.origin !== window.location.origin ||
      destination.pathname === window.location.pathname
    ) {
      return;
    }

    event.preventDefault();
    navigate(href, { sharedMediaSlug });
  };

  return (
    <Link href={href} target={target} onClick={handleClick} {...linkProps}>
      {children}
    </Link>
  );
}
