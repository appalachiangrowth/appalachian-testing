'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
/* Image replaced with native <img> for production compatibility */
import { usePublicContent, type HeroStat } from '@/hooks/usePublicContent';
import { useSiteSettings } from '@/hooks/useSiteSettings';

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  );
}

/* ---------- Screenshot cycling ---------- */

const defaultLaptopScreenshots = [
  '/portfolio/skinnydiplondon.webp',
  '/portfolio/hgwalter.webp',
  '/portfolio/colourpop.webp',
  '/portfolio/soldejaneiro.webp',
  '/portfolio/monawatch.webp',
  '/portfolio/turtlebeach.webp',
  '/portfolio/macbookrepairlab.webp',
];

const defaultMonitorScreenshots = [
  '/portfolio/presslondon.webp',
  '/portfolio/ernestleoty.webp',
  '/portfolio/jonesroadbeauty.webp',
  '/portfolio/blackwolfnation.webp',
  '/portfolio/fentybeauty.webp',
  '/portfolio/truebotanicals.webp',
  '/portfolio/leeajewelry.webp',
  '/portfolio/burrow.webp',
];

const defaultMobileScreenshots = [
  '/portfolio/skinnydiplondon.webp',
  '/portfolio/presslondon.webp',
  '/portfolio/hgwalter.webp',
];

function useCyclingScreenshot(screenshots: string[], intervalMs = 3500, offset = 0) {
  const [index, setIndex] = useState(offset % screenshots.length);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % screenshots.length);
        setIsTransitioning(false);
      }, 400);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [screenshots.length, intervalMs]);

  return { current: screenshots[index], isTransitioning };
}

const defaultStats: HeroStat[] = [
  { value: '1000+', label: 'Stores Designed', target: 1000, suffix: '+', isStatic: false },
  { value: '3+', label: 'Years Experience', target: 3, suffix: '+', isStatic: false },
  { value: '24/7', label: 'Support', target: 0, suffix: '', isStatic: true },
  { value: '100%', label: 'Client Satisfaction', target: 100, suffix: '%', isStatic: false },
];

/* ---------- Glow Orbs ---------- */

const orbs = [
  { size: 300, x: '15%', y: '20%', color: 'rgba(182,255,0,0.07)', duration: 18, delay: 0 },
  { size: 200, x: '70%', y: '15%', color: 'rgba(182,255,0,0.05)', duration: 22, delay: 3 },
  { size: 250, x: '80%', y: '60%', color: 'rgba(0,212,255,0.04)', duration: 25, delay: 6 },
  { size: 180, x: '25%', y: '70%', color: 'rgba(182,255,0,0.04)', duration: 20, delay: 9 },
];

function GlowOrbs() {
  return (
    <div className="hero-orb-layer pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `float-orb ${orb.duration}s ease-in-out infinite ${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- CountUp Component (no framer-motion) ---------- */

function CountUp({ target, suffix, staticValue, duration = 2000 }: { target: number; suffix: string; staticValue?: string; duration?: number }) {
  const [display, setDisplay] = useState(staticValue || '0');
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  const animate = useCallback(() => {
    if (staticValue) return;
    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentValue = Math.round(easedProgress * target);
      setDisplay(currentValue.toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, suffix, duration, staticValue]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return <span ref={ref}>{display}</span>;
}

/* ---------- Device Frames ---------- */

function PhoneDevice({ screenshot, isTransitioning }: { screenshot: string; isTransitioning: boolean }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '9 / 19.5' }}>
      <div className="absolute inset-0 rounded-[14%] bg-gradient-to-b from-[#1a1a1a] via-[#111] to-[#0d0d0d] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="absolute inset-[2.5%] top-[4%] bottom-[5%] rounded-[8%] overflow-hidden bg-[#111]">
          <div
            className="w-full h-full relative transition-opacity duration-400"
            style={{ opacity: isTransitioning ? 0 : 1 }}
          >
            <img
              src={screenshot}
              alt="Mobile store preview"
              className="hero-phone-screen absolute inset-0 w-full h-full object-cover object-[50%_10%]"
              loading="lazy"
              onError={(e) => { console.warn('[Hero] Phone image failed:', screenshot); (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[35%] h-[2.8%] bg-black rounded-full z-10" />
        <div className="absolute bottom-[1.8%] left-1/2 -translate-x-1/2 w-[28%] h-[0.8%] bg-white/25 rounded-full z-10" />
        <div className="absolute right-[-1.5px] top-[22%] w-[1.5px] h-[8%] bg-[#333] rounded-r-sm" />
        <div className="absolute left-[-1.5px] top-[20%] w-[1.5px] h-[4%] bg-[#333] rounded-l-sm" />
        <div className="absolute left-[-1.5px] top-[27%] w-[1.5px] h-[4%] bg-[#333] rounded-l-sm" />
        <div className="absolute inset-[2.5%] top-[4%] bottom-[5%] rounded-[8%] pointer-events-none z-20 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
      </div>
    </div>
  );
}

function LaptopDevice({ screenshot, isTransitioning }: { screenshot: string; isTransitioning: boolean }) {
  return (
    <div className="relative w-full">
      <div className="relative bg-gradient-to-b from-[#1e1e1e] to-[#161616] rounded-t-xl overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        <div className="absolute top-0 left-0 right-0 h-[5%] flex items-center justify-center z-10">
          <div className="w-[3px] h-[3px] rounded-full bg-[#333]" />
        </div>
        <div className="absolute inset-[3%] top-[5%] rounded-sm overflow-hidden bg-[#111] shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]">
          <div
            className="w-full h-full relative transition-opacity duration-400"
            style={{ opacity: isTransitioning ? 0 : 1 }}
          >
            <img
              src={screenshot}
              alt="Laptop store preview"
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="eager"
              onError={(e) => { console.warn('[Hero] Laptop image failed:', screenshot); (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.02] via-transparent to-transparent rounded-sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[5%] flex items-center justify-center bg-[#1a1a1a]">
          <div className="w-[6px] h-[6px] rounded-full bg-[#222] border border-[#2a2a2a]" />
        </div>
      </div>
      <div className="h-[3px] bg-gradient-to-b from-[#2a2a2a] to-[#1e1e1e]" />
      <div className="relative bg-gradient-to-b from-[#1e1e1e] to-[#171717] rounded-b-xl" style={{ aspectRatio: '16 / 2.2' }}>
        <div className="absolute inset-x-[8%] top-[15%] bottom-[30%]">
          <div className="grid grid-cols-12 gap-[1px] h-full opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded-[1px]" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[30%] h-[35%] bg-[#1a1a1a] rounded-lg border border-[#252525]" />
      </div>
    </div>
  );
}

function MonitorDevice({ screenshot, isTransitioning }: { screenshot: string; isTransitioning: boolean }) {
  return (
    <div className="relative w-full">
      <div className="relative bg-gradient-to-b from-[#1e1e1e] to-[#141414] rounded-lg overflow-hidden" style={{ aspectRatio: '16 / 9.2' }}>
        <div className="absolute inset-[2.5%] top-[3%] bottom-[3%] rounded-md overflow-hidden bg-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]">
          <div
            className="w-full h-full relative transition-opacity duration-400"
            style={{ opacity: isTransitioning ? 0 : 1 }}
          >
            <img
              src={screenshot}
              alt="Desktop store preview"
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="lazy"
              onError={(e) => { console.warn('[Hero] Monitor image failed:', screenshot); (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.02] via-transparent to-transparent rounded-md" />
        </div>
        <div className="absolute bottom-[0.5%] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-[#2a2a2a] z-10" />
      </div>
      <div className="mx-auto w-[8%] h-[5%] bg-gradient-to-b from-[#1a1a1a] to-[#151515]" />
      <div className="mx-auto w-[30%] h-[3%] bg-gradient-to-b from-[#1a1a1a] to-[#111] rounded-b-xl rounded-t-sm" />
    </div>
  );
}

/* ---------- Headline ---------- */

function AnimatedHeadline({ headline }: { headline?: string }) {
  const defaultWords = ['WE', 'BUILD', 'STORES', 'THAT', 'SELL'];
  const defaultLastWord = 'ORGANICALLY';

  const words = useMemo(() => {
    if (!headline) return { words: defaultWords, lastWord: defaultLastWord };
    const parts = headline.split(' ').filter(Boolean);
    if (parts.length <= 1) return { words: parts, lastWord: '' };
    const highlightWord = parts.pop()!;
    return { words: parts, lastWord: highlightWord };
  }, [headline]);

  return (
    <h1 className="font-sans text-[1.6rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-white font-extrabold">
      {words.words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.22em] sm:mr-[0.3em] hero-word"
          style={{ animationDelay: `${0.3 + i * 0.06}s` }}
        >
          {word}
        </span>
      ))}
      {words.lastWord && (
        <span
          className="inline-block text-gradient mr-[0.05em] hero-word"
          style={{ animationDelay: `${0.3 + words.words.length * 0.06}s` }}
        >
          {words.lastWord}
        </span>
      )}
      <span
        className="inline-block hero-word"
        style={{ animationDelay: `${0.3 + (words.words.length + 1) * 0.06}s` }}
      >
        .
      </span>
    </h1>
  );
}

/* ---------- Main Hero ---------- */

export default function Hero() {
  const { data } = usePublicContent();
  const { data: settings } = useSiteSettings();

  const stats = data?.heroStats?.length ? data.heroStats : defaultStats;

  const heroHeadline = settings?.hero_headline || '';
  const heroSubtext = settings?.hero_subtext || 'High-converting Shopify & WordPress stores built for growth.';
  const heroDescription = settings?.hero_description || 'We build fast, conversion-focused eCommerce stores that don\'t just look good — they\'re built to attract customers and generate sales.';
  const heroCtaPrimary = settings?.hero_cta_primary || 'Get Your Store Built';
  const heroCtaSecondary = settings?.hero_cta_secondary || 'View Our Work';
  const processStepsSetting = settings?.hero_process_steps || '';
  const processSteps = processStepsSetting
    ? processStepsSetting.split(',').map(s => s.trim()).filter(Boolean)
    : ['Design', 'Development', 'SEO', 'Growth'];

  const screenshotGroups = (() => {
    if (!data?.heroScreenshots?.length) {
      return {
        laptop: defaultLaptopScreenshots,
        monitor: defaultMonitorScreenshots,
        mobile: defaultMobileScreenshots,
      };
    }
    const grouped: Record<string, string[]> = { laptop: [], monitor: [], mobile: [] };
    for (const ss of data.heroScreenshots) {
      const cat = ss.category as keyof typeof grouped;
      if (grouped[cat]) grouped[cat].push(ss.url);
    }
    return {
      laptop: grouped.laptop.length ? grouped.laptop : defaultLaptopScreenshots,
      monitor: grouped.monitor.length ? grouped.monitor : defaultMonitorScreenshots,
      mobile: grouped.mobile.length ? grouped.mobile : defaultMobileScreenshots,
    };
  })();

  const phone = useCyclingScreenshot(screenshotGroups.mobile, 3000, 0);
  const laptop = useCyclingScreenshot(screenshotGroups.laptop, 4000, 2);
  const monitor = useCyclingScreenshot(screenshotGroups.monitor, 5000, 4);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center overflow-hidden bg-[#050505] px-3 sm:px-4 pt-12 sm:pt-16 pb-6 sm:pb-10"
    >
      {/* Animated mesh gradient background */}
      <div className="hero-mesh pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-mesh-gradient absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin-slow_60s_linear_infinite]" style={{background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(182,255,0,0.03) 60deg, transparent 120deg, rgba(0,212,255,0.02) 240deg, transparent 360deg)', filter: 'blur(80px)'}} />
      </div>

      <GlowOrbs />

      {/* Subtle radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(182,255,0,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Dot-grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(182,255,0,0.02) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center text-center w-full">
        <div className="mobile-text-layer flex w-full flex-col items-center">
        {/* Headline */}
        <AnimatedHeadline headline={heroHeadline} />

        {/* Subtext */}
        <p className="hero-fade-up mx-auto mt-4 sm:mt-6 max-w-2xl text-sm leading-relaxed text-[#ccc] sm:text-lg md:text-xl" style={{ animationDelay: '0.8s' }}>
          {heroSubtext}
        </p>

        {/* Process Flow */}
        <div className="hero-fade-up mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base" style={{ animationDelay: '1s' }}>
          {processSteps.map((step, i) => (
            <span key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="text-white/90 font-medium">{step}</span>
              {i < processSteps.length - 1 && (
                <span className="text-[#B6FF00] font-light">→</span>
              )}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="hero-fade-up mx-auto mt-4 sm:mt-6 max-w-2xl text-xs leading-relaxed text-[#888] sm:text-sm md:text-base" style={{ animationDelay: '1.2s' }}>
          {heroDescription}
        </p>

        {/* CTA Buttons */}
        <div className="hero-fade-up mt-5 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto" style={{ animationDelay: '1.4s' }}>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hero-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full bg-[#B6FF00] w-full sm:w-auto px-5 py-3 text-sm font-semibold text-[#050505] sm:px-8 sm:py-4 sm:text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_20px_rgba(182,255,0,0.15)]"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="relative inline-flex items-center gap-2">
              {heroCtaPrimary}
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full border-2 border-[rgba(182,255,0,0.35)] w-full sm:w-auto px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[rgba(182,255,0,0.6)] hover:text-[#B6FF00] hover:shadow-[0_0_25px_rgba(182,255,0,0.15)] sm:px-8 sm:py-4 sm:text-base"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[rgba(182,255,0,0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative">{heroCtaSecondary}</span>
          </a>
        </div>

        </div>

        {/* Device Mockups */}
        <div className="hero-fade-up relative mt-6 sm:mt-10 lg:mt-12 w-full max-w-5xl" style={{ animationDelay: '1.6s' }}>
          <div
            className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8"
            style={{ perspective: '1200px' }}
          >
            {/* Phone */}
            <div
              className="hero-float relative z-10 w-[76px] sm:w-[85px] md:w-[100px] lg:w-[115px] shrink-0"
              style={{
                transform: 'rotateY(8deg) rotateX(2deg)',
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
                animationDelay: '0.5s',
              }}
            >
              <PhoneDevice screenshot={phone.current} isTransitioning={phone.isTransitioning} />
            </div>

            {/* Laptop */}
            <div
              className="hero-float relative z-20 w-[140px] sm:w-[240px] md:w-[290px] lg:w-[340px] shrink-0"
              style={{
                transform: 'rotateY(-3deg) rotateX(2deg)',
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.5))',
                animationDelay: '1s',
                animationDuration: '5s',
              }}
            >
              <LaptopDevice screenshot={laptop.current} isTransitioning={laptop.isTransitioning} />
            </div>

            {/* Desktop Monitor - hidden on very small screens */}
            <div
              className="hero-float relative z-30 hidden sm:block w-[160px] md:w-[260px] lg:w-[350px] shrink-0"
              style={{
                transform: 'rotateY(-2deg)',
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.5))',
                animationDuration: '4.5s',
              }}
            >
              <MonitorDevice screenshot={monitor.current} isTransitioning={monitor.isTransitioning} />
            </div>
          </div>

          {/* Glow under devices */}
          <div
            className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-[70%] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(182,255,0,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Trust Stats Bar */}
        <div className="hero-fade-up relative z-10 mt-4 sm:mt-8 lg:mt-10 w-full max-w-md sm:max-w-4xl" style={{ animationDelay: '1.8s' }}>
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[rgba(182,255,0,0.1)] bg-[#0A0A0A]/80 py-3 px-3 sm:py-5 sm:px-6 lg:py-8 lg:px-10 backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.04)] to-transparent" style={{animation: 'shimmer 8s ease-in-out infinite'}} />
            </div>
            <div className="grid grid-cols-2">
              {stats.map((stat, i) => (
                <div
                  key={stat.id || stat.label}
                  className={`flex flex-col items-center justify-center text-center py-1 sm:py-2 ${
                    i % 2 === 0
                      ? 'border-r border-[rgba(182,255,0,0.12)]'
                      : ''
                  } ${
                    i < 2
                      ? 'border-b border-[rgba(182,255,0,0.08)] sm:border-b-[rgba(182,255,0,0.12)]'
                      : ''
                  }`}
                >
                  <span className="text-xl font-bold text-[#B6FF00] leading-none sm:text-2xl md:text-3xl">
                    {stat.isStatic ? (
                      stat.value
                    ) : (
                      <CountUp target={stat.target} suffix={stat.suffix} />
                    )}
                  </span>
                  <span className="mt-1 text-[10px] font-medium text-[#999] leading-tight sm:text-xs md:text-sm sm:text-[#888]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <div
          className="hero-fade-up relative z-10 mt-4 sm:mt-6 flex-col items-center gap-2 opacity-50 hidden sm:flex"
          style={{ animationDelay: '2.2s' }}
        >
          <ChevronDown className="h-5 w-5 text-[#B6FF00] hero-bounce" />
          <span className="text-[10px] tracking-widest uppercase text-[#666]">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
