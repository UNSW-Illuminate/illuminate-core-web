'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type MouseEventHandler, type ReactNode, useState } from 'react';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
  arrowClassName?: string;
  arrowIconClassName?: string;
  size?: 'small' | 'regular' | 'large' | 'extraLarge';
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
  variant?: 'default' | 'arrow';
  icon?: ReactNode;
  arrowPlacement?: 'left' | 'right';
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

const sizeStyles = {
  small: {
    button: 'px-3 py-2.5',
    icon: 'h-9 w-9',
    arrow: 'h-9 w-9',
    gap: 'gap-3',
  },
  regular: {
    button: 'px-4 py-3',
    icon: 'h-10 w-10',
    arrow: 'h-10 w-10',
    gap: 'gap-3',
  },
  large: {
    button: 'px-4 py-4',
    icon: 'h-12 w-12',
    arrow: 'h-12 w-12',
    gap: 'gap-4',
  },
  extraLarge: {
    button: 'px-5 py-5',
    icon: 'h-14 w-14',
    arrow: 'h-14 w-14',
    gap: 'gap-4',
  },
} as const;

export default function ButtonLink({
  href,
  children,
  className,
  iconClassName,
  arrowClassName,
  arrowIconClassName,
  size = 'regular',
  target,
  rel,
  title,
  ariaLabel,
  variant = 'default',
  icon,
  arrowPlacement = 'right',
  onClick,
}: ButtonLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const sizing = sizeStyles[size];

  const arrowElement = variant === 'arrow' ? (
    <span className={joinClasses(arrowPlacement === 'left' ? 'mr-4' : 'ml-4', 'flex shrink-0 items-center justify-center rounded-full bg-white/[0.08]', sizing.arrow, arrowClassName)}>
      <motion.span
        initial={false}
        animate={{ x: isHovered ? (arrowPlacement === 'left' ? -4 : 4) : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.7 }}
        className="flex items-center justify-center"
      >
        <Image src="/icons/arrow-right.svg" alt="" width={18} height={18} aria-hidden="true" className={joinClasses('h-[18px] w-[18px] brightness-0 invert', arrowIconClassName)} />
      </motion.span>
    </span>
  ) : null;

  const content = (
    <>
      {arrowPlacement === 'left' ? arrowElement : null}
      <span className={joinClasses('flex min-w-0 items-center', sizing.gap)}>
        {icon ? <span className={joinClasses('flex shrink-0 items-center justify-center text-white', sizing.icon, iconClassName)}>{icon}</span> : null}
        <span className="min-w-0 text-left">{children}</span>
      </span>
      {arrowPlacement === 'right' ? arrowElement : null}
    </>
  );

  const sharedClassName = joinClasses(
    'link-reset flex w-full items-center justify-between rounded-full bg-white/[0.03] text-white transition-colors hover:bg-white/[0.06]',
    sizing.button,
    className,
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
        onClick={onClick}
        {...interactionProps}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} title={title} aria-label={ariaLabel} className={sharedClassName} onClick={onClick} {...interactionProps}>
      {content}
    </Link>
  );
}