'use client';

import { motion } from 'framer-motion';
import TransitionLink from './TransitionLink';
import { type ReactNode, useState } from 'react';

type AnimatedTextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  underlineClassName?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function AnimatedTextLink({
  href,
  children,
  className,
  underlineClassName,
  target,
  rel,
  title,
  ariaLabel,
}: AnimatedTextLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const sharedClassName = joinClasses('inline-flex w-fit text-current', className);
  const content = (
    <span className="relative inline-flex w-fit">
      <span>{children}</span>
      <motion.span
        aria-hidden="true"
        className={joinClasses('pointer-events-none absolute left-0 top-full mt-[0.12em] h-0.5 w-full bg-current', underlineClassName)}
        initial={false}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );

  const interactionProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsHovered(true),
    onBlur: () => setIsHovered(false),
  };

  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        title={title}
        aria-label={ariaLabel}
        className={sharedClassName}
        {...interactionProps}
      >
        {content}
      </a>
    );
  }

  return (
    <TransitionLink href={href} title={title} aria-label={ariaLabel} className={sharedClassName} {...interactionProps}>
      {content}
    </TransitionLink>
  );
}