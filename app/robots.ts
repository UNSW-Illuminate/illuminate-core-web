import type { MetadataRoute } from 'next';
import { IS_NOINDEX, SITE_URL, absoluteUrl } from './site-config';

export default function robots(): MetadataRoute.Robots {
  // A noindex mirror advertises no sitemap and no canonical host — pointing
  // either at this origin would invite the crawling the noindex is meant to
  // prevent, and pointing them at the real site from here would be a lie.
  if (IS_NOINDEX) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
