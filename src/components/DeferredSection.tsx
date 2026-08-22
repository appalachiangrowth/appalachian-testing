'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';

interface DeferredSectionProps {
  load: () => Promise<{ default: ComponentType }>;
  id?: string;
  rootMargin?: string;
  minHeight?: string;
}

export default function DeferredSection({
  load,
  id,
  rootMargin = '700px 0px',
  minHeight = '120px',
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Section, setSection] = useState<ComponentType | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || Section) return;

    let cancelled = false;
    const loadSection = () => {
      load()
        .then((module) => {
          if (!cancelled) setSection(() => module.default);
        })
        .catch((error) => {
          console.error('[DeferredSection] Failed to load section:', error);
        });
    };

    if (!('IntersectionObserver' in window)) {
      loadSection();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadSection();
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [Section, load, rootMargin]);

  return (
    <div ref={ref} id={Section ? undefined : id} style={{ minHeight: Section ? undefined : minHeight }}>
      {Section ? <Section /> : null}
    </div>
  );
}
