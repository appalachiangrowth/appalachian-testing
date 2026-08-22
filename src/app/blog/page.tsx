import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag, Search, X } from 'lucide-react';
import { db } from '@/lib/db';
import { normalizeMediaUrl } from '@/lib/media';
import BlogSearch from './BlogSearch';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | Appalachian Growth Solutions',
  description: 'Expert insights on e-commerce, SEO, digital marketing, and growing your online business.',
  alternates: { canonical: '/blog' },
};

interface Props {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || '';
  const search = params.search || '';
  const page = Math.max(1, parseInt(params.page || '1'));
  const PER_PAGE = 9;

  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  // --- Query 1: Fetch published posts ---
  let posts: { id: string; slug: string; title: string; excerpt: string | null; content: string; coverImage: string | null; category: string; author: string; readTime: number; publishedAt: Date | null; views: number; createdAt: Date }[] = [];
  try {
    posts = await db.blog.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true, slug: true, title: true, excerpt: true, content: true,
        coverImage: true, category: true, author: true, readTime: true,
        publishedAt: true, views: true, createdAt: true,
      },
    });
  } catch (err) {
    const e = err as Error & { code?: string; meta?: unknown };
    console.error('[BLOG-Q1 findMany posts]', e.code, e.message, e.meta);
  }

  posts = posts.map((post) => ({
    ...post,
    coverImage: normalizeMediaUrl(post.coverImage),
  }));

  // --- Query 2: Fetch distinct categories ---
  let categoryNames: string[] = [];
  try {
    const categories = await db.blog.findMany({
      where: { isPublished: true },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });
    categoryNames = categories.map(c => c.category);
  } catch (err) {
    const e = err as Error & { code?: string; meta?: unknown };
    console.error('[BLOG-Q2 distinct categories]', e.code, e.message, e.meta);
    if (posts.length > 0) categoryNames = [...new Set(posts.map(p => p.category))].sort();
  }

  // --- Query 3: Count total ---
  let total = posts.length;
  try {
    total = await db.blog.count({ where });
  } catch (err) {
    const e = err as Error & { code?: string; meta?: unknown };
    console.error('[BLOG-Q3 count]', e.code, e.message, e.meta);
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <main className="min-h-screen bg-[#050505] text-[#E5E5E5]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-[rgba(182,255,0,0.08)]">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-[rgba(182,255,0,0.2)] bg-[rgba(182,255,0,0.05)] px-4 py-1.5 text-xs font-medium text-[#B6FF00]">
              Our Blog
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Insights &amp; <span className="text-gradient">Growth Tips</span>
            </h1>
            <p className="mt-4 text-lg text-[#999]">
              Expert advice on e-commerce, SEO, marketing, and scaling your online business.
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="border-b border-[rgba(255,255,255,0.05)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <BlogSearch currentSearch={search} currentCategory={category} />
            {/* Active filter */}
            {(search || category) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666]">Showing:</span>
                {category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(182,255,0,0.1)] px-3 py-1 text-xs text-[#B6FF00]">
                    {category}
                    <Link href={search ? `/blog?search=${encodeURIComponent(search)}` : '/blog'}>
                      <X className="h-3 w-3" />
                    </Link>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(182,255,0,0.1)] px-3 py-1 text-xs text-[#B6FF00]">
                    &quot;{search}&quot;
                    <Link href={category ? `/blog?category=${encodeURIComponent(category)}` : '/blog'}>
                      <X className="h-3 w-3" />
                    </Link>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Category pills */}
          {categoryNames.length > 0 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Tag className="h-3.5 w-3.5 flex-shrink-0 text-[#555]" />
              <Link
                href={search ? `/blog?search=${encodeURIComponent(search)}` : '/blog'}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  !category
                    ? 'bg-[rgba(182,255,0,0.1)] text-[#B6FF00]'
                    : 'border border-[rgba(255,255,255,0.08)] text-[#888] hover:border-[rgba(182,255,0,0.2)] hover:text-[#B6FF00]'
                }`}
              >
                All
              </Link>
              {categoryNames.map(cat => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-[rgba(182,255,0,0.1)] text-[#B6FF00]'
                      : 'border border-[rgba(255,255,255,0.08)] text-[#888] hover:border-[rgba(182,255,0,0.2)] hover:text-[#B6FF00]'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-[#333]" />
            <p className="text-xl text-[#666]">
              {search || category ? 'No posts match your search.' : 'No blog posts yet.'}
            </p>
            <p className="mt-2 text-sm text-[#555]">
              {(search || category) ? 'Try different keywords or clear your filters.' : 'Check back soon for expert insights and growth tips.'}
            </p>
            {(search || category) && (
              <Link href="/blog" className="mt-4 inline-block text-sm text-[#B6FF00] hover:underline">
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-[#555]">{total} post{total !== 1 ? 's' : ''} found</p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] transition-all duration-300 hover:border-[rgba(182,255,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_0_1px_rgba(182,255,0,0.1)]"
                >
                  {post.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden bg-[#111]">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-[rgba(0,0,0,0.6)] px-3 py-1 text-[10px] font-medium text-[#B6FF00] backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-4 text-xs text-[#666]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <h2 className="mb-2 text-lg font-bold leading-tight text-white transition-colors group-hover:text-[#B6FF00]">
                      {post.title}
                    </h2>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-[#888]">
                      {post.excerpt || post.content.slice(0, 150).replace(/<[^>]*>/g, '') + '...'}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#B6FF00] transition-transform group-hover:gap-2.5">
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(category && { category }),
                      ...(search && { search }),
                      page: String(page - 1),
                    }).toString()}`}
                    className="rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[#888] transition-colors hover:border-[rgba(182,255,0,0.2)] hover:text-[#B6FF00]"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-3 py-2 text-sm text-[#666]">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(category && { category }),
                      ...(search && { search }),
                      page: String(page + 1),
                    }).toString()}`}
                    className="rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[#888] transition-colors hover:border-[rgba(182,255,0,0.2)] hover:text-[#B6FF00]"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
