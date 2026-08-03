import type { Metadata } from 'next';

// The canonical origin this deployment serves from. It feeds `metadataBase`,
// every canonical URL, the sitemap entries, the robots `host`, and the JSON-LD
// `@id`s — all of which are baked in at build time, so the environment variable
// has to be present during the build, not just at runtime. Set
// SITE_URL per environment; the fallback is the production domain. The older
// NEXT_PUBLIC name remains supported so existing deployments do not break, but
// this value is server-only and should not be exposed in client bundles.
const configuredSiteUrl =
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://www.unswilluminate.com';

const parsedSiteUrl = new URL(configuredSiteUrl);

if (!['http:', 'https:'].includes(parsedSiteUrl.protocol)) {
  throw new Error('SITE_URL must use http or https.');
}

export const SITE_URL = parsedSiteUrl.origin;

export const SITE_NAME = 'UNSW Illuminate';

export const SITE_DESCRIPTION =
  'UNSW students designing and building interactive light installations for festivals, public spaces, and the university community.';

export const DEFAULT_SOCIAL_IMAGE = '/projectImages/resonance/01.webp';

// Whether this deployment should stay out of search results. Only one origin
// should rank for this content: a mirror served from a different domain sets
// SITE_NOINDEX=true so it never competes with the canonical site. It is read at
// build time, like SITE_URL, so it has to be set on the build environment.
export const IS_NOINDEX =
  (process.env.SITE_NOINDEX ?? process.env.NEXT_PUBLIC_NOINDEX) === 'true';

export const PUBLIC_ROBOTS: Metadata['robots'] = IS_NOINDEX
  ? {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    }
  : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    };

export const SOCIAL_PROFILES = [
  'https://www.instagram.com/unswilluminate/',
  'https://www.facebook.com/unsw.illuminate/',
  'https://www.linkedin.com/company/project-illuminate/',
];

export function absoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}
