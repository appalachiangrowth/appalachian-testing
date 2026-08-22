'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

const CIRCUMFERENCE = 2 * Math.PI * 18; // ~113.1

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setVisible(scrollY > 500);
    setProgress(docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className='fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[45]'
    >
      <div className='group relative'>
        {/* Tooltip */}
        <div className='absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-[#111] border border-[rgba(182,255,0,0.15)] rounded-md text-xs text-[#B6FF00] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
          Back to top
          <div className='absolute top-full right-4 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[#111]' />
        </div>

        <button
          onClick={scrollToTop}
          className='relative w-12 h-12 rounded-full bg-[#0A0A0A] border border-[rgba(182,255,0,0.15)] flex items-center justify-center hover:border-[rgba(182,255,0,0.4)] hover:neon-glow transition-all cursor-pointer hover:scale-110 active:scale-90'
          aria-label='Back to top'
        >
          {/* Scroll progress ring */}
          <svg
            className='absolute inset-0 w-full h-full -rotate-90'
            viewBox='0 0 48 48'
            aria-hidden='true'
          >
            <circle cx='24' cy='24' r='18' fill='none' stroke='transparent' strokeWidth='2' />
            <circle
              cx='24' cy='24' r='18' fill='none' stroke='#B6FF00' strokeWidth='2'
              strokeLinecap='round'
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className='transition-[stroke-dashoffset] duration-150 ease-out'
            />
          </svg>

          {progress > 0.1 ? (
            <span className='absolute text-[10px] font-bold text-[#B6FF00] z-10'>
              {Math.round(progress * 100)}
            </span>
          ) : (
            <ArrowUp className='w-4 h-4 text-[#B6FF00] relative z-10' />
          )}
          <span className='sr-only'>Back to top</span>
        </button>
      </div>
    </div>
  );
}
