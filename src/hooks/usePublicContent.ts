import { useState, useEffect, useRef } from 'react';

// ─── Types matching Prisma models returned by /api/public/content ───

export interface Transformation {
  id?: string;
  client: string;
  metric: string;
  before: string;
  after: string;
  improvement: string;
  description: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  type?: string;
  text: string;
  rating: number;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface MarketingService {
  id?: string;
  title: string;
  description: string;
  stat: string;
  icon: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface MarketingMetric {
  id?: string;
  metric: string;
  before: string;
  after: string;
  increase: string;
  sortOrder?: number;
}

export interface PortfolioItem {
  id: string;
  name: string;
  industry: string;
  platform: string;
  description: string;
  accentColor: string;
  secondaryColor: string;
  image: string;
  url: string;
  challenge: string;
  solution: string;
  result: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface HeroStat {
  id?: string;
  value: string;
  label: string;
  target: number;
  suffix: string;
  isStatic: boolean;
  sortOrder?: number;
}

export interface HeroScreenshot {
  id?: string;
  category: string;
  url: string;
  alt: string;
  sortOrder?: number;
}

export interface SeoResultImage {
  id?: string;
  title: string;
  url: string;
  sortOrder?: number;
}

export interface PlatformImage {
  id?: string;
  title: string;
  url: string;
  clientUrl: string;
  platform: string;
  sortOrder?: number;
}

export interface PublicContent {
  portfolioItems: PortfolioItem[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  faqs: FAQ[];
  marketingServices: MarketingService[];
  transformations: Transformation[];
  marketingMetrics: MarketingMetric[];
  heroStats: HeroStat[];
  heroScreenshots: HeroScreenshot[];
  seoResultImages: SeoResultImage[];
  platformImages: PlatformImage[];
}

// ─── Module-level cache with TTL: shared across all hook consumers ───

const CACHE_TTL_MS = 10_000; // 10 seconds

let cachedData: PublicContent | null = null;
let cachedAt = 0;
let cachedPromise: Promise<PublicContent> | null = null;

function fetchContent(): Promise<PublicContent> {
  if (cachedPromise) return cachedPromise;

  cachedPromise = fetch('/api/public/content')
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      return res.json();
    })
    .then((result: PublicContent) => {
      cachedData = result;
      cachedAt = Date.now();
      cachedPromise = null;
      return result;
    })
    .catch((err) => {
      cachedPromise = null;
      throw err;
    });

  return cachedPromise;
}

export function usePublicContent() {
  const [data, setData] = useState<PublicContent | null>(cachedData);
  const [isLoading, setIsLoading] = useState(() => !cachedData);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Initial fetch
    const refresh = () => {
      if (!mountedRef.current) return;
      fetchContent()
        .then((result) => {
          if (!mountedRef.current) return;
          setData(result);
          setIsLoading(false);
          setError(null);
        })
        .catch((err) => {
          if (!mountedRef.current) return;
          setError(err);
          setIsLoading(false);
        });
    };

    // Fresh cache — still set up interval for periodic refresh
    if (cachedData && (Date.now() - cachedAt) < CACHE_TTL_MS) {
      // Cache is fresh, but still poll every 30s for changes
      const interval = setInterval(refresh, 30_000);
      return () => { mountedRef.current = false; clearInterval(interval); };
    }

    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => { mountedRef.current = false; clearInterval(interval); };
  }, []);

  return { data, isLoading, error };
}
