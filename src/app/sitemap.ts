import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://appalachiangrowthsolutions.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamic rendering — reads from database
  let blogEntries: MetadataRoute.Sitemap = []

  try {
    const { getAllSitemapPosts } = await import('@/lib/blog')
    const posts = await getAllSitemapPosts()
    blogEntries = posts.map(post => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // Database not available during build
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
  ]
}
