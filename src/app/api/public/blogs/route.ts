import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    const blogs = await db.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      ...(limit && { take: limit }),
      select: {
        id: true, title: true, slug: true, excerpt: true, content: true,
        coverImage: true, category: true, author: true, isPublished: true,
        readTime: true, publishedAt: true, views: true, createdAt: true,
        postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });

    console.log('[Public Blogs GET] Returning', blogs.length, 'posts', limit ? `(limit=${limit})` : '(no limit)');
    if (blogs.length > 0) {
      console.log('[Public Blogs GET] First post coverImage:', blogs[0].coverImage);
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('[Public Blogs GET] DB error:', error);
    return NextResponse.json({ error: 'Database error', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}