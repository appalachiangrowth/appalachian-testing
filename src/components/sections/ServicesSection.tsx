'use client';

import {
  ShoppingCart,
  Globe,
  RefreshCw,
  Package,
  Search,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import SectionLabel from '@/components/sections/SectionLabel';

const services = [
  {
    icon: ShoppingCart,
    title: 'Shopify Store Development',
    description:
      'Custom Shopify stores designed to convert visitors into customers.',
  },
  {
    icon: Globe,
    title: 'WordPress Store Development',
    description:
      'Professional WooCommerce stores with full customization.',
  },
  {
    icon: RefreshCw,
    title: 'Store Redesign',
    description:
      'Transform your existing store into a modern, high-converting design.',
  },
  {
    icon: Package,
    title: 'Product & Collection Setup',
    description:
      'Complete product upload, organization, and collection management.',
  },
  {
    icon: Search,
    title: 'SEO Optimization',
    description:
      'Rank higher on Google and drive organic traffic to your store.',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    description:
      'Strategic marketing campaigns across all major platforms.',
  },
  {
    icon: Target,
    title: 'Conversion Optimization',
    description:
      "Increase your store's conversion rate with data-driven strategies.",
  },
  {
    icon: Zap,
    title: 'Speed & Performance',
    description:
      'Lightning-fast load times for better UX and SEO rankings.',
  },
];

function useInViewOnce(margin = '-80px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);
  return { ref, isVisible };
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(182,255,0,0.06) 0%, transparent 60%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  const Icon = service.icon;

  return (
    <div
      className="group relative overflow-hidden flex flex-col bg-[#0A0A0A] rounded-xl p-4 sm:p-5 md:p-6 border border-[rgba(182,255,0,0.06)] hover:border-[rgba(182,255,0,0.3)] transition-all duration-300 cursor-default"
      style={{
        boxShadow: '0 0 0 0 rgba(182,255,0,0)',
        transformStyle: 'preserve-3d',
        transition: 'transform 150ms ease-out, box-shadow 300ms ease, border-color 300ms ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 16px 48px rgba(182,255,0,0.06), 0 0 0 1px rgba(182,255,0,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 0 0 0 rgba(182,255,0,0)';
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
      ref={cardRef}
    >
      {/* Spotlight that follows the cursor */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-0 rounded-xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 60%)',
        }}
      />

      {/* Top gradient line on hover */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

      {/* Subtle inner glow on hover */}
      <div className='absolute inset-0 bg-gradient-to-b from-[rgba(182,255,0,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />

      <div className='flex-1 relative z-10'>
        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[rgba(182,255,0,0.08)] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-[rgba(182,255,0,0.14)] group-hover:shadow-[0_0_16px_rgba(182,255,0,0.2)]">
          <Icon className="w-5 h-5 text-[#B6FF00]" />
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm md:text-base mb-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[#aaa] text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useInViewOnce('-80px');
  const { ref: gridRef, isVisible: gridVisible } = useInViewOnce('-40px');

  return (
    <section id="services-grid" className="bg-[#0A0A0A] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <div
          ref={headerRef}
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
          className="text-center mb-8 sm:mb-10 md:mb-14"
        >
          <SectionLabel>Our Services</SectionLabel>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            EVERYTHING YOU NEED TO{' '}
            <br className="hidden sm:block" />
            GROW ONLINE
          </h2>
          <p className="text-[#aaa] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            From store development to digital marketing, we provide end-to-end
            solutions to build and scale your eCommerce business.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={gridRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {services.map((service, index) => (
              <div
                key={service.title}
                style={{
                  opacity: gridVisible ? 1 : 0,
                  transform: gridVisible ? 'none' : 'translateY(30px)',
                  transition: `opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.08}s, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.08}s`,
                }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
