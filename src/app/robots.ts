import { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.physiomansi.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
