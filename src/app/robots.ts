// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/login',
          '/signup',
          '/trial-expired',
        ],
      },
    ],
    sitemap: 'https://seopulse.digital/sitemap.xml',
  }
}