import type { MetadataRoute } from 'next';
import { projectPages } from './projects-data';
import { absoluteUrl } from './site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/team'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/contact'),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = projectPages.map((project) => ({
    url: absoluteUrl(`/${project.slug}`),
    changeFrequency: 'yearly',
    priority: 0.8,
    images: project.galleryImages.map((image) => absoluteUrl(image.src)),
  }));

  return [...staticPages, ...projectEntries];
}
