'use client'

import { motion } from '@/lib/motion'
import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'
import { usePublicContent, type Transformation } from '@/hooks/usePublicContent'

// Fallback data used during loading or when the API is unavailable
const defaultTransformations: Transformation[] = [
  {
    client: 'Luxe Fashion',
    metric: 'Conversion Rate',
    before: '1.2%',
    after: '4.8%',
    improvement: '300%',
    description:
      'Complete Shopify Plus redesign with custom checkout and product pages',
  },
  {
    client: 'Glow Beauty',
    metric: 'Page Load Speed',
    before: '6.2s',
    after: '2.1s',
    improvement: '66%',
    description:
      'Headless WooCommerce rebuild with optimized assets and CDN',
  },
  {
    client: 'TechVault',
    metric: 'Monthly Revenue',
    before: '$45K',
    after: '$128K',
    improvement: '184%',
    description:
      'Google Ads + SEO strategy driving qualified traffic',
  },
]

export default function ResultsShowcase() {
  const { data } = usePublicContent()
  const transformations = data?.transformations?.length
    ? data.transformations
    : defaultTransformations

  return (
    <section id="results" className="bg-[#050505] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <SectionReveal>
          <div className="mb-8 md:mb-12">
            <SectionLabel>RESULTS</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              TRANSFORMATIONS THAT SPEAK
            </h2>
            <p className="text-[#aaa] text-base md:text-lg max-w-2xl leading-relaxed">
              See the real results we&apos;ve delivered for our clients
            </p>
          </div>
        </SectionReveal>

        {/* Transformation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {transformations.map((t, index) => (
            <motion.div
              key={t.client}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="bg-[#0D0D0D] rounded-2xl border border-[rgba(182,255,0,0.08)] p-5 md:p-6 card-shine overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">
                  {t.client}
                </h3>
                <span className="text-[#666] text-xs font-medium uppercase tracking-wider">
                  {t.metric}
                </span>
              </div>

              {/* Before / After Comparison */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Before */}
                <div className="bg-[#0A0A0A] rounded-xl p-3 sm:p-4 text-center">
                  <span className="block text-[#666] text-[10px] uppercase tracking-widest mb-2 font-medium">
                    Before
                  </span>
                  {/* Visual bar representing old value */}
                  <div className="w-full h-1.5 bg-[rgba(255,255,255,0.04)] rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full bg-[#444] rounded-full"
                      style={{ width: '25%' }}
                    />
                  </div>
                  <span className="text-[#888] text-xl font-mono">
                    {t.before}
                  </span>
                </div>

                {/* After */}
                <div className="bg-[rgba(182,255,0,0.06)] rounded-xl p-3 sm:p-4 text-center">
                  <span className="block text-[rgba(182,255,0,0.6)] text-[10px] uppercase tracking-widest mb-2 font-medium">
                    After
                  </span>
                  {/* Visual bar representing new value */}
                  <div className="w-full h-1.5 bg-[rgba(182,255,0,0.08)] rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full bg-[#B6FF00] rounded-full"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <span className="text-[#B6FF00] text-2xl font-bold font-mono">
                    {t.after}
                  </span>
                </div>
              </div>

              {/* Arrow indicator between before/after on mobile visual */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#444]" />
                  <div className="w-12 h-px bg-gradient-to-r from-[#444] to-[#B6FF00]" />
                  <div className="w-2 h-2 rounded-full bg-[#B6FF00]" />
                </div>
              </div>

              {/* Improvement Badge */}
              <div className="mb-3">
                <span className="bg-[#B6FF00] text-[#050505] rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold">
                  ↑ {t.improvement} Improvement
                </span>
              </div>

              {/* Description */}
              <p className="text-[#888] text-sm leading-relaxed">
                {t.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
