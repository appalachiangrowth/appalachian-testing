'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ShoppingBag,
  Globe,
  TrendingUp,
  Check,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Zap,
  Shield,
  Eye,
  Palette,
  ShoppingCart,
  Search,
  Layers,
  X,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';
import SectionReveal from '@/components/sections/SectionReveal';
import SectionLabel from '@/components/sections/SectionLabel';
import { usePublicContent, SeoResultImage, PlatformImage } from '@/hooks/usePublicContent';

/* ---------- data types ---------- */

interface PortfolioEntry {
  name: string;
  industry: string;
  description: string;
  image: string;
  accent: string;
  url?: string;
}

interface CaseStudyEntry {
  name: string;
  tool: string;
  period: string;
  image: string;
  url?: string;
}

interface FeatureEntry {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PlatformData {
  key: string;
  icon: LucideIcon;
  title: string;
  shortTitle: string;
  description: string;
  seoDescription: string;
  benefits: string[];
  cta: string;
  accentColor: string;
  portfolio: PortfolioEntry[];
  stats: { label: string; value: string }[];
  features: FeatureEntry[]
}

/* ---------- platform data ---------- */

const platforms: PlatformData[] = [
  {
    key: 'shopify',
    icon: ShoppingBag,
    title: 'SHOPIFY',
    shortTitle: 'Shopify',
    description:
      'The best platform for scalable online stores. Shopify handles the technical complexity so you can focus on growing your business.',
    seoDescription:
      'Our Shopify development team builds high-converting stores tailored to your brand. From custom themes and advanced product setups to integrated payment gateways and shipping solutions — we deliver Shopify stores engineered for growth, speed, and scalability.',
    benefits: ['Fully Hosted Platform', 'App Ecosystem', 'Mobile Optimized', 'Secure Payments'],
    cta: 'Explore Shopify',
    accentColor: '#B6FF00',
    portfolio: [
      {
        name: 'Skinny Dip London',
        industry: 'Fashion',
        description: 'Playful fashion brand with bold design and engaging product displays',
        image: '/portfolio/skinnydiplondon.webp',
        accent: '#B6FF00',
        url: 'https://skinnydiplondon.com',
      },
      {
        name: 'Jones Road Beauty',
        industry: 'Beauty',
        description: 'Clean beauty brand with educational content and shade-matching tools',
        image: '/portfolio/jonesroadbeauty.webp',
        accent: '#90EE90',
        url: 'https://jonesroadbeauty.com',
      },
      {
        name: 'ColourPop',
        industry: 'Beauty',
        description: 'Trend-driven beauty brand with rapid product launches and high-traffic events',
        image: '/portfolio/colourpop.webp',
        accent: '#E040FB',
        url: 'https://colourpop.com',
      },
    ],
    stats: [
      { label: 'Stores Launched', value: '500+' },
      { label: 'Avg. Conversion Lift', value: '45%' },
      { label: 'Avg. Revenue Growth', value: '3.2x' },
      { label: 'Client Satisfaction', value: '98%' },
    ],
    features: [
      { icon: ShoppingCart, title: 'Custom Theme Development', description: 'Bespoke Shopify themes built from scratch to match your brand identity and conversion goals.' },
      { icon: Zap, title: 'Performance Optimization', description: 'Sub-2s load times with code splitting, image optimization, and CDN configuration.' },
      { icon: Layers, title: 'App Integration', description: 'Seamless integration with 100+ Shopify apps for email, analytics, and operations.' },
      { icon: Shield, title: 'Security & PCI Compliance', description: 'SSL, secure checkout flows, and full PCI-DSS compliance out of the box.' },
      { icon: Search, title: 'SEO Architecture', description: 'Technical SEO foundations including structured data, sitemaps, and speed optimization.' },
      { icon: Eye, title: 'Analytics & Reporting', description: 'Custom dashboards tracking revenue, conversion funnels, and customer lifetime value.' },
    ],
  },
  {
    key: 'wordpress',
    icon: Globe,
    title: 'WORDPRESS + WOOCOMMERCE',
    shortTitle: 'WordPress',
    description:
      'Maximum flexibility and control over your store. WordPress powers 40% of the web with unmatched customization options.',
    seoDescription:
      'We architect WordPress and WooCommerce solutions that combine the flexibility of open-source with enterprise-grade performance. Whether you need a content-rich storefront, complex product configurations, or a multisite setup — our WordPress team delivers scalable, SEO-optimized eCommerce experiences.',
    benefits: ['Full Customization', 'Open Source', 'SEO Friendly', 'WooCommerce Integration'],
    cta: 'Explore WordPress',
    accentColor: '#00D4FF',
    portfolio: [
      {
        name: 'EngiSoft Engineering',
        industry: 'Engineering',
        description: 'Engineering services company with project showcase and service booking',
        image: '/portfolio/engisoftengineering.webp',
        accent: '#00D4FF',
        url: 'https://engisoftengineering.com/',
      },
      {
        name: 'Pakistan Tour & Travel',
        industry: 'Travel & Tourism',
        description: 'Tour operator with 18.9K organic traffic and 4.9K ranking keywords',
        image: '/portfolio/pakistantourntravel.webp',
        accent: '#00D4FF',
        url: 'https://pakistantourntravel.com/',
      },
      {
        name: 'BIM Ally',
        industry: 'BIM Technology',
        description: 'BIM consulting firm in UAE with professional service portfolio',
        image: '/portfolio/bimally.webp',
        accent: '#00D4FF',
        url: 'https://bim-ally.com/',
      },
      {
        name: 'Best Deals',
        industry: 'eCommerce',
        description: 'UAE-based deals marketplace with multi-vendor product listings',
        image: '/portfolio/bestdeals.webp',
        accent: '#FF6B00',
        url: 'https://bestdeals.ae/',
      },
    ],
    stats: [
      { label: 'WordPress Sites Built', value: '200+' },
      { label: 'Avg. Load Time', value: '1.8s' },
      { label: 'SEO Score Improvement', value: '+62%' },
      { label: 'Uptime Guarantee', value: '99.9%' },
    ],
    features: [
      { icon: Palette, title: 'Custom Theme Design', description: 'Unique WordPress themes with page builders, custom post types, and flexible layouts.' },
      { icon: ShoppingCart, title: 'WooCommerce Setup', description: 'Full WooCommerce configuration with payment gateways, shipping, and tax automation.' },
      { icon: Search, title: 'Advanced SEO', description: 'Yoast/RankMath configuration, schema markup, content strategy, and technical SEO audits.' },
      { icon: Zap, title: 'Speed & Caching', description: 'Redis caching, Cloudflare CDN, lazy loading, and database optimization for blazing speed.' },
      { icon: Shield, title: 'Security Hardening', description: 'Firewalls, malware scanning, auto-backups, and two-factor authentication.' },
      { icon: Layers, title: 'Custom Plugins', description: 'Bespoke WordPress plugins for unique business workflows and integrations.' },
    ],
  },
  {
    key: 'marketing',
    icon: TrendingUp,
    title: 'SEO+DIGITAL MARKETING',
    shortTitle: 'Marketing',
    seoDescription:
      'Our digital marketing team combines data analytics with creative strategy to drive qualified traffic and maximize ROI. From Google Ads and Meta campaigns to TikTok advertising and email automation — we create full-funnel marketing systems that turn clicks into customers.',
    description:
      'Data-driven marketing strategies to attract, engage, and convert your ideal customers across every channel.',
    benefits: ['SEO Optimization', 'Social Media Ads', 'Content Strategy', 'Analytics & Reporting'],
    cta: 'Explore Marketing',
    accentColor: '#FF6B00',
    portfolio: [],
    stats: [
      { label: 'Ad Spend Managed', value: '$2M+' },
      { label: 'Avg. ROAS', value: '4.8x' },
      { label: 'Leads Generated', value: '50K+' },
      { label: 'Client Retention', value: '94%' },
    ],
    features: [
      { icon: Search, title: 'SEO & Content', description: 'Technical SEO, keyword strategy, content calendars, and link-building for organic growth.' },
      { icon: Eye, title: 'Analytics & Tracking', description: 'GA4, Pixel tracking, heatmaps, and conversion attribution for data-driven decisions.' },
      { icon: BarChart3, title: 'Paid Advertising', description: 'Strategic campaigns on Google Ads, Meta, TikTok, and LinkedIn with creative A/B testing.' },
      { icon: Layers, title: 'Email Marketing', description: 'Automated flows, segmentation, and personalized campaigns for retention and upselling.' },
      { icon: Zap, title: 'Conversion Optimization', description: 'Landing pages, A/B testing, and CRO strategies to maximize every dollar of ad spend.' },
      { icon: ShoppingCart, title: 'Social Media', description: 'Content creation, community management, and influencer partnerships across platforms.' },
    ],
  },
];

const hardcodedCaseStudies: CaseStudyEntry[] = [
  { name: 'Engisoft Engineering', tool: 'GSC', period: '6 Months', image: '/seo-results/engisoft-gsc-6months.webp', url: 'https://engisofengineering.com' },
  { name: 'Engisoft Engineering', tool: 'GSC', period: '28 Days', image: '/seo-results/engisoft-gsc-3months.webp', url: 'https://engisofengineering.com' },
  { name: 'Engisoft Engineering', tool: 'Semrush', period: '2 Years', image: '/seo-results/engisoft-semrush.webp', url: 'https://engisoftengineering.com' },
  { name: 'BIM Ally', tool: 'GSC', period: '28 Days', image: '/seo-results/bimally-gsc.webp', url: 'https://bim-ally.com' },
  { name: 'Pakistan Tour', tool: 'Semrush', period: '2 Years', image: '/seo-results/pakistantour-semrush.webp', url: 'https://pakistantourntravel.com' },
];

/* ---------- InView helper ---------- */

function useInViewOnce(margin = '-60px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);
  return { ref, isVisible };
}

/* ---------- sub-components ---------- */

function PortfolioCard({ item }: { item: PortfolioEntry }) {
  const content = (
    <div className='group relative overflow-hidden rounded-xl border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 bg-[rgba(10,10,10,0.6)] h-full flex flex-col'>
      <div className='flex-1 overflow-hidden bg-[#111] aspect-[16/10]'>
        <img
          src={item.image}
          alt={`${item.name} - ${item.industry} store by Appalachian Growth Solutions`}
          loading='lazy'
          className='w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-500'
        />
      </div>
      <div className='p-4 flex flex-col flex-1'>
        <h5 className='text-white font-semibold text-sm mb-1'>{item.name}</h5>
        {item.description && <p className='text-[#888] text-xs leading-relaxed line-clamp-2 flex-1'>{item.description}</p>}
        {item.url && (
          <span className='inline-flex items-center gap-1 text-xs font-medium mt-2 group-hover:gap-1.5 transition-all duration-200' style={{ color: item.accent }}>
            Visit Website
            <ArrowUpRight className='w-3 h-3' />
          </span>
        )}
      </div>
    </div>
  );

  if (item.url) {
    return (
      <a href={item.url} target='_blank' rel='noopener noreferrer' className='block h-full'>
        {content}
      </a>
    );
  }

  return content;
}

function ImageLightbox({ isOpen, onClose, imageSrc, alt }: { isOpen: boolean; onClose: () => void; imageSrc: string; alt: string }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{ opacity: 1, transition: 'opacity 0.25s ease' }}
      className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10'
      onClick={onClose}
    >
      <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' />
      <button
        onClick={onClose}
        className='absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'
        aria-label='Close lightbox'
      >
        <X className='w-5 h-5 text-white' />
      </button>
      <div
        style={{ opacity: 1, transform: 'scale(1)', transition: 'opacity 0.3s cubic-bezier(0.25, 0.4, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.4, 0.25, 1)' }}
        className='relative z-10 max-w-full max-h-[85vh] w-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageSrc} alt={alt} loading='lazy' className='rounded-xl border border-white/10 shadow-2xl max-h-[85vh] w-auto object-contain' />
      </div>
    </div>
  );
}

function CaseStudyCard({ item, accent, onView }: { item: CaseStudyEntry; accent: string; onView: () => void }) {
  const [imgError, setImgError] = useState(false);
  const isGSC = item.tool === 'GSC';
  return (
    <div className='rounded-xl border border-white/[0.06] hover:border-white/[0.15] bg-[rgba(10,10,10,0.6)] overflow-hidden flex flex-col h-64 transition-all duration-300 group/study'>
      <div className='relative flex-[1.5] overflow-hidden bg-[#111] min-h-0'>
        {!imgError ? (
          <img
            src={item.image}
            alt={`${item.name} ${item.tool} results`}
            loading='lazy'
            className='absolute inset-0 w-full h-full object-contain object-top group-hover/study:scale-105 transition-transform duration-500'
            onError={() => setImgError(true)}
          />
        ) : (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0D0D0D]'>
            <BarChart3 className='w-8 h-8 text-white/20' />
            <span className='text-white/30 text-[10px]'>Image unavailable</span>
          </div>
        )}
        <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${isGSC ? 'bg-[rgba(66,133,244,0.85)] text-white' : 'bg-[rgba(255,106,0,0.85)] text-white'}`}>
          {item.tool}
        </span>
        {item.period && (
          <span className='absolute top-2 right-2 text-[9px] font-medium px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[#ccc]'>
            {item.period}
          </span>
        )}
      </div>
      <div className='p-2.5 flex flex-col justify-between shrink-0'>
        <div className='min-h-0'>
          <p className='text-white text-[11px] font-semibold truncate'>{item.name}</p>
          {item.url && (
            <a
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[#888] text-[9px] hover:text-[#B6FF00] transition-colors truncate block'
              onClick={(e) => e.stopPropagation()}
            >
              {item.url.replace('https://', '').replace('http://', '')}
            </a>
          )}
        </div>
        <button
          onClick={onView}
          className='mt-1.5 w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold rounded-md py-1.5 transition-all duration-300'
          style={{ color: accent, backgroundColor: `${accent}12`, border: `1px solid ${accent}30` }}
        >
          <ZoomIn className='w-3 h-3' />
          View
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ feature, accent }: { feature: FeatureEntry; accent: string }) {
  const FIcon = feature.icon;
  return (
    <div className='flex gap-3.5 p-3.5 rounded-lg bg-[rgba(10,10,10,0.5)] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group/item'>
      <div className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300' style={{ backgroundColor: `${accent}12` }}>
        <FIcon className='w-4 h-4' style={{ color: accent }} />
      </div>
      <div>
        <h5 className='text-white text-sm font-medium mb-0.5'>{feature.title}</h5>
        <p className='text-[#777] text-xs leading-relaxed'>{feature.description}</p>
      </div>
    </div>
  );
}

function PlatformPanel({ platform, caseStudies, onViewCaseStudy }: { platform: PlatformData; caseStudies: CaseStudyEntry[]; onViewCaseStudy: (cs: CaseStudyEntry) => void }) {
  return (
    <div
      key={`panel-${platform.key}`}
      style={{ opacity: 1, maxHeight: '2000px', overflow: 'hidden', transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className='pt-6 pb-2 space-y-10'>
        {/* SEO Description */}
        <div>
          <h4 className='text-white font-semibold text-sm md:text-base mb-2'>
            Why Choose {platform.shortTitle}?
          </h4>
          <p className='text-[#999] text-sm leading-relaxed max-w-4xl'>
            {platform.seoDescription}
          </p>
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>
          {platform.stats.map((stat) => (
            <div key={stat.label} className='text-center p-3 sm:p-4 rounded-xl bg-[rgba(10,10,10,0.5)] border border-white/[0.04]'>
              <p className='text-xl md:text-2xl font-bold mb-1' style={{ color: platform.accentColor }}>{stat.value}</p>
              <p className='text-[#777] text-xs'>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Portfolio Section (Shopify & WordPress) */}
        {platform.portfolio.length > 0 && (
          <div>
            <h4 className='text-white font-semibold text-sm md:text-base mb-4'>
              Our {platform.shortTitle} Portfolio
            </h4>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
              {platform.portfolio.map((item) => (
                <PortfolioCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Case Studies — ONLY for Marketing section */}
        {platform.key === 'marketing' && caseStudies.length > 0 && (
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <h4 className='text-white font-semibold text-sm md:text-base'>
                Case Studies
              </h4>
              <span className='text-[10px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full bg-[rgba(182,255,0,0.08)] text-[#B6FF00] border border-[rgba(182,255,0,0.15)]'>
                Organic SEO Results
              </span>
            </div>
            <p className='text-[#666] text-xs mb-4'>
              Real client results from 100% organic SEO — no paid ads. Verified via Google Search Console & Semrush. Click &quot;View&quot; to see full reports.
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'>
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.image} item={cs} accent={platform.accentColor} onView={() => onViewCaseStudy(cs)} />
              ))}
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div>
          <h4 className='text-white font-semibold text-sm md:text-base mb-4'>
            What We Offer
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {platform.features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} accent={platform.accentColor} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='flex flex-col sm:flex-row items-center gap-3 pt-2'>
          <a
            href='#contact'
            className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-full px-4 py-2 sm:px-6 sm:py-2.5 min-h-[44px] transition-all duration-300'
            style={{
              color: platform.accentColor,
              backgroundColor: `${platform.accentColor}12`,
              border: `1px solid ${platform.accentColor}30`,
            }}
          >
            Start Your {platform.shortTitle} Project
            <ArrowRight className='w-4 h-4' />
          </a>
          <span className='text-[#666] text-xs'>Free consultation · No commitment</span>
        </div>

        {/* View All Websites */}
        <div className='flex justify-center pt-4'>
          <a
            href='#portfolio'
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className='group inline-flex items-center gap-2 text-sm font-semibold text-white rounded-full px-6 py-2.5 border border-white/10 hover:border-[#B6FF00]/40 hover:text-[#B6FF00] transition-all duration-300 bg-[rgba(182,255,0,0.06)] hover:bg-[rgba(182,255,0,0.1)]'
          >
            View All Websites
            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */

export default function PlatformSection() {
  const { data: publicData } = usePublicContent();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt: string }>({ open: false, src: '', alt: '' });
  const { ref: headerRef, isVisible: headerVisible } = useInViewOnce('-80px');
  const { ref: gridRef, isVisible: gridVisible } = useInViewOnce('-60px');

  // SEO case studies — ONLY used by Marketing section
  const seoCaseStudies = useMemo((): CaseStudyEntry[] => {
    const db = publicData?.seoResultImages || [];
    if (db.length > 0) {
      return db.map((img: SeoResultImage) => ({
        name: img.title,
        tool: 'SEO',
        period: '',
        image: img.url,
        url: undefined,
      }));
    }
    return hardcodedCaseStudies;
  }, [publicData?.seoResultImages]);

  // Platform-specific portfolio from DB — separate for each platform
  const shopifyPortfolio = useMemo((): PortfolioEntry[] => {
    const dbImages = (publicData?.platformImages || []).filter(
      (img: PlatformImage) => img.platform === 'shopify',
    );
    if (dbImages.length > 0) {
      return dbImages.map((img: PlatformImage) => ({
        name: img.title,
        industry: '',
        description: '',
        image: img.url,
        accent: '#B6FF00',
        url: img.clientUrl || undefined,
      }));
    }
    return platforms.find((p) => p.key === 'shopify')?.portfolio || [];
  }, [publicData?.platformImages]);

  const wordpressPortfolio = useMemo((): PortfolioEntry[] => {
    const dbImages = (publicData?.platformImages || []).filter(
      (img: PlatformImage) => img.platform === 'wordpress',
    );
    if (dbImages.length > 0) {
      return dbImages.map((img: PlatformImage) => ({
        name: img.title,
        industry: '',
        description: '',
        image: img.url,
        accent: '#00D4FF',
        url: img.clientUrl || undefined,
      }));
    }
    return platforms.find((p) => p.key === 'wordpress')?.portfolio || [];
  }, [publicData?.platformImages]);

  function getPortfolio(key: string): PortfolioEntry[] {
    if (key === 'shopify') return shopifyPortfolio;
    if (key === 'wordpress') return wordpressPortfolio;
    return [];
  }

  const onViewCaseStudy = useCallback((cs: CaseStudyEntry) => {
    setLightbox({ open: true, src: cs.image, alt: `${cs.name} ${cs.tool} results` });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  const togglePanel = useCallback((key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  }, []);

  return (
    <section id='services' className='bg-[#050505] section-divider'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
        {/* Section Header */}
        <SectionReveal>
          <div
            ref={headerRef}
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
            className='text-center mb-10 md:mb-14'
          >
            <SectionLabel>PLATFORMS</SectionLabel>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-5'>
              CHOOSE THE RIGHT PLATFORM{' '}
              <br className='hidden sm:block' />
              FOR YOUR BUSINESS
            </h2>
            <p className='text-[#999] max-w-2xl mx-auto text-base md:text-lg leading-relaxed'>
              We specialize in the leading eCommerce platforms and digital marketing
              strategies to help your business thrive online.
            </p>
          </div>
        </SectionReveal>

        {/* Platform Cards + Expandable Panels */}
        <SectionReveal delay={0.15}>
          <div ref={gridRef} className='space-y-6'>
            {platforms.map((platform, index) => {
              const PIcon = platform.icon;
              const isExpanded = expandedKey === platform.key;
              return (
                <div
                  key={platform.key}
                  style={{
                    opacity: gridVisible ? 1 : 0,
                    transform: gridVisible ? 'none' : 'translateY(40px)',
                    transition: `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`,
                  }}
                >
                  <div
                    className='group relative overflow-hidden bg-[rgba(10,10,10,0.7)] backdrop-blur-sm rounded-2xl border transition-all duration-400'
                    style={{
                      borderColor: isExpanded ? `${platform.accentColor}50` : 'rgba(182,255,0,0.08)',
                      boxShadow: isExpanded
                        ? `0 20px 60px ${platform.accentColor}10, 0 0 0 1px ${platform.accentColor}25`
                        : '0 0 0 0 rgba(182,255,0,0)',
                    }}
                  >
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl' style={{ background: `radial-gradient(ellipse at 50% 0%, ${platform.accentColor}08, transparent 70%)` }} />

                    <div className='p-4 sm:p-5 md:p-8'>
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-4 mb-4'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110' style={{ backgroundColor: `${platform.accentColor}14` }}>
                              <PIcon className='w-6 h-6' style={{ color: platform.accentColor }} />
                            </div>
                            <h3 className='text-sm sm:text-base md:text-xl font-bold text-white leading-tight'>{platform.title}</h3>
                          </div>
                          <p className='text-[#aaa] text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5'>{platform.description}</p>
                          <ul className='flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-1.5 md:gap-x-6 md:gap-y-2'>
                            {platform.benefits.map((benefit) => (
                              <li key={benefit} className='flex items-center gap-2'>
                                <Check className='w-4 h-4 shrink-0' style={{ color: platform.accentColor }} />
                                <span className='text-xs sm:text-sm text-[#cccccc]'>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => togglePanel(platform.key)}
                          className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-full px-5 py-2.5 min-h-[44px] transition-all duration-300 self-start md:self-center shrink-0'
                          style={{ color: platform.accentColor, backgroundColor: `${platform.accentColor}12`, border: `1px solid ${platform.accentColor}30` }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${platform.accentColor}22`; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${platform.accentColor}12`; }}
                        >
                          {isExpanded ? 'Close' : platform.cta}
                          <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
                            <ArrowRight className='w-4 h-4' />
                          </span>
                        </button>
                      </div>

                      {/* Expandable Panel */}
                      {isExpanded && (
                        <PlatformPanel
                          platform={{ ...platform, portfolio: getPortfolio(platform.key) }}
                          caseStudies={platform.key === 'marketing' ? seoCaseStudies : []}
                          onViewCaseStudy={onViewCaseStudy}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </div>
      <ImageLightbox isOpen={lightbox.open} onClose={closeLightbox} imageSrc={lightbox.src} alt={lightbox.alt} />
    </section>
  );
}