import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeMediaUrl } from '@/lib/media';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const blog = await db.blog.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true, title: true, slug: true, excerpt: true, content: true,
      coverImage: true, category: true, author: true, isPublished: true,
      readTime: true, publishedAt: true, views: true, createdAt: true, updatedAt: true,
      metaTitle: true, metaDescription: true, canonicalUrl: true,
      ogTitle: true, ogDescription: true, ogImage: true,
      postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
    },
  });

  if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

  // Increment views
  await db.blog.update({ where: { id: blog.id }, data: { views: { increment: 1 } } });

  return NextResponse.json({
    ...blog,
    coverImage: blog.coverImage ? normalizeMediaUrl(blog.coverImage) : null,
    ogImage: blog.ogImage ? normalizeMediaUrl(blog.ogImage) : null,
  });
}