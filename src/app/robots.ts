import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Keep admin panel private from search engines
    },
    sitemap: 'https://binaya-cinematics.vercel.app/sitemap.xml',
  };
}
