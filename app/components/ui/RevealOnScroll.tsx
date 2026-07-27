'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type RevealOnScrollProps = {
  children: ReactNode;
  /** Stagger offset, in seconds. */
  delay?: number;
  className?: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * The site's standard fade-up on scroll. Server components can wrap their own
 * markup in this without becoming client components themselves.
 */
export default function RevealOnScroll({ children, delay = 0, className }: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
