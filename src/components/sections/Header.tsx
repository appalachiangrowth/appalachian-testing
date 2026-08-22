'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Home', href: 'home', type: 'section' as const },
  { label: 'Services', href: 'services-grid', type: 'section' as const },
  { label: 'Portfolio', href: 'portfolio', type: 'section' as const },
  { label: 'Process', href: 'process', type: 'section' as const },
  { label: 'Blog', href: '/blog', type: 'page' as const },
  { label: 'About', href: 'about', type: 'section' as const },
  { label: 'Contact', href: 'contact', type: 'section' as const },
] as const;

function getMobileClass(isActive: boolean, type: 'section' | 'page'): string {
  if (type === 'page') return 'text-[#999] hover:bg-[#1A1A1A] hover:text-white';
  if (isActive) return 'bg-[#B6FF00]/10 text-[#B6FF00]';
  return 'text-[#999] hover:bg-[#1A1A1A] hover:text-white';
}

function getDesktopClass(isActive: boolean, type: 'section' | 'page'): string {
  if (type === 'page') return 'relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 text-[#999] hover:text-[#B6FF00]';
  if (isActive) return 'relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 text-[#B6FF00]';
  return 'relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 text-[#999] hover:text-[#B6FF00]';
}

export default function Header() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleNavClick = useCallback((href: string, type: 'section' | 'page') => {
    if (type === 'page') {
      window.location.href = href;
      return;
    }
    const el = document.getElementById(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.filter((l) => l.type === 'section').map((l) => l.href);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) setScrollProgress((window.scrollY / scrollHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={[
        'header-slide-in sticky top-0 z-50 transition-all duration-300 border-b border-[rgba(182,255,0,0.08)]',
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(182,255,0,0.08)]'
          : 'bg-[#050505]/90 backdrop-blur-xl',
      ].join(' ')}
    >
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.3)] to-transparent" />
      )}
      <div
        className="absolute bottom-0 left-0 h-[2px] rounded-full bg-[#B6FF00] z-[1]"
        style={{ width: `${scrollProgress}%`, transition: 'width 100ms linear' }}
      />

      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('home', 'section'); }}
          className="flex items-center"
          aria-label="Appalachian Growth Solutions Home"
        >
          <Image
            src="/appalachian-logo.png"
            alt="Appalachian Growth Solutions"
            width={722}
            height={176}
            priority
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href, link.type)}
                  className={getDesktopClass(isActive, link.type)}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#B6FF00] transition-all duration-300" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('contact', 'section')}
            className="hidden rounded-full border border-[rgba(182,255,0,0.4)] px-5 py-2 text-sm font-semibold text-[#B6FF00] transition-all duration-200 hover:bg-[rgba(182,255,0,0.1)] hover:shadow-[0_0_15px_rgba(182,255,0,0.2)] active:scale-[0.97] lg:inline-flex"
          >
            Get Started
          </button>

          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white transition-colors hover:bg-[#1A1A1A]"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-[320px] border-l border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] sm:max-w-sm"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Image
                      src="/appalachian-logo.png"
                      alt="Appalachian Growth Solutions"
                      width={722}
                      height={176}
                      className="h-10 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1 px-4">
                  {NAV_LINKS.map((link) => {
                    const isActive = activeSection === link.href;
                    return (
                      <SheetClose asChild key={link.href}>
                        <button
                          onClick={() => handleNavClick(link.href, link.type)}
                          className={getMobileClass(isActive, link.type)}
                        >
                          {link.label}
                          {isActive && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-[#B6FF00]" />
                          )}
                        </button>
                      </SheetClose>
                    );
                  })}
                </div>

                <div className="mt-8 px-4">
                  <SheetClose asChild>
                    <button
                      onClick={() => handleNavClick('contact', 'section')}
                      className="w-full min-h-[52px] rounded-full bg-[#B6FF00] py-3 text-sm font-semibold text-[#050505] transition-shadow hover:shadow-[0_0_20px_rgba(182,255,0,0.35)] active:scale-[0.97]"
                    >
                      Get Started
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
