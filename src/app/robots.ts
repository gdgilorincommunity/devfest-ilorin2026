import type { MetadataRoute } from 'next'

import config from '@/config'

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = new URL('sitemap.xml', config.appUrl).toString()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: sitemapUrl,
  }
}
