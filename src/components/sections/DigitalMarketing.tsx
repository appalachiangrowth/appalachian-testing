'use client'

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'
import {
  Search,
  Megaphone,
  Globe,
  Video,
  Users,
  BarChart3,
  TrendingUp,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'
import { usePublicContent, type MarketingService, type MarketingMetric } from '@/hooks/usePublicContent'

// ─── Icon name → Lucide component mapping ───
const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Megaphone,
  Globe,
  Video,
  Users,
  BarChart3,
}

// Fallback services used during loading or when the API is unavailable
const defaultServices: (MarketingService & { iconComponent?: LucideIcon })[] = [
  { icon: 'Search', title: 'SEO', description: 'Dominate search results with our comprehensive SEO strategy.', stat: '150%+ organic traffic growth' },
  { icon: 'Megaphone', title: 'Meta Ads', description: 'Targeted Facebook and Instagram ads that convert.', stat: '5x average ROAS' },
  { icon: 'Globe', title: 'Google Ads', description: 'Strategic Google Ads campaigns for maximum ROI.', stat: '300%+ average ROI' },
  { icon: 'Video', title: 'TikTok Ads', description: 'Viral TikTok campaigns for brand awareness and sales.', stat: '10M+ views generated' },
  { icon: 'Users', title: 'Social Media Marketing', description: 'Build and engage your community across platforms.', stat: '50K+ followers gained' },
  { icon: 'BarChart3', title: 'Conversion Optimization', description: 'A/B testing and optimization for maximum conversions.', stat: '40%+ conversion increase' },
]

// Fallback metrics
const defaultMetrics: MarketingMetric[] = [
  { metric: 'Monthly Revenue', before: '$12,400', after: '$127,450', increase: '+928%' },
  { metric: 'Organic Traffic', before: '3,200 visits', after: '84,230 visits', increase: '+2,532%' },
  { metric: 'Conversion Rate', before: '1.2%', after: '4.8%', increase: '+300%' },
  { metric: 'Cost Per Acquisition', before: '$45', after: '$12', increase: '-73%' },
]

function useInViewOnce(margin = '-50px') {
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [margin])
  return { ref, isVisible }
}

function CountMetric({ value, className = '' }: { value: string; className?: string }) {
  const { ref, isVisible } = useInViewOnce()
  const [display, setDisplay] = useState('0')
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
  const parseValue = useCallback((str: string) => {
    const match = str.match(/^(\$?)([\d,]+(?:\.\d+)?)(.*)$/)
    if (!match) return { prefix: '', number: 0, suffix: str, decimals: 0 }
    const [, prefix, numStr, suffix] = match
    const num = parseFloat(numStr.replace(/,/g, ''))
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
    return { prefix, number: num, suffix, decimals }
  }, [])
  const { prefix, number: target, suffix, decimals } = parseValue(value)
  useEffect(() => {
    if (!isVisible) return
    const duration = 2000
    const startTime = performance.now()
    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const current = easedProgress * target
      if (decimals > 0) { setDisplay(prefix + current.toFixed(decimals) + suffix) }
      else { const formatted = Math.round(current).toLocaleString('en-US'); setDisplay(prefix + formatted + suffix) }
      if (progress < 1) { requestAnimationFrame(animate) }
    }
    requestAnimationFrame(animate)
  }, [isVisible, target, prefix, suffix, decimals])
  return <span ref={ref} className={className}>{display}</span>
}

function InViewFadeUp({ children, margin = '-80px', delay = 0 }: { children: ReactNode; margin?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [margin])
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(30px)', transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  )
}

/* ---------- Main Component ---------- */
export default function DigitalMarketing() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridVisible, setGridVisible] = useState(false)
  const { data } = usePublicContent()

  const services = data?.marketingServices?.length ? data.marketingServices : defaultServices
  const beforeAfterMetrics = data?.marketingMetrics?.length ? data.marketingMetrics : defaultMetrics

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setGridVisible(true); observer.disconnect(); } },
      { rootMargin: '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="digital-marketing" className="bg-[#050505] relative overflow-hidden">
      <div className='bg-grid-pattern absolute inset-0 pointer-events-none opacity-50' />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionReveal>
          <InViewFadeUp margin='0px'>
            <div className="mb-8 md:mb-12 mt-4">
              <SectionLabel>SEO+DIGITAL MARKETING</SectionLabel>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 max-w-4xl">
                GROW YOUR BUSINESS WITH DATA-DRIVEN MARKETING
              </h2>
              <p className="text-[#aaa] text-base md:text-lg max-w-2xl leading-relaxed">
                From SEO to social media, we create comprehensive marketing strategies that drive real results and sustainable growth for your online store.
              </p>
            </div>
          </InViewFadeUp>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <InViewFadeUp margin='0px' delay={0.1}>
            <div className="mb-8 sm:mb-12 md:mb-16">
              <div className="rounded-2xl border border-[rgba(182,255,0,0.15)] bg-[#0A0A0A] p-4 sm:p-5 md:p-8 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(182,255,0,0.04) 0%, transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(182,255,0,0.1)] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#B6FF00]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">REAL RESULTS WE&apos;VE DELIVERED</h3>
                      <p className="text-[#666] text-sm">Average client performance improvement</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {beforeAfterMetrics.map((item) => (
                      <div key={item.id || item.metric} className="text-center">
                        <div className="text-[#666] text-[10px] sm:text-xs mb-2">{item.metric}</div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-[#555] text-xs sm:text-sm line-through">{item.before}</span>
                          <ArrowRight className="w-3 h-3 text-[#333]" />
                          <CountMetric value={item.after} className="text-white text-xs sm:text-sm md:text-base font-bold" />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold ${item.increase.startsWith('-') ? 'text-[#00D4FF]' : 'text-[#B6FF00]'}`}>{item.increase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </InViewFadeUp>
        </SectionReveal>

        <div ref={gridRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon ? (ICON_MAP[service.icon] || BarChart3) : BarChart3
              return (
                <div
                  key={service.id || service.title}
                  style={{
                    opacity: gridVisible ? 1 : 0,
                    transform: gridVisible ? 'none' : 'translateY(30px)',
                    transition: `opacity 0.5s cubic-bezier(0.25, 0.4, 0.25, 1) ${index * 0.1}s, transform 0.5s cubic-bezier(0.25, 0.4, 0.25, 1) ${index * 0.1}s`,
                  }}
                  className="card-shine bg-[#0A0A0A] rounded-xl p-4 sm:p-5 md:p-6 border border-[rgba(182,255,0,0.08)] hover:border-[rgba(182,255,0,0.2)] transition-all duration-300 group relative overflow-hidden hover:-translate-y-[6px]"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(182,255,0,0.06), 0 0 0 1px rgba(182,255,0,0.12)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 0 rgba(182,255,0,0)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-12 h-12 rounded-full bg-[rgba(182,255,0,0.08)] flex items-center justify-center mb-4 group-hover:bg-[rgba(182,255,0,0.14)] transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-[#B6FF00]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-[#999] text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="pt-3 border-t border-[rgba(182,255,0,0.08)]">
                    <span className="text-[#B6FF00] text-sm font-bold">{service.stat}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}