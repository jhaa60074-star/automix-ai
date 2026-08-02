import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.autrixgpt.com';
  
  const routes = [
    '',
    '/services',
    '/pricing',
    '/automations',
    '/help-center',
    '/login',
    '/signup',
    '/privacy-policy',
    '/terms',
    '/data-deletion',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
