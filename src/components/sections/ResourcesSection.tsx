'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'
import { ArrowRight, Clock, X } from 'lucide-react'
import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'

interface BlogArticle {
  title: string
  category: string
  readTime: string
  excerpt: string
  categoryColor: string
  gradient1: string
  gradient2: string
  date: string
  body: string[]
}

const blogArticles: BlogArticle[] = [
  {
    title: 'The Ultimate Guide to Shopify SEO in 2025',
    category: 'SEO',
    readTime: '5 min read',
    excerpt: 'Learn the exact SEO strategies we use to rank stores on page 1 of Google.',
    categoryColor: '#B6FF00',
    gradient1: '#B6FF00',
    gradient2: '#00D4FF',
    date: 'Jan 15, 2025',
    body: [
      'Shopify SEO is the foundation of any successful online store. With over 2.1 million Shopify stores competing for attention, optimizing your product pages, collections, and metadata is essential for driving organic traffic and reducing dependency on paid ads.',
      'In this comprehensive guide, we cover everything from keyword research and on-page optimization to technical SEO best practices specific to the Shopify platform. You\'ll learn how to structure your URLs, write compelling product descriptions, and leverage Shopify\'s built-in SEO features.',
      'Whether you\'re launching a new store or optimizing an existing one, these actionable strategies will help you climb search rankings and attract qualified buyers who are ready to purchase.',
    ],
  },
  {
    title: 'WordPress vs Shopify: Which is Better?',
    category: 'Comparison',
    readTime: '8 min read',
    excerpt: 'An honest comparison to help you choose the right platform for your business.',
    categoryColor: '#00D4FF',
    gradient1: '#00D4FF',
    gradient2: '#8B5CF6',
    date: 'Feb 3, 2025',
    body: [
      'Choosing between WordPress and Shopify is one of the most consequential decisions you\'ll make for your eCommerce business. Each platform has distinct strengths: Shopify offers an all-in-one managed commerce solution, while WordPress with WooCommerce provides unmatched flexibility and customization through its open-source ecosystem.',
      'Shopify excels in ease of use, built-in security, and scalability for growing brands. It handles hosting, PCI compliance, and updates automatically — letting you focus on selling. WordPress, on the other hand, gives you complete control over your site\'s architecture and design, but requires more technical expertise to maintain and secure.',
      'The right choice depends on your budget, technical comfort, growth trajectory, and specific feature requirements. In this article, we break down pricing, performance, SEO capabilities, app ecosystems, and real-world case studies to help you make an informed decision for your business.',
    ],
  },
  {
    title: '10 eCommerce Conversion Rate Optimization Tips',
    category: 'CRO',
    readTime: '6 min read',
    excerpt: 'Practical tips to increase your store conversion rate and boost revenue.',
    categoryColor: '#FF6B00',
    gradient1: '#FF6B00',
    gradient2: '#B6FF00',
    date: 'Feb 20, 2025',
    body: [
      'Your conversion rate is the single most important metric for your online store. Driving traffic is expensive — whether through paid ads, SEO, or social media — and if visitors aren\'t buying, that investment goes to waste. The average eCommerce conversion rate sits between 2-3%, but top-performing stores consistently achieve 5% or higher.',
      'We\'ve analyzed hundreds of stores and identified the 10 highest-impact optimization strategies. From simplifying your checkout flow and building trust signals to leveraging social proof and implementing urgency tactics, these are the exact techniques we deploy for our clients to move the needle on revenue.',
      'Most of these optimizations require no code changes and can be implemented in a single afternoon. We\'ll show you the data behind each tip, along with before-and-after examples from real stores we\'ve optimized. Even a 0.5% improvement in conversion rate can translate to thousands of dollars in additional monthly revenue.',
    ],
  },
  {
    title: 'How to Run Profitable Facebook Ads',
    category: 'Marketing',
    readTime: '7 min read',
    excerpt: 'Step-by-step guide to creating high-converting Facebook ad campaigns.',
    categoryColor: '#FF6B9D',
    gradient1: '#FF6B9D',
    gradient2: '#FF6B00',
    date: 'Mar 8, 2025',
    body: [
      'Facebook remains one of the most powerful advertising platforms for eCommerce brands, with over 2.9 billion monthly active users and sophisticated targeting capabilities. However, the landscape has changed dramatically — rising CPMs, iOS privacy updates, and increased competition mean that a "set it and forget it" approach no longer works.',
      'Profitable Facebook advertising requires a systematic approach: audience research, creative testing, funnel architecture, and data-driven optimization. We\'ll walk you through each stage of building a campaign, from defining your ideal customer avatar and crafting scroll-stopping creatives to setting up your pixel, building lookalike audiences, and scaling winners.',
      'The brands winning on Facebook in 2025 are those treating it as a full-funnel machine — not just a direct response channel. We\'ll show you how to combine top-of-funnel brand awareness content with mid-funnel retargeting and bottom-of-funnel conversion campaigns to build a sustainable, profitable ad system that compounds over time.',
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
}

function BlogCard({ article, index, onClick }: { article: BlogArticle; index: number; onClick: () => void }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer card-shine bg-[#0A0A0A] rounded-2xl border border-[rgba(182,255,0,0.06)] hover:border-[rgba(182,255,0,0.2)] overflow-hidden relative hover:shadow-[0_8px_30px_rgba(182,255,0,0.06)]"
    >
      {/* Top gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Top: Category badge + reading time */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span
          className="inline-block px-2.5 py-1 text-[11px] md:text-xs rounded-md font-semibold"
          style={{
            backgroundColor: `${article.categoryColor}18`,
            color: article.categoryColor,
          }}
        >
          {article.category}
        </span>
        <span className="flex items-center gap-1.5 text-[#666] text-xs">
          <Clock className="w-3 h-3" />
          {article.readTime}
        </span>
      </div>

      {/* Thumbnail placeholder with abstract gradient */}
      <div className="px-5">
        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#0D0D0D] border border-[rgba(255,255,255,0.04)] relative">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, ${article.gradient1}12 0%, transparent 60%),
                radial-gradient(ellipse at 70% 60%, ${article.gradient2}10 0%, transparent 55%)
              `,
            }}
          />
          {/* Decorative lines for abstract effect */}
          <div
            className="absolute top-1/3 left-[10%] right-[25%] h-px"
            style={{
              background: `linear-gradient(to right, ${article.gradient1}15, transparent)`,
            }}
          />
          <div
            className="absolute top-1/2 left-[20%] right-[15%] h-px"
            style={{
              background: `linear-gradient(to right, ${article.gradient2}10, transparent)`,
            }}
          />
          <div
            className="absolute top-2/3 left-[30%] right-[30%] h-px"
            style={{
              background: `linear-gradient(to right, ${article.gradient1}08, transparent)`,
            }}
          />
          {/* Small decorative shapes */}
          <div
            className="absolute bottom-4 right-4 w-8 h-8 rounded-lg"
            style={{
              background: `${article.gradient1}08`,
              border: `1px solid ${article.gradient1}10`,
            }}
          />
          <div
            className="absolute bottom-4 right-16 w-6 h-6 rounded-full"
            style={{
              background: `${article.gradient2}08`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-[#999] text-sm leading-relaxed line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <span className="inline-flex items-center min-h-[44px] px-2 -mx-2 rounded-lg gap-1.5 text-[#B6FF00] text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
          Read More
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.div>
  )
}

export default function ResourcesSection() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null)

  return (
    <section id="resources" className="bg-[#050505] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <SectionReveal>
          <div className="mb-8 md:mb-12">
            <SectionLabel>RESOURCES</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              INSIGHTS &amp; GUIDES
            </h2>
            <p className="text-[#aaa] text-base md:text-lg max-w-2xl leading-relaxed">
              Stay ahead of the curve with our latest articles on eCommerce strategy, platform optimization, and digital marketing.
            </p>
          </div>
        </SectionReveal>

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {blogArticles.map((article, index) => (
            <BlogCard key={article.title} article={article} index={index} onClick={() => setSelectedPost(index)} />
          ))}
        </motion.div>
        {/* Blog Post Detail Modal */}
        <AnimatePresence>
          {selectedPost !== null && blogArticles[selectedPost] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[70] bg-[rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-[#0A0A0A] border border-[rgba(182,255,0,0.12)] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar relative"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 text-[#999]" />
                </button>

                {/* Modal content */}
                <div className="p-6 md:p-8">
                  {/* Category badge + reading time */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="inline-block px-2.5 py-1 text-[11px] md:text-xs rounded-md font-semibold"
                      style={{
                        backgroundColor: `${blogArticles[selectedPost].categoryColor}18`,
                        color: blogArticles[selectedPost].categoryColor,
                      }}
                    >
                      {blogArticles[selectedPost].category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#666] text-xs">
                      <Clock className="w-3 h-3" />
                      {blogArticles[selectedPost].readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                    {blogArticles[selectedPost].title}
                  </h2>

                  {/* Date */}
                  <p className="text-[#666] text-sm mb-6">
                    {blogArticles[selectedPost].date}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-[rgba(182,255,0,0.08)] mb-6" />

                  {/* Body content */}
                  <div className="space-y-4">
                    {blogArticles[selectedPost].body.map((paragraph, i) => (
                      <p key={i} className="text-[#ccc] text-sm md:text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
