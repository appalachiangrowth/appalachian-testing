"use client";

import dynamic from "next/dynamic";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";

/* TrustBar is just below fold — dynamic to reduce initial JS */
const TrustBar = dynamic(() => import("@/components/sections/TrustBar"), {
  ssr: false,
});

/* All other sections dynamically imported */
const PlatformSection = dynamic(
  () => import("@/components/sections/PlatformSection"),
  { ssr: false }
);
const ServicesSection = dynamic(
  () => import("@/components/sections/ServicesSection"),
  { ssr: false }
);
const ProcessSection = dynamic(
  () => import("@/components/sections/ProcessSection"),
  { ssr: false }
);
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection"),
  { ssr: false }
);
const WhyChooseUs = dynamic(
  () => import("@/components/sections/WhyChooseUs"),
  { ssr: false }
);
const ResultsShowcase = dynamic(
  () => import("@/components/sections/ResultsShowcase"),
  { ssr: false }
);
const DigitalMarketing = dynamic(
  () => import("@/components/sections/DigitalMarketing"),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import("@/components/sections/Testimonials"),
  { ssr: false }
);
const TeamSection = dynamic(
  () => import("@/components/sections/TeamSection"),
  { ssr: false }
);
const FAQ = dynamic(
  () => import("@/components/sections/FAQ"),
  { ssr: false }
);
const CTABanner = dynamic(
  () => import("@/components/sections/CTABanner"),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
  { ssr: false }
);
const CookieConsent = dynamic(
  () => import("@/components/sections/CookieConsent"),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
});
const BackToTop = dynamic(() => import("@/components/sections/BackToTop"), {
  ssr: false,
});
const ChatWidget = dynamic(() => import("@/components/sections/ChatWidget"), {
  ssr: false,
});
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"), {
  ssr: false,
});
const DogMascot = dynamic(() => import("@/components/sections/DogMascot"), {
  ssr: false,
});
const MobileStars = dynamic(() => import("@/components/sections/MobileStars"), {
  ssr: false,
});

/* Heavy visual effects — only on desktop, loaded last */
const StarField = dynamic(() => import("@/components/sections/StarField"), {
  ssr: false,
});
const CursorGlow = dynamic(() => import("@/components/sections/CursorGlow"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Static stars — mobile only, lightweight — placed first so it covers full page */}
      <MobileStars />
      {/* Above the fold — minimal JS */}
      <Header />
      <Hero />
      <TrustBar />
      {/* Below the fold — all lazy loaded */}
      <PlatformSection />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <WhyChooseUs />
      <ResultsShowcase />
      <DigitalMarketing />
      <Testimonials />
      <TeamSection />
      <BlogSection />
      <FAQ />
      <CTABanner />
      <ContactSection />
      <CookieConsent />
      <Footer />
      <BackToTop />
      <ChatWidget />
      <DogMascot />
      {/* Animated starfield — desktop only */}
      <div className="hidden md:block">
        <StarField />
      </div>
      <CursorGlow />
    </main>
  );
}
