const siteUrl = process.env.NEXTAUTH_URL || 'https://examora.vercel.app';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 1.0,
  exclude: ['/api/*', '/admin/*', '/dashboard/*'],
  transform: async (config, path) => {
    // Custom transformation logic
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    // Additional paths to include
    const result = [];
    
    // Add static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/login', changefreq: 'monthly', priority: 0.8 },
      { url: '/leaderboard', changefreq: 'weekly', priority: 0.7 },
    ];

    for (const page of staticPages) {
      result.push({
        loc: page.url,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      });
    }

    return result;
  },
};
