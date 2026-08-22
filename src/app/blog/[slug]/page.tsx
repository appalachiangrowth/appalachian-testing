import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User, Eye, Share2, Twitter, Facebook, Linkedin, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import CopyLinkButton from '@/components/CopyLinkButton';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://appalachiangrowthsolutions.com';

interface Props {
  params: Promise<{ slug: string }>;
}

// Dynamic rendering — blog posts come from the database
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await db.blog.findFirst({
      where: { slug, isPublished: true },
      select: {
        id: true, title: true, slug: true, excerpt: true, content: true,
        coverImage: true, category: true, author: true,
        readTime: true, publishedAt: true, views: true, createdAt: true, updatedAt: true,
        metaTitle: true, metaDescription: true, canonicalUrl: true,
        ogTitle: true, ogDescription: true, ogImage: true,
        postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });
    if (!post) return { title: 'Post Not Found' };

    const tags = post.postTags?.map((pt: any) => pt.tag?.name).filter(Boolean) || [];
    const title = post.metaTitle || `${post.title} | Appalachian Growth Solutions`;
    const description = post.metaDescription || post.excerpt || (post.content || '').slice(0, 160).replace(/<[^>]*>/g, '');
    const ogTitle = post.ogTitle || title;
    const ogDesc = post.ogDescription || description;
    const ogImg = post.ogImage || post.coverImage || '/og-default.jpg';
    const canonical = post.canonicalUrl || `${SITE_URL}/blog/${slug}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: 'article',
        title: ogTitle,
        description: ogDesc,
        url: canonical,
        images: [{ url: ogImg, width: 1200, height: 630, alt: post.title }],
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author],
        tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDesc,
        images: [ogImg],
      },
    };
  } catch (error) {
    console.error('[Blog generateMetadata] Error:', error);
    return { title: 'Blog Post' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: any = null;
  let related: any[] = [];

  try {
    [post, related] = await Promise.all([
      db.blog.findFirst({
        where: { slug, isPublished: true },
        select: {
          id: true, title: true, slug: true, excerpt: true, content: true,
          coverImage: true, category: true, author: true, isPublished: true,
          readTime: true, publishedAt: true, views: true, createdAt: true, updatedAt: true,
          metaTitle: true, metaDescription: true, canonicalUrl: true,
          ogTitle: true, ogDescription: true, ogImage: true,
          postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        },
      }),
      db.blog.findMany({
        where: { isPublished: true, slug: { not: slug } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
          id: true, slug: true, title: true, excerpt: true, content: true,
          coverImage: true, category: true, author: true, isPublished: true,
          readTime: true, publishedAt: true, views: true, createdAt: true, updatedAt: true,
          metaTitle: true, metaDescription: true, canonicalUrl: true,
          ogTitle: true, ogDescription: true, ogImage: true,
          postTags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        },
      }),
    ]);
  } catch (error) {
    const e = error as Error & { code?: string; meta?: unknown };
    console.error('[BLOG-SLUG] DB error:', e.code, e.message, e.meta);
  }

  if (!post) notFound();

  // Extract tags safely
  const tags = Array.isArray(post?.postTags) ? post.postTags.map((pt: any) => pt?.tag).filter(Boolean) : [];

  // Sanitize HTML content to prevent XSS
  const rawContent = post.content || '';
  let cleanContent = '';
  try {
    cleanContent = DOMPurify.sanitize(rawContent, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
        'strong', 'b', 'em', 'i', 'u', 's', 'a',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'sup', 'sub',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'colspan', 'rowspan'],
    });
  } catch (error) {
    console.error('[BlogPostPage] Sanitize error:', error);
    cleanContent = `<p>${rawContent.replace(/<[^>]*>/g, '')}</p>`;
  }

  // Increment views (fire and forget)
  db.blog.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const canonical = post.canonicalUrl || `${SITE_URL}/blog/${slug}`;
  const ogImg = post.ogImage || post.coverImage || '/og-default.jpg';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt || '',
    image: ogImg,
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Appalachian Growth Solutions',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/appalachian-logo.png` },
    },
    mainEntityOfPage: canonical,
    keywords: tags.map((t: { name: string }) => t.name).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#050505] text-[#E5E5E5]">
        {/* Hero with cover image */}
        {post.coverImage && (
          <div className="relative h-64 w-full overflow-hidden bg-[#111] sm:h-80 lg:h-96">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/blog" className="mt-8 mb-8 inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-[#B6FF00]">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Category */}
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="mb-4 inline-block rounded-full border border-[rgba(182,255,0,0.2)] bg-[rgba(182,255,0,0.05)] px-3 py-1 text-xs font-medium text-[#B6FF00] transition-colors hover:bg-[rgba(182,255,0,0.1)]"
          >
            {post.category}
          </Link>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-[#666]">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.views} views
            </span>
          </div>

          {/* Content (sanitized) */}
          <article className="prose-blog mb-12" dangerouslySetInnerHTML={{ __html: cleanContent }} />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-12 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-[#555]" />
              {tags.map((tag: any) => (
                <span key={tag.id} className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-xs text-[#888]">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Social Sharing */}
          <div className="mb-12 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0A] p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
              <Share2 className="h-4 w-4 text-[#B6FF00]" />
              Share this article
            </div>
            <div className="flex gap-3">
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#1a1a1a] p-2.5 text-[#888] transition-colors hover:bg-[#222] hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#1a1a1a] p-2.5 text-[#888] transition-colors hover:bg-[#222] hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#1a1a1a] p-2.5 text-[#888] transition-colors hover:bg-[#222] hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
              <CopyLinkButton url={canonical} />
            </div>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-6 text-xl font-bold text-white">Related Articles</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rp: any) => {
                  const rpTags = Array.isArray(rp?.postTags) ? rp.postTags.map((pt: any) => pt?.tag).filter(Boolean) : [];
                  return (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group flex flex-col rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0A] p-4 transition-all hover:border-[rgba(182,255,0,0.15)]">
                      {rp.coverImage && (
                        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-[#111]">
                          <img src={rp.coverImage} alt={rp.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      )}
                      <h3 className="mb-1 text-sm font-semibold text-white transition-colors group-hover:text-[#B6FF00] line-clamp-2">{rp.title}</h3>
                      <span className="mt-auto text-xs text-[#555]">
                        {(rp.publishedAt || rp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mb-16 rounded-2xl border border-[rgba(182,255,0,0.12)] bg-[#0A0A0A] p-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-8 w-8 text-[#B6FF00]" />
            <h3 className="mb-2 text-xl font-bold text-white">Ready to Grow Your Business?</h3>
            <p className="mb-6 text-sm text-[#888]">
              Get a free consultation and learn how we can help you scale.
            </p>
            <Link href="/contact" className="inline-flex rounded-full bg-[#B6FF00] px-8 py-3 text-sm font-semibold text-[#050505] transition-shadow hover:shadow-[0_0_20px_rgba(182,255,0,0.35)]">
              Get Free Consultation
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
