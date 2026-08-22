import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminUser, adminUnauthorized } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return adminUnauthorized();

  const results = {
    timestamp: new Date().toISOString(),
    queries: [] as {
      name: string;
      status: 'ok' | 'error';
      errorCode: string | null;
      errorMessage: string | null;
      errorMeta: Record<string, unknown> | null;
      dataSummary: string | null;
    }[],
  };

  // ── Q1: findMany published posts ──
  try {
    const posts = await db.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      skip: 0,
      take: 9,
      select: {
        id: true, slug: true, title: true, excerpt: true, content: true,
        coverImage: true, category: true, author: true, readTime: true,
        publishedAt: true, views: true, createdAt: true,
      },
    });
    results.queries.push({
      name: 'Q1: db.blog.findMany (published posts)',
      status: 'ok',
      errorCode: null,
      errorMessage: null,
      errorMeta: null,
      dataSummary: `${posts.length} post(s) returned. Slugs: ${posts.map((p: { slug: string }) => p.slug).join(', ') || '(none)'}`,
    });
  } catch (err) {
    const e = err as Error & { code?: string; meta?: Record<string, unknown> };
    const { message, ...safeMeta } = (e.meta || {}) as Record<string, unknown>;
    const filteredMeta: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(safeMeta)) {
      const kl = k.toLowerCase();
      if (kl.includes('url') || kl.includes('password') || kl.includes('credential') || kl.includes('secret') || kl.includes('host')) continue;
      filteredMeta[k] = v;
    }
    results.queries.push({
      name: 'Q1: db.blog.findMany (published posts)',
      status: 'error',
      errorCode: e.code || null,
      errorMessage: e.message || String(err),
      errorMeta: Object.keys(filteredMeta).length > 0 ? filteredMeta : null,
      dataSummary: null,
    });
  }

  // ── Q2: distinct categories ──
  try {
    const categories = await db.blog.findMany({
      where: { isPublished: true },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });
    results.queries.push({
      name: 'Q2: db.blog.findMany (distinct categories)',
      status: 'ok',
      errorCode: null,
      errorMessage: null,
      errorMeta: null,
      dataSummary: `${categories.length} categories: ${categories.map((c: { category: string }) => c.category).join(', ') || '(none)'}`,
    });
  } catch (err) {
    const e = err as Error & { code?: string; meta?: Record<string, unknown> };
    const { message, ...safeMeta } = (e.meta || {}) as Record<string, unknown>;
    const filteredMeta: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(safeMeta)) {
      const kl = k.toLowerCase();
      if (kl.includes('url') || kl.includes('password') || kl.includes('credential') || kl.includes('secret') || kl.includes('host')) continue;
      filteredMeta[k] = v;
    }
    results.queries.push({
      name: 'Q2: db.blog.findMany (distinct categories)',
      status: 'error',
      errorCode: e.code || null,
      errorMessage: e.message || String(err),
      errorMeta: Object.keys(filteredMeta).length > 0 ? filteredMeta : null,
      dataSummary: null,
    });
  }

  // ── Q3: count ──
  try {
    const total = await db.blog.count({ where: { isPublished: true } });
    results.queries.push({
      name: 'Q3: db.blog.count (published)',
      status: 'ok',
      errorCode: null,
      errorMessage: null,
      errorMeta: null,
      dataSummary: `Total published posts: ${total}`,
    });
  } catch (err) {
    const e = err as Error & { code?: string; meta?: Record<string, unknown> };
    const { message, ...safeMeta } = (e.meta || {}) as Record<string, unknown>;
    const filteredMeta: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(safeMeta)) {
      const kl = k.toLowerCase();
      if (kl.includes('url') || kl.includes('password') || kl.includes('credential') || kl.includes('secret') || kl.includes('host')) continue;
      filteredMeta[k] = v;
    }
    results.queries.push({
      name: 'Q3: db.blog.count (published)',
      status: 'error',
      errorCode: e.code || null,
      errorMessage: e.message || String(err),
      errorMeta: Object.keys(filteredMeta).length > 0 ? filteredMeta : null,
      dataSummary: null,
    });
  }

  // ── Bonus: check total blogs (including drafts) ──
  try {
    const allCount = await db.blog.count();
    results.queries.push({
      name: 'Bonus: db.blog.count (all, including drafts)',
      status: 'ok',
      errorCode: null,
      errorMessage: null,
      errorMeta: null,
      dataSummary: `Total blogs (all): ${allCount}`,
    });
  } catch (err) {
    const e = err as Error & { code?: string; meta?: Record<string, unknown> };
    results.queries.push({
      name: 'Bonus: db.blog.count (all, including drafts)',
      status: 'error',
      errorCode: e.code || null,
      errorMessage: e.message || String(err),
      errorMeta: null,
      dataSummary: null,
    });
  }

  return NextResponse.json(results);
}