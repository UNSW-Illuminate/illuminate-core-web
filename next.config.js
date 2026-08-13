// Mirror deployments set SITE_NOINDEX=true (see app/site-config.ts). The
// page-level metadata already carries the directive; this header repeats it on
// every response, including ones with no <head> to put a meta tag in — images,
// sitemap.xml, and error pages.
const isNoindex =
  (process.env.SITE_NOINDEX ?? process.env.NEXT_PUBLIC_NOINDEX) === 'true';
const isProduction = process.env.NODE_ENV === 'production';

// Google Analytics 4 (gtag.js) origins, per Google's documented CSP guidance.
// The tag is loaded from googletagmanager.com, sends its hits to
// google-analytics.com / analytics.google.com (both regionalised behind
// wildcards, e.g. region1.google-analytics.com), and falls back to an image
// beacon when fetch/beacon is unavailable — so all three directives below need
// the origins or the tag silently does nothing and never sets the _ga cookie.
const GOOGLE_ANALYTICS_SCRIPT_ORIGINS = 'https://*.googletagmanager.com';
const GOOGLE_ANALYTICS_CONNECT_ORIGINS =
  'https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com';
const GOOGLE_ANALYTICS_IMAGE_ORIGINS =
  'https://*.google-analytics.com https://*.googletagmanager.com';

const productionSecurityHeaders = isProduction
  ? [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          `img-src 'self' data: blob: ${GOOGLE_ANALYTICS_IMAGE_ORIGINS}`,
          "font-src 'self'",
          `connect-src 'self' ${GOOGLE_ANALYTICS_CONNECT_ORIGINS}`,
          `script-src 'self' 'unsafe-inline' ${GOOGLE_ANALYTICS_SCRIPT_ORIGINS}`,
          "style-src 'self' 'unsafe-inline'",
          "worker-src 'self' blob:",
          'upgrade-insecure-requests',
        ].join('; '),
      },
    ]
  : [];

const publicAssetCacheHeaders = [
  '/projectImages/:path*',
  '/team/:path*',
  '/logos/:path*',
  '/icons/:path*',
  '/favicon/:path*',
  '/PPNeueMontreal-Book.woff2',
].map((source) => ({
  source,
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=86400, stale-while-revalidate=604800',
    },
  ],
}));

const noindexHeaders = isNoindex
  ? [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, noimageindex' },
        ],
      },
    ]
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86_400,
  },
  async headers() {
    return [
      ...noindexHeaders,
      ...publicAssetCacheHeaders,
      {
        // Baseline hardening for every response. The production CSP allows the
        // inline scripts/styles required by Next and framer-motion while still
        // denying third-party scripts, framing, plugins, and foreign requests.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...productionSecurityHeaders,
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Project pages moved from /projects/<slug> to /<slug>; keep old links alive.
      {
        source: '/projects/:projectSlug',
        destination: '/:projectSlug',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
