export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard/', '/login/'],
      },
    ],
    sitemap: 'https://aiprompt.revoxera.com/sitemap-index.xml',
    host: 'https://aiprompt.revoxera.com',
  };
}
