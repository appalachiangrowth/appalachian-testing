'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView } from '@/lib/motion'
import {
  Palette,
  Smartphone,
  Search,
  Target,
  Zap,
  Shield,
} from 'lucide-react'
import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'

const stats = [
  { value: '1000+', label: 'Stores Built', target: 1000, suffix: '+', isStatic: false },
  { value: '3+', label: 'Years Experience', target: 3, suffix: '+', isStatic: false },
  { value: '24/7', label: 'Support', target: 0, suffix: '', isStatic: true },
  { value: '100%', label: 'Satisfaction', target: 100, suffix: '%', isStatic: false },
]

const features = [
  {
    icon: Palette,
    title: 'Premium Design',
    description: 'Pixel-perfect designs that reflect your brand identity.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Every store looks and works perfectly on all devices.',
  },
  {
    icon: Search,
    title: 'SEO Friendly',
    description: 'Built with search engine optimization from the ground up.',
  },
  {
    icon: Target,
    title: 'Conversion Focused',
    description: 'Strategies designed to turn visitors into paying customers.',
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Optimized for speed with lightning-fast load times.',
  },
  {
    icon: Shield,
    title: 'Secure & Scalable',
    description: 'Enterprise-grade security that grows with your business.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
}

/* ---------- CountUp Component ---------- */

function CountUp({
  target,
  suffix,
  staticValue,
  duration = 2000,
}: {
  target: number
  suffix: string
  staticValue?: string
  duration?: number
}) {
  const [display, setDisplay] = useState(staticValue || '0')
  const hasAnimated = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const animate = useCallback(() => {
    if (staticValue) return

    const startTime = performance.now()
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      const currentValue = Math.round(easedProgress * target)

      setDisplay(currentValue.toLocaleString() + suffix)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [target, suffix, duration, staticValue])

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      animate()
    }
  }, [isInView, animate])

  return <span ref={ref}>{display}</span>
}

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="section-fade-in relative bg-[#050505] border-t border-b border-[rgba(182,255,0,0.08)] overflow-hidden">
      {/* Dot-grid background overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(182,255,0,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 250,
            height: 250,
            left: '80%',
            top: '20%',
            background: 'radial-gradient(circle, rgba(182,255,0,0.04) 0%, transparent 70%)',
            animation: 'float-orb 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            left: '20%',
            top: '80%',
            background: 'radial-gradient(circle, rgba(182,255,0,0.03) 0%, transparent 70%)',
            animation: 'float-orb 25s ease-in-out infinite 5s',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <SectionLabel>WHY CHOOSE US</SectionLabel>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl mx-auto">
            TRUSTED BY 1000+ BUSINESSES WORLDWIDE
          </h2>
        </motion.div>

        {/* Statistics Row */}
        <SectionReveal>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 sm:mb-12 md:mb-16"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center relative"
            >
              <div className="rounded-xl bg-[rgba(182,255,0,0.03)] backdrop-blur-sm p-3 sm:p-4 md:p-6 border border-[rgba(182,255,0,0.06)]">
                <div className="relative inline-block">
                  <div className="absolute inset-0 -m-2 rounded-full bg-[rgba(182,255,0,0.06)] animate-pulse" />
                  <div className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-[#B6FF00] neon-text-glow">
                    {stat.isStatic ? (
                      stat.value
                    ) : (
                      <CountUp
                        target={stat.target}
                        suffix={stat.suffix}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2 text-[#999] text-sm md:text-base">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </SectionReveal>

        {/* Feature Cards */}
        <SectionReveal delay={0.15}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="card-shine relative overflow-hidden bg-[#0A0A0A] rounded-xl p-4 sm:p-5 md:p-6 border border-[rgba(182,255,0,0.08)] hover:border-[rgba(182,255,0,0.2)] transition-all duration-300 group"
              >
                {/* Top gradient line on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.25)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover gradient from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(182,255,0,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[rgba(182,255,0,0.08)] flex items-center justify-center mb-4 group-hover:bg-[rgba(182,255,0,0.14)] group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-[#B6FF00]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-[#aaa] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}
