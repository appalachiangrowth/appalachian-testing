'use client';

import { motion } from '@/lib/motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SectionLabel from '@/components/sections/SectionLabel';

export default function CTABanner() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id='cta-banner'
      className='relative w-full bg-[#080A03] border-t border-b border-[rgba(182,255,0,0.08)] overflow-hidden'
    >
      {/* Animated gradient border overlay */}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.2)] to-transparent' style={{animation: 'shimmer 4s ease-in-out infinite'}} />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.15)] to-transparent' style={{animation: 'shimmer 4s ease-in-out infinite 2s'}} />

      {/* Floating particles */}
      <div className='pointer-events-none absolute left-[15%] bottom-0 w-1 h-1 rounded-full bg-[#B6FF00]' style={{opacity: 0.4, animation: 'float-particle 8s ease-in-out infinite'}} />
      <div className='pointer-events-none absolute left-[40%] bottom-0 w-1.5 h-1.5 rounded-full bg-[#B6FF00]' style={{opacity: 0.3, animation: 'float-particle 10s ease-in-out infinite 2s'}} />
      <div className='pointer-events-none absolute left-[65%] bottom-0 w-1 h-1 rounded-full bg-[#B6FF00]' style={{opacity: 0.35, animation: 'float-particle 9s ease-in-out infinite 4s'}} />
      <div className='pointer-events-none absolute left-[85%] bottom-0 w-0.5 h-0.5 rounded-full bg-[#B6FF00]' style={{opacity: 0.5, animation: 'float-particle 7s ease-in-out infinite 1s'}} />

      {/* Radial gradient glow */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(182,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Decorative left dot */}
      <div className='pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 hidden md:block'>
        <div className='w-2.5 h-2.5 rounded-full bg-[#B6FF00] opacity-20' />
      </div>

      {/* Decorative right dot */}
      <div className='pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden md:block'>
        <div className='w-2.5 h-2.5 rounded-full bg-[#B6FF00] opacity-20' />
      </div>

      <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 lg:py-24 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='relative'
        >
          {/* Animated pulsing glow */}
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(182,255,0,0.08),transparent_70%)] animate-[pulse-glow_3s_ease-in-out_infinite] pointer-events-none' />
          <SectionLabel>READY TO START?</SectionLabel>
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
            LET&apos;S BUILD SOMETHING{' '}
            <span className='text-gradient'>AMAZING</span> TOGETHER
          </h2>
          <p className='text-[#aaa] text-base md:text-lg mt-4 max-w-xl mx-auto leading-relaxed'>
            Join 1000+ businesses that trust us to build their online stores. Get a free
            consultation today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-10'
        >
          <motion.button
            onClick={scrollToContact}
            className='group flex items-center justify-center gap-2 bg-[#B6FF00] text-[#050505] rounded-full font-semibold w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 cursor-pointer hover:ring-2 hover:ring-[rgba(182,255,0,0.5)]'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Your Project
            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
          </motion.button>

          <motion.button
            onClick={scrollToPortfolio}
            className='group flex items-center justify-center gap-2 border border-[rgba(182,255,0,0.25)] text-white rounded-full w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 hover:border-[rgba(182,255,0,0.5)] hover:text-[#B6FF00] hover:ring-2 hover:ring-[rgba(182,255,0,0.3)] transition-all cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            View Portfolio
            <ExternalLink className='w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
