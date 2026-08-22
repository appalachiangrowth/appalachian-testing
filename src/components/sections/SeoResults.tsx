'use client'

import { motion } from '@/lib/motion'
import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'
import { usePublicContent, type SeoResultImage } from '@/hooks/usePublicContent'

export default function SeoResults() {
  const { data, isLoading } = usePublicContent()
  const images: SeoResultImage[] = data?.seoResultImages?.length
    ? data.seoResultImages
    : []

  if (!images.length && !isLoading) return null

  return (
    <section className='bg-[#050505]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
        <SectionReveal>
          <div className='mb-8 md:mb-12'>
            <SectionLabel>PROOF</SectionLabel>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4'>
              SEO RESULTS
            </h2>
            <p className='text-[#aaa] text-base md:text-lg max-w-2xl leading-relaxed'>
              Real screenshots from our clients&apos; SEO performance dashboards
            </p>
          </div>
        </SectionReveal>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
          {images.map((img, index) => (
            <motion.div
              key={img.id || img.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className='group relative rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0D0D0D] overflow-hidden hover:border-[rgba(182,255,0,0.2)] transition-all duration-300'
            >
              <div className='relative aspect-[4/3] overflow-hidden'>
                <img
                  src={img.url}
                  alt={img.title}
                  loading='lazy'
                  className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>
              {img.title && (
                <div className='p-3'>
                  <p className='text-white text-sm font-medium truncate'>{img.title}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
