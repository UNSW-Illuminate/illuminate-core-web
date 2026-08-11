'use client';

import { useCallback, useEffect, useRef } from 'react';
import { trackEvent } from '@/app/analytics';

const ENGAGED_ACTIVE_SECONDS = 30;
const ENGAGED_SCROLL_PERCENT = 50;

type EngagementReason = 'time_and_scroll' | 'gallery_open';

type UseProjectEngagementOptions = {
  projectSlug: string;
  projectTitle: string;
};

export function useProjectEngagement({
  projectSlug,
  projectTitle,
}: UseProjectEngagementOptions) {
  const activeSecondsRef = useRef(0);
  const maxScrollPercentRef = useRef(0);
  const hasTrackedRef = useRef(false);

  const trackEngagement = useCallback(
    (reason: EngagementReason) => {
      if (hasTrackedRef.current) {
        return;
      }

      hasTrackedRef.current = true;
      trackEvent('project_engaged', {
        project_slug: projectSlug,
        project_title: projectTitle,
        engagement_reason: reason,
        active_seconds: activeSecondsRef.current,
        scroll_percent: maxScrollPercentRef.current,
      });
    },
    [projectSlug, projectTitle],
  );

  useEffect(() => {
    activeSecondsRef.current = 0;
    maxScrollPercentRef.current = 0;
    hasTrackedRef.current = false;

    const updateScrollDepth = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent =
        scrollableHeight <= 0
          ? 100
          : Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100));

      maxScrollPercentRef.current = Math.max(maxScrollPercentRef.current, scrollPercent);

      if (
        activeSecondsRef.current >= ENGAGED_ACTIVE_SECONDS &&
        maxScrollPercentRef.current >= ENGAGED_SCROLL_PERCENT
      ) {
        trackEngagement('time_and_scroll');
      }
    };

    updateScrollDepth();
    window.addEventListener('scroll', updateScrollDepth, { passive: true });

    const activeTimeInterval = window.setInterval(() => {
      if (document.visibilityState !== 'visible' || !document.hasFocus()) {
        return;
      }

      activeSecondsRef.current += 1;

      if (
        activeSecondsRef.current >= ENGAGED_ACTIVE_SECONDS &&
        maxScrollPercentRef.current >= ENGAGED_SCROLL_PERCENT
      ) {
        trackEngagement('time_and_scroll');
      }
    }, 1000);

    return () => {
      window.removeEventListener('scroll', updateScrollDepth);
      window.clearInterval(activeTimeInterval);
    };
  }, [projectSlug, trackEngagement]);

  return trackEngagement;
}
