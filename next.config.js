/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Baseline hardening for every response. No CSP yet: the shader editor
        // and framer-motion inject styles at runtime, so a policy needs testing
        // before it can be enforced.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
