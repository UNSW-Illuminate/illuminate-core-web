import type { Metadata } from 'next';
import type { Viewport } from 'next';
import localFont from 'next/font/local';
import {
  DEFAULT_SOCIAL_IMAGE,
  PUBLIC_ROBOTS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from './site-config';
import './globals.css';

const ppNeueMontreal = localFont({
  src: '../public/PPNeueMontreal-Book.woff2',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  weight: '400',
  style: 'normal',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'UNSW Illuminate — Interactive light installations',
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: PUBLIC_ROBOTS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Art and technology',
  keywords: [
    'UNSW Illuminate',
    'interactive light installations',
    'student art',
    'creative technology',
    'Vivid Sydney',
    'UNSW engineering',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: SITE_NAME,
    title: 'UNSW Illuminate — Interactive light installations',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 2560,
        height: 1707,
        alt: 'An interactive light installation by UNSW Illuminate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNSW Illuminate — Interactive light installations',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicon/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organisationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'Illuminate',
    url: SITE_URL,
    logo: absoluteUrl('/favicon/android-chrome-512x512.png'),
    email: 'admin@unswilluminate.com',
    sameAs: SOCIAL_PROFILES,
  };

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-AU',
  };

  return (
    <html lang="en-AU">
      <body className={`${ppNeueMontreal.className} m-0 overflow-x-hidden p-0`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organisationStructuredData, websiteStructuredData]).replace(
              /</g,
              '\\u003c',
            ),
          }}
        />
        {children}
      </body>
    </html>
  );
}
