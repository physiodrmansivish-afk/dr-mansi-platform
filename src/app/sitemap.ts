import { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.physiomansi.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'mr'];
  
  // Base public routes
  const routes = [
    '',
    '/about',
    '/services',
    '/areas',
    '/book',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate localized URLs
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${DOMAIN}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
