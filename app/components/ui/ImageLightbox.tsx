'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type LightboxImage = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  /** Index of the image being viewed, or null while the lightbox is closed. */
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Horizontal drag distance (px) that counts as a swipe to the next image. */
const SWIPE_THRESHOLD = 80;

/**
 * Lenis is paused while the lightbox is open, but these keys scroll natively,
 * so they are swallowed to keep the page behind the overlay still.
 */
const SCROLL_KEYS = [' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];

const controlClassName =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/[0.16] disabled:opacity-40';

export default function ImageLightbox({ images, activeIndex, onClose, onNavigate }: ImageLightboxProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < images.length;
  const activeImage = isOpen ? images[activeIndex] : undefined;
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (offset: number) => {
      if (activeIndex === null || !hasMultiple) {
        return;
      }

      onNavigate((activeIndex + offset + images.length) % images.length);
    },
    [activeIndex, hasMultiple, images.length, onNavigate],
  );

  // Freeze the page behind the overlay; SmoothScrollProvider owns the Lenis
  // instance and listens for these events.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.dispatchEvent(new Event('lenis-stop'));

    return () => {
      window.dispatchEvent(new Event('lenis-start'));
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(-1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(1);
        return;
      }

      if (SCROLL_KEYS.includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goTo, isOpen, onClose]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && activeImage ? (
        <motion.div
          key="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeImage.alt}, image ${activeIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-[90] flex touch-none flex-col bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-5 md:px-10">
            <p className="text-sm text-white/70">
              {activeIndex + 1} / {images.length}
            </p>

            <button
              type="button"
              aria-label="Close image viewer"
              className={controlClassName}
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                &times;
              </span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage.src}
                className="relative h-full w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: easeOut }}
                drag={hasMultiple ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_event, info) => {
                  if (info.offset.x <= -SWIPE_THRESHOLD) {
                    goTo(1);
                    return;
                  }

                  if (info.offset.x >= SWIPE_THRESHOLD) {
                    goTo(-1);
                  }
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="100vw"
                  className="select-none object-contain"
                  draggable={false}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  aria-label="View previous image"
                  className={`${controlClassName} absolute left-2 top-1/2 -translate-y-1/2 md:left-6`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goTo(-1);
                  }}
                >
                  <Image
                    src="/icons/arrow-right.svg"
                    alt=""
                    width={18}
                    height={18}
                    aria-hidden="true"
                    className="h-[18px] w-[18px] rotate-180 brightness-0 invert"
                  />
                </button>

                <button
                  type="button"
                  aria-label="View next image"
                  className={`${controlClassName} absolute right-2 top-1/2 -translate-y-1/2 md:right-6`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goTo(1);
                  }}
                >
                  <Image
                    src="/icons/arrow-right.svg"
                    alt=""
                    width={18}
                    height={18}
                    aria-hidden="true"
                    className="h-[18px] w-[18px] brightness-0 invert"
                  />
                </button>
              </>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
