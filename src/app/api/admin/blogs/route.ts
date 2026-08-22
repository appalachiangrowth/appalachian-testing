import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  const where: Record<string, unknown> = {};
  if (status === 'published') where.isPublished = true;
  else if (status === 'draft') where.isPublished = false;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
    ];
  }

  const [blogs, total] = await Promise.all([
    db.blog.findMany({
      where,
      orderBy: { createdAt: sort === 'oldest' ? 'asc' : 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { postTags: { include: { tag: true } } },
    }),
    db.blog.count({ where }),
  ]);

  return NextResponse.json({ blogs, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, author, isPublished, readTime, publishedAt, metaTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, ogImage, tagNames } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const finalSlug = slug || slugify(title);

    const blog = await db.blog.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category: category || 'General',
        author: author || 'Appalachian Growth',
        isPublished: isPublished ?? false,
        readTime: readTime ?? 5,
        publishedAt: isPublished && !publishedAt ? new Date() : publishedAt ? new Date(publishedAt) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
      },
    });

    // Handle tags
    if (Array.isArray(tagNames) && tagNames.length > 0) {
      for (const name of tagNames) {
        if (!name.trim()) continue;
        const tagSlug = slugify(name);
        const tag = await db.blogTag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: name.trim(), slug: tagSlug },
        });
        await db.postTag.create({ data: { postId: blog.id, tagId: tag.id } });
      }
    }

    // Sync category
    if (category && category !== 'General') {
      const catSlug = slugify(category);
      await db.blogCategory.upsert({
        where: { slug: catSlug },
        update: {},
        create: { name: category, slug: catSlug },
      });
    }

    const fullBlog = await db.blog.findUnique({
      where: { id: blog.id },
      include: { postTags: { include: { tag: true } } },
    });

    return NextResponse.json(fullBlog, { status: 201 });
  } catch (error) {
    console.error('[Admin Blogs POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create blog', details: String((error as Error)?.message || '') }, { status: 500 });
  }
}
