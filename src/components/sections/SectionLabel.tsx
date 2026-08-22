'use client';

import { useRef, useState, useEffect } from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: '-60px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(10px)',
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      className={`inline-block text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#B6FF00] mb-4 ${className}`}
    >
      {children}
    </span>
  );
}
