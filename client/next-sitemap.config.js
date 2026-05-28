/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aiprompt.revoxera.com',
  generateRobotsTxt: false, // We manage robots.txt manually
  outDir: 'public',
  exclude: ['/privacy', '/terms', '/cookie-policy', '/refund-policy'],
};
