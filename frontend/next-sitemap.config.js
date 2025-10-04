/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://expense-flow.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
