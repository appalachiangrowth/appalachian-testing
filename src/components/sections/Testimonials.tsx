'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Star, Quote } from 'lucide-react'
import SectionLabel from '@/components/sections/SectionLabel'
import { usePublicContent, type Testimonial } from '@/hooks/usePublicContent'

// Fallback data used during loading or when the API is unavailable
const defaultTestimonials: Testimonial[] = [
  { name: 'Sarah Mitchell', role: 'CEO, Luxe Fashion', type: 'Fashion eCommerce', text: 'Appalachian Growth Solutions transformed our online presence completely. Our Shopify store looks incredible and our sales have increased by 200% since launch.', rating: 5 },
  { name: 'James Rodriguez', role: 'Founder, TechVault', type: 'Electronics Store', text: 'Professional, responsive, and incredibly talented. They built our WordPress store exactly how we envisioned it. Highly recommended!', rating: 5 },
  { name: 'Emily Chen', role: 'Owner, PureSkin', type: 'Beauty & Skincare', text: 'The best decision we made was hiring Appalachian Growth Solutions. Our store is fast, beautiful, and our customers love the shopping experience.', rating: 4 },
  { name: 'Michael Torres', role: 'Director, Summit Sports', type: 'Sports Equipment', text: 'The team at Appalachian Growth Solutions delivered an enterprise-level Shopify Plus store that handles 10K+ daily orders flawlessly. Their technical expertise is unmatched.', rating: 5 },
  { name: 'Aisha Khan', role: 'Founder, Nordic Home', type: 'Home & Living', text: 'From concept to launch, Appalachian Growth Solutions made the entire process seamless. Our WordPress store is beautiful and our customers love the experience.', rating: 5 },
  { name: 'David Park', role: 'CTO, Green Earth', type: 'Sustainable Products', text: 'Appalachian Growth Solutions helped us implement complex subscription features and custom product builders. They are true eCommerce experts.', rating: 4 },
]

function useInViewOnce(margin = '-100px') {
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
  return { ref, isVisible }
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const initial = testimonial.name ? testimonial.name.charAt(0).toUpperCase() : '?'

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -2
    const rotateY = ((x - centerX) / centerX) * 2
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
  }, [])

  return (
    <div
      className='group relative overflow-hidden bg-[#0A0A0A] rounded-2xl p-4 sm:p-5 md:p-8 border border-[rgba(182,255,0,0.08)] border-l-2 border-l-[rgba(182,255,0,0.2)] hover:border-[rgba(182,255,0,0.2)] hover:border-l-[rgba(182,255,0,0.4)] hover:-translate-y-1 transition-all duration-300'
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 150ms ease-out, box-shadow 300ms ease, border-color 300ms ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[rgba(182,255,0,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-b-2xl' />
      <div className='absolute -top-2 -left-1 text-[#B6FF00] opacity-10 text-6xl leading-none font-serif select-none pointer-events-none'>&ldquo;</div>
      <Quote className='w-8 h-8 text-[rgba(182,255,0,0.12)] mb-4 group-hover:text-[rgba(182,255,0,0.25)] transition-colors duration-300 [&>svg]:group-hover:animate-pulse' style={{ animation: 'none' }} />
      <div className='flex gap-0.5 mb-4'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-[#B6FF00] fill-[#B6FF00]' : 'text-[#333]'}`} />
        ))}
      </div>
      <p className='text-[#bbb] text-sm sm:text-base md:text-[17px] leading-relaxed mb-6'>&ldquo;{testimonial.text}&rdquo;</p>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[rgba(182,255,0,0.15)] group-hover:bg-[rgba(182,255,0,0.25)] text-[#B6FF00] font-bold flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-105'>
          {initial}
        </div>
        <div>
          <p className='text-white font-semibold text-sm'>{testimonial.name}</p>
          <p className='text-[#777] text-sm'>{testimonial.role}</p>
          {testimonial.type && (
            <span className='inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded bg-[rgba(182,255,0,0.08)] text-[#B6FF00]'>{testimonial.type}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { ref, isVisible } = useInViewOnce('-100px')
  const { data } = usePublicContent()
  const testimonials = data?.testimonials?.length
    ? data.testimonials
    : defaultTestimonials

  return (
    <section id='testimonials' className='section-fade-in relative bg-[#050505] overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute rounded-full' style={{ width: 300, height: 300, left: '10%', top: '30%', background: 'radial-gradient(circle, rgba(182,255,0,0.03) 0%, transparent 70%)', animation: 'float-orb 22s ease-in-out infinite' }} />
        <div className='absolute rounded-full' style={{ width: 200, height: 200, left: '85%', top: '60%', background: 'radial-gradient(circle, rgba(182,255,0,0.04) 0%, transparent 70%)', animation: 'float-orb 18s ease-in-out infinite 4s' }} />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
        <div
          ref={ref}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
          className='text-center mb-10 sm:mb-14 md:mb-16'
        >
          <SectionLabel>Testimonials</SectionLabel>
          <h2
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.15s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.15s',
            }}
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'
          >
            WHAT OUR CLIENTS SAY
          </h2>
        </div>

        <div
          style={{ opacity: isVisible ? 1 : 0 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : 'translateY(30px)',
                transition: `opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) ${0.15 + index * 0.15}s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) ${0.15 + index * 0.15}s`,
              }}
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
