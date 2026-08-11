type AnalyticsParameter = string | number | boolean;

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      parameters?: Record<string, AnalyticsParameter>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  parameters: Record<string, AnalyticsParameter> = {},
) {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.gtag) {
    window.gtag('event', eventName, parameters);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(['event', eventName, parameters]);
}

export type ProjectSelectionSource =
  | 'featured'
  | 'archive'
  | 'other_projects';

type TrackProjectSelectionOptions = {
  projectSlug: string;
  projectTitle: string;
  sourceSurface: ProjectSelectionSource;
  position: number;
};

export function trackProjectSelection({
  projectSlug,
  projectTitle,
  sourceSurface,
  position,
}: TrackProjectSelectionOptions) {
  trackEvent('select_content', {
    content_type: 'project',
    content_id: projectSlug,
    project_slug: projectSlug,
    project_title: projectTitle,
    source_surface: sourceSurface,
    position,
  });
}
