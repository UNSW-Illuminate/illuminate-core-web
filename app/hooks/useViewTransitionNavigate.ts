'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Marks the two frames a project's media morphs between: its card on a listing
 * and the hero on the project page. Both carry the project's slug, which is how
 * a navigation pairs them up.
 */
export const SHARED_MEDIA_ATTRIBUTE = 'data-shared-media';

/**
 * A view transition name has to be unique across the document, so exactly one
 * element wears this at a time — a duplicate makes the browser drop the whole
 * transition. Paired with the `::view-transition-*` rules in globals.css.
 */
const SHARED_MEDIA_NAME = 'shared-project-media';

/**
 * How long the outgoing frame is held while the next page commits. The router
 * prefetches, so this is a ceiling for a slow network rather than a wait we
 * expect to spend; overrunning it just falls back to a plain cut.
 */
const NAVIGATION_TIMEOUT_MS = 900;

/** Grace for the destination hero to mount once the URL has already changed. */
const DESTINATION_TIMEOUT_MS = 300;

/**
 * A beat after the new tree commits, so scroll restoration has landed before
 * the browser measures the incoming page. Measuring too early would pin the
 * morph to the destination's pre-scroll geometry.
 */
const SETTLE_MS = 32;

const POLL_INTERVAL_MS = 16;

const findSharedMedia = (slug: string) =>
  document.querySelector<HTMLElement>(`[${SHARED_MEDIA_ATTRIBUTE}="${CSS.escape(slug)}"]`);

const clearSharedMediaNames = () => {
  document
    .querySelectorAll<HTMLElement>(`[${SHARED_MEDIA_ATTRIBUTE}]`)
    .forEach((element) => element.style.removeProperty('view-transition-name'));
};

/** Hands the morph name to one frame, taking it off whoever held it before. */
const nameSharedMedia = (slug: string) => {
  clearSharedMediaNames();
  findSharedMedia(slug)?.style.setProperty('view-transition-name', SHARED_MEDIA_NAME);
};

/**
 * Polls on a timer rather than `requestAnimationFrame`: this runs inside the
 * view transition's update callback, where the browser is holding back frames.
 */
const waitUntil = (isReady: () => boolean, timeoutMs: number) =>
  new Promise<void>((resolve) => {
    const startedAt = performance.now();

    const poll = () => {
      if (isReady() || performance.now() - startedAt >= timeoutMs) {
        resolve();
        return;
      }

      window.setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
  });

const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Lenis remembers where the previous page was scrolled to and will drive the
 * window back there a frame after Next resets it. Inside a transition that is
 * doubly true — the `scroll` event that would resync Lenis is held back along
 * with the rest of rendering, so the incoming page gets measured at the old
 * offset and the morph lands on whatever now sits at that spot.
 */
const resetSmoothScroll = () => window.dispatchEvent(new Event('lenis-scroll-reset'));

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export type ViewTransitionNavigateOptions = {
  /** Project whose media morphs across the navigation, when there is one. */
  sharedMediaSlug?: string;
};

/**
 * Runs an App Router navigation inside `document.startViewTransition`, so the
 * page swap animates instead of cutting. Browsers without the API — and anyone
 * who asked for reduced motion — get the plain navigation they had before.
 */
export function useViewTransitionNavigate() {
  const router = useRouter();

  return useCallback(
    (href: string, { sharedMediaSlug }: ViewTransitionNavigateOptions = {}) => {
      const targetPath = new URL(href, window.location.href).pathname;

      if (typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
        router.push(href);
        waitUntil(() => window.location.pathname === targetPath, NAVIGATION_TIMEOUT_MS).then(
          resetSmoothScroll,
        );
        return;
      }

      if (sharedMediaSlug) {
        nameSharedMedia(sharedMediaSlug);
      }

      const transition = document.startViewTransition(async () => {
        router.push(href);

        // `router.push` resolves nothing useful, so the URL landing on the
        // target is what tells us the new tree has committed.
        await waitUntil(() => window.location.pathname === targetPath, NAVIGATION_TIMEOUT_MS);

        // Before anything is measured: the destination has to be at the top,
        // or the morph ends up pinned to the wrong part of the new page.
        resetSmoothScroll();

        if (sharedMediaSlug) {
          await waitUntil(() => findSharedMedia(sharedMediaSlug) !== null, DESTINATION_TIMEOUT_MS);
          nameSharedMedia(sharedMediaSlug);
        }

        await delay(SETTLE_MS);
      });

      // Names are transient: leaving one behind would collide with the next
      // navigation and silently kill its transition.
      const releaseNames = () => clearSharedMediaNames();
      transition.finished.then(releaseNames, releaseNames);
    },
    [router],
  );
}
