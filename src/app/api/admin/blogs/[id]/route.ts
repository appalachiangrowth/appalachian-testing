import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const blog = await db.blog.findUnique({
    where: { id },
    include: { postTags: { include: { tag: true } } },
  });

  if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, category, author, isPublished, readTime, publishedAt, metaTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, ogImage, tagNames } = body;

  const existing = await db.blog.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

  const finalSlug = slug || (title ? slugify(title) : existing.slug);

  const nowPublish = isPublished && !existing.isPublished;
  const pubDate = publishedAt ? new Date(publishedAt) : (nowPublish ? new Date() : existing.publishedAt);

  const blog = await db.blog.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(finalSlug !== undefined && { slug: finalSlug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content !== undefined && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(category !== undefined && { category }),
      ...(author !== undefined && { author }),
      ...(isPublished !== undefined && { isPublished }),
      ...(readTime !== undefined && { readTime }),
      ...(publishedAt !== undefined ? { publishedAt: publishedAt ? new Date(publishedAt) : null } : { publishedAt: pubDate }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(canonicalUrl !== undefined && { canonicalUrl }),
      ...(ogTitle !== undefined && { ogTitle }),
      ...(ogDescription !== undefined && { ogDescription }),
      ...(ogImage !== undefined && { ogImage }),
    },
  });

  // Update tags
  if (Array.isArray(tagNames)) {
    await db.postTag.deleteMany({ where: { postId: id } });
    for (const name of tagNames) {
      if (!name.trim()) continue;
      const tagSlug = slugify(name);
      const tag = await db.blogTag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: name.trim(), slug: tagSlug },
      });
      await db.postTag.create({ data: { postId: id, tagId: tag.id } });
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
    where: { id },
    include: { postTags: { include: { tag: true } } },
  });

  return NextResponse.json(fullBlog);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const { id } = await params;
  const existing = await db.blog.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

  // PostTags cascade-delete via relation
  await db.blog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
