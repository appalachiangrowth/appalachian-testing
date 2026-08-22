"use client";

import dynamic from "next/dynamic";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import DeferredSection from "@/components/DeferredSection";

/* TrustBar sits just below the fold and remains available immediately. */
const TrustBar = dynamic(() => import("@/components/sections/TrustBar"), {
  ssr: false,
});

/* Floating and consent controls stay available without waiting for scroll. */
const CookieConsent = dynamic(
  () => import("@/components/sections/CookieConsent"),
  { ssr: false },
);
const BackToTop = dynamic(() => import("@/components/sections/BackToTop"), {
  ssr: false,
});
const ChatWidget = dynamic(() => import("@/components/sections/ChatWidget"), {
  ssr: false,
});
const DogMascot = dynamic(() => import("@/components/sections/DogMascot"), {
  ssr: false,
});
const MobileStars = dynamic(() => import("@/components/sections/MobileStars"), {
  ssr: false,
});

/* Heavy visual effects — desktop only, loaded independently. */
const StarField = dynamic(() => import("@/components/sections/StarField"), {
  ssr: false,
});
const CursorGlow = dynamic(() => import("@/components/sections/CursorGlow"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Static stars — mobile only, lightweight, and rendered behind content. */}
      <MobileStars />

      {/* Above the fold — keep the first interaction path fast. */}
      <Header />
      <Hero />
      <TrustBar />

      {/* Below the fold — load each section just before it is needed. */}
      <DeferredSection
        load={() => import("@/components/sections/PlatformSection")}
        rootMargin="900px 0px"
        minHeight="280px"
      />
      <DeferredSection
        id="services-grid"
        load={() => import("@/components/sections/ServicesSection")}
        rootMargin="700px 0px"
        minHeight="260px"
      />
      <DeferredSection
        id="process"
        load={() => import("@/components/sections/ProcessSection")}
        rootMargin="600px 0px"
        minHeight="240px"
      />
      <DeferredSection
        id="portfolio"
        load={() => import("@/components/sections/PortfolioSection")}
        rootMargin="600px 0px"
        minHeight="320px"
      />
      <DeferredSection
        load={() => import("@/components/sections/WhyChooseUs")}
        rootMargin="600px 0px"
        minHeight="260px"
      />
      <DeferredSection
        load={() => import("@/components/sections/ResultsShowcase")}
        rootMargin="600px 0px"
        minHeight="260px"
      />
      <DeferredSection
        load={() => import("@/components/sections/DigitalMarketing")}
        rootMargin="600px 0px"
        minHeight="300px"
      />
      <DeferredSection
        load={() => import("@/components/sections/Testimonials")}
        rootMargin="600px 0px"
        minHeight="240px"
      />
      <DeferredSection
        id="about"
        load={() => import("@/components/sections/TeamSection")}
        rootMargin="600px 0px"
        minHeight="240px"
      />
      <DeferredSection
        load={() => import("@/components/sections/BlogSection")}
        rootMargin="600px 0px"
        minHeight="260px"
      />
      <DeferredSection
        load={() => import("@/components/sections/FAQ")}
        rootMargin="600px 0px"
        minHeight="240px"
      />
      <DeferredSection
        load={() => import("@/components/sections/CTABanner")}
        rootMargin="600px 0px"
        minHeight="220px"
      />
      <DeferredSection
        id="contact"
        load={() => import("@/components/sections/ContactSection")}
        rootMargin="600px 0px"
        minHeight="420px"
      />

      <CookieConsent />
      <BackToTop />
      <ChatWidget />
      <DogMascot />

      {/* Animated desktop-only effects. */}
      <div className="hidden md:block">
        <StarField />
      </div>
      <CursorGlow />
    </main>
  );
}
