import { db } from '@/lib/db';
import { marked } from 'marked';
import { normalizeMediaUrl } from '@/lib/media';

export interface BlogTagData {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  contentHtml: string;
  coverImage: string | null;
  category: string;
  author: string;
  isPublished: boolean;
  readTime: number;
  publishedAt: Date | null;
  views: number;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: BlogTagData[];
}

const selectFields = {
  id: true, slug: true, title: true, excerpt: true, content: true,
  coverImage: true, category: true, author: true, isPublished: true,
  readTime: true, publishedAt: true, views: true,
  metaTitle: true, metaDescription: true, canonicalUrl: true,
  ogTitle: true, ogDescription: true, ogImage: true,
  createdAt: true, updatedAt: true,
  postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
};

type RawPost = {
  id: string; slug: string; title: string; excerpt: string | null; content: string;
  coverImage: string | null; category: string; author: string; isPublished: boolean;
  readTime: number; publishedAt: Date | null; views: number;
  metaTitle: string | null; metaDescription: string | null; canonicalUrl: string | null;
  ogTitle: string | null; ogDescription: string | null; ogImage: string | null;
  createdAt: Date; updatedAt: Date;
  postTags: { tag: BlogTagData }[];
};

function formatPost(p: RawPost): BlogPost {
  return {
    ...p,
    coverImage: p.coverImage ? normalizeMediaUrl(p.coverImage) : null,
    ogImage: p.ogImage ? normalizeMediaUrl(p.ogImage) : null,
    contentHtml: marked(p.content) as string,
    tags: p.postTags.map(pt => pt.tag),
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await db.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    select: selectFields,
  });
  return (posts as unknown as RawPost[]).map(formatPost);
}

export async function getLatestPosts(count: number = 3): Promise<BlogPost[]> {
  const posts = await db.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: count,
    select: selectFields,
  });
  return (posts as unknown as RawPost[]).map(formatPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await db.blog.findFirst({
    where: { slug, isPublished: true },
    select: selectFields,
  });
  return post ? formatPost(post as unknown as RawPost) : null;
}

export async function getAllCategories(): Promise<string[]> {
  const result = await db.blog.findMany({
    where: { isPublished: true },
    distinct: ['category'],
    select: { category: true },
  });
  return result.map(r => r.category);
}

export async function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): Promise<BlogPost[]> {
  const posts = await db.blog.findMany({
    where: { isPublished: true, slug: { not: currentSlug }, ...(category ? { category } : {}) },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: selectFields,
  });
  if (posts.length >= limit) return (posts as unknown as RawPost[]).map(formatPost);
  const more = await db.blog.findMany({
    where: { isPublished: true, slug: { not: currentSlug }, id: { notIn: posts.map(p => p.id) } },
    orderBy: { publishedAt: 'desc' },
    take: limit - posts.length,
    select: selectFields,
  });
  return [...posts, ...more].map(p => formatPost(p as unknown as RawPost));
}

export async function incrementViews(slug: string): Promise<void> {
  await db.blog.update({ where: { slug }, data: { views: { increment: 1 } } });
}

export async function getAllSitemapPosts(): Promise<{ slug: string; publishedAt: Date | null; updatedAt: Date }[]> {
  return db.blog.findMany({
    where: { isPublished: true },
    select: { slug: true, publishedAt: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });
}
