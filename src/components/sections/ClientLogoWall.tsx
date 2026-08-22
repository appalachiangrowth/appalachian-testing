'use client';

import React, { useRef, useState, useEffect } from 'react';

const ROW_1_BRANDS = [
  'LUXE FASHION',
  'TECHVAULT',
  'PURESKIN',
  'URBAN OUTFITTERS',
  'GLOW BEAUTY',
  'ARTISAN COFFEE',
  'FIT GEAR PRO',
  'WANDERLUST CO',
] as const;

const ROW_2_BRANDS = [
  'NORDIC HOME',
  'PET PARADISE',
  'BOOKWORM',
  'GREEN EARTH',
  'SILK ROAD',
  'CYBER GEAR',
  'BLOOM FLORAL',
  'SUMMIT SPORTS',
] as const;

function MarqueeRow({
  brands,
  reverse = false,
}: {
  brands: readonly string[];
  reverse?: boolean;
}) {
  const items = brands.flatMap((brand, i) => [
    <span
      key={`a-${i}`}
      className="flex-shrink-0 mx-6 md:mx-10 text-[#444] hover:text-[#B6FF00] transition-colors duration-300 font-bold text-lg md:text-xl tracking-wider uppercase whitespace-nowrap cursor-default"
    >
      {brand}
    </span>,
    <span
      key={`a-d-${i}`}
      className="flex-shrink-0 text-[#333] text-lg select-none"
      aria-hidden="true"
    >
      ·
    </span>,
  ]);

  const itemsDuplicate = brands.flatMap((brand, i) => [
    <span
      key={`b-${i}`}
      className="flex-shrink-0 mx-6 md:mx-10 text-[#444] hover:text-[#B6FF00] transition-colors duration-300 font-bold text-lg md:text-xl tracking-wider uppercase whitespace-nowrap cursor-default"
    >
      {brand}
    </span>,
    <span
      key={`b-d-${i}`}
      className="flex-shrink-0 text-[#333] text-lg select-none"
      aria-hidden="true"
    >
      ·
    </span>,
  ]);

  return (
    <div className="overflow-hidden">
      <div
        className="marquee-track flex w-max"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {items}
        {itemsDuplicate}
      </div>
    </div>
  );
}

export default function ClientLogoWall() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: '-20%', threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="clients"
      className="py-10 md:py-14 bg-[#0A0A0A] border-t border-[rgba(182,255,0,0.08)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      <p className="text-center text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-8">
        TRUSTED BY LEADING BRANDS
      </p>
      <div className="flex flex-col gap-4">
        <MarqueeRow brands={[...ROW_1_BRANDS]} />
        <MarqueeRow brands={[...ROW_2_BRANDS]} reverse />
      </div>
    </section>
  );
}
