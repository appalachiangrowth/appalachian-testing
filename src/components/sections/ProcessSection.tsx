'use client';

import { motion } from '@/lib/motion';
import React from 'react';
import SectionLabel from '@/components/sections/SectionLabel';

const steps = [
  {
    number: '01',
    title: 'SHARE YOUR IDEA',
    description:
      'Understand the business, products, goals, and target audience.',
  },
  {
    number: '02',
    title: 'PLANNING & RESEARCH',
    description:
      'Research the niche, competitors, customers, and store strategy.',
  },
  {
    number: '03',
    title: 'DESIGN & DEVELOPMENT',
    description:
      'Create and develop a professional Shopify or WordPress eCommerce store.',
  },
  {
    number: '04',
    title: 'PRODUCTS & SETUP',
    description:
      'Add products, collections, payment gateways, shipping, and essential settings.',
  },
  {
    number: '05',
    title: 'SEO & OPTIMIZATION',
    description:
      'Optimize SEO, speed, mobile performance, user experience, and conversions.',
  },
  {
    number: '06',
    title: 'LAUNCH YOUR STORE',
    description:
      'Complete the final setup and prepare the store for launch.',
  },
  {
    number: '07',
    title: 'SUPPORT & GROWTH',
    description:
      'Provide ongoing support, improvements, SEO, and digital marketing guidance.',
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="bg-[#050505] section-divider relative overflow-hidden">
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(182,255,0,0.01)] to-transparent' />
      <div className='bg-grid-pattern absolute inset-0 pointer-events-none' />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10 md:mb-14"
        >
          <SectionLabel>Our Process</SectionLabel>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            FROM IDEA TO ONLINE STORE
          </h2>
        </motion.div>

        {/* ===== MOBILE / TABLET VERTICAL TIMELINE ===== */}
        <div className="lg:hidden relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[15px] sm:left-[19px] md:left-[23px] lg:left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent to-[rgba(182,255,0,0.15)]" />

          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="relative flex items-start gap-4 sm:gap-5 md:gap-6"
              >
                {/* Number circle with glow ring */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[#B6FF00] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm" />
                  <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-[#B6FF00] flex items-center justify-center">
                    <span className="text-xs sm:text-sm md:text-base font-bold text-black">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-1 md:pt-3">
                  <h3 className="text-white font-bold text-base md:text-lg mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[#aaa] text-sm md:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* End dot */}
          <div className="absolute left-5 sm:left-6 md:left-8 bottom-0 -translate-x-1/2 w-2 h-2 rounded-full bg-[#B6FF00] opacity-40" />
        </div>

        {/* ===== DESKTOP HORIZONTAL TIMELINE ===== */}
        <div className="hidden lg:block relative">
          {/* Horizontal connecting line */}
          <div className="absolute top-[24px] left-0 right-0 h-px bg-[rgba(182,255,0,0.15)]" />
          {/* End glow dot */}
          <div className="absolute top-[24px] right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B6FF00] opacity-40" />

          <div className="flex items-start justify-between relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group flex flex-col items-center text-center flex-1"
              >
                {/* Number circle with glow ring */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#B6FF00] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm" />
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#B6FF00] flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(182,255,0,0.4),0_0_40px_rgba(182,255,0,0.15)] group-hover:scale-110">
                    <span className="text-sm font-bold text-black">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-bold text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-[#aaa] max-w-[140px] mx-auto leading-relaxed line-clamp-3">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
