'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import SectionLabel from '@/components/sections/SectionLabel'

interface BlogCard {
  slug: string
  title: string
  excerpt: string | null
  date?: string
  publishedAt?: string | null
  category: string
  coverImage: string | null
  readTime: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
}

export default function LatestBlogs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [blogs, setBlogs] = useState<BlogCard[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchBlogs() {
      try {
        console.log('[LatestBlogs] Fetching /api/public/blogs?limit=3 ...')
        const res = await fetch('/api/public/blogs?limit=3')
        console.log('[LatestBlogs] Response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('[LatestBlogs] Got', Array.isArray(data) ? data.length : 'non-array', 'posts')
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data)
          }
        } else {
          const errText = await res.text().catch(() => '')
          console.error('[LatestBlogs] Fetch failed:', res.status, errText)
          setLoadError(`Failed to load blogs (HTTP ${res.status})`)
        }
      } catch (err) {
        console.error('[LatestBlogs] Fetch error:', err)
        setLoadError('Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  function handleImgError(slug: string) {
    console.warn('[LatestBlogs] Broken image for blog:', slug)
    setBrokenImages(prev => new Set(prev).add(slug))
  }

  const posts = blogs

  return (
    <section className='bg-[#050505]'>
      <div className='mx-auto max-w-7xl px-4 py-16 md:py-24 sm:px-6 lg:px-8'>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'
        >
          <div>
            <SectionLabel>Latest Articles</SectionLabel>
            <h2 className='mt-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl'>
              FROM OUR <span className='text-gradient'>BLOG</span>
            </h2>
            <p className='mt-3 max-w-lg text-[#999]'>
              Stay ahead with the latest insights on e-commerce, SEO, and digital marketing.
            </p>
          </div>
          <Link
            href='/blog'
            className='group inline-flex items-center gap-2 rounded-full border border-[rgba(182,255,0,0.3)] px-6 py-2.5 text-sm font-semibold text-[#B6FF00] transition-all hover:bg-[rgba(182,255,0,0.08)] hover:shadow-[0_0_15px_rgba(182,255,0,0.2)]'
          >
            View All Posts
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </motion.div>

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-[400px] animate-pulse rounded-2xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A]'>
                <div className='h-44 w-full bg-[#111]' />
                <div className='p-5 space-y-3'>
                  <div className='h-3 w-20 rounded bg-[#111]' />
                  <div className='h-4 w-full rounded bg-[#111]' />
                  <div className='h-4 w-3/4 rounded bg-[#111]' />
                  <div className='h-3 w-full rounded bg-[#111]' />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className='rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center'>
            <p className='text-red-400 text-sm'>{loadError}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className='group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] transition-all duration-300 hover:border-[rgba(182,255,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_0_1px_rgba(182,255,0,0.1)]'
                >
                  {/* Cover */}
                  <div className='relative h-44 w-full overflow-hidden bg-[#111]'>
                    {post.coverImage && !brokenImages.has(post.slug) ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                        onError={() => handleImgError(post.slug)}
                      />
                    ) : null}
                    <div className='absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent' />
                    <span className='absolute left-4 top-4 rounded-full bg-[rgba(0,0,0,0.6)] px-3 py-1 text-[10px] font-medium text-[#B6FF00] backdrop-blur-sm'>
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className='flex flex-1 flex-col p-5'>
                    <div className='mb-2.5 flex items-center gap-3 text-[11px] text-[#666]'>
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {new Date(post.publishedAt || post.date || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3 className='mb-2 text-[15px] font-bold leading-tight text-white transition-colors group-hover:text-[#B6FF00]'>
                      {post.title}
                    </h3>
                    <p className='mb-4 flex-1 text-[13px] leading-relaxed text-[#888]'>
                      {post.excerpt || ''}
                    </p>
                    <span className='inline-flex items-center gap-1.5 text-xs font-medium text-[#B6FF00] transition-transform group-hover:gap-2.5'>
                      Read More
                      <ArrowRight className='h-3.5 w-3.5' />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='py-16 text-center'>
            <p className='text-[#555] text-lg'>No blog posts yet.</p>
            <p className='mt-2 text-[#444] text-sm'>Check back soon for expert insights and growth tips.</p>
          </div>
        )}
      </div>
    </section>
  )
}
