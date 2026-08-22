'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'
import { ExternalLink, X, Globe, ChevronDown } from 'lucide-react'
import SectionLabel from '@/components/sections/SectionLabel'
import { usePublicContent, type PortfolioItem } from '@/hooks/usePublicContent'

const defaultCategories = ['All', 'Shopify', 'WordPress', 'Fashion', 'Beauty', 'Electronics', 'Home & Living']

const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    name: 'Skinny Dip London',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Playful fashion brand with bold design and engaging product displays',
    accentColor: '#B6FF00',
    secondaryColor: '#1a1a2e',
    image: '/portfolio/skinnydiplondon.webp',
    url: 'https://skinnydiplondon.com',
    challenge: 'Skinny Dip London needed a vibrant, on-brand store that matched their playful identity while maintaining fast load times and a seamless mobile shopping experience.',
    solution: 'We built a custom Shopify theme with bold typography, animated product hover states, and a mobile-first layout. We optimized all images and implemented lazy loading for their large catalog.',
    result: 'Mobile conversion rate increased by 52% and page load speed dropped to 1.4 seconds. The redesign contributed to a 35% increase in monthly revenue within the first quarter.',
  },
  {
    id: '3',
    name: 'Press London',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Contemporary menswear brand with editorial-style product pages',
    accentColor: '#c9a96e',
    secondaryColor: '#1a1a0e',
    image: '/portfolio/presslondon.webp',
    url: 'https://presslondon.com',
    challenge: 'Press London wanted to elevate their online presence with an editorial look that reflected their premium menswear positioning. The existing store lacked visual storytelling and had a 4.5s load time.',
    solution: 'We created a magazine-inspired Shopify theme with full-bleed imagery, lookbook integration, and editorial-style product pages. We optimized the asset pipeline for sub-2s loads.',
    result: 'Time on site increased by 85% and the editorial layout drove a 42% increase in pages per session. Organic traffic grew by 60% within 6 months of the redesign.',
  },
  {
    id: '4',
    name: 'HG Walter',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Luxury menswear with bespoke tailoring options and premium UX',
    accentColor: '#8B7355',
    secondaryColor: '#1e1a14',
    image: '/portfolio/hgwalter.webp',
    url: 'https://hgwalter.com',
    challenge: 'HG Walter required a store that conveyed true luxury craftsmanship while offering bespoke customization options — made-to-measure suits with complex configuration workflows.',
    solution: 'We built a sophisticated Shopify Plus store with a custom suit configurator, fabric selection tool, and appointment booking system. The design emphasized whitespace and premium typography.',
    result: 'The bespoke configurator increased custom orders by 180%. Average order value rose to $1,200+ and the store was featured in GQ and Esquire as a best-in-class eCommerce experience.',
  },
  {
    id: '5',
    name: 'Ernest Leoty',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Premium activewear brand with lifestyle content and subscription model',
    accentColor: '#FF4444',
    secondaryColor: '#2e1a1a',
    image: '/portfolio/ernestleoty.webp',
    url: 'https://ernestleoty.com',
    challenge: 'Ernest Leoty needed to merge activewear functionality with luxury fashion aesthetics. Their subscription box model required a flexible fulfillment system with swap and pause capabilities.',
    solution: 'We designed a visually stunning Shopify store with lifestyle photography integration, a flexible subscription management portal, and outfit recommendation algorithms.',
    result: 'Subscription enrollment grew by 220% and the visual redesign attracted coverage in Vogue and Well+Good. Customer lifetime value increased by 95% within the first year.',
  },
  {
    id: '6',
    name: 'Jones Road Beauty',
    industry: 'Beauty',
    platform: 'Shopify',
    description: 'Clean beauty brand with educational content and shade-matching tools',
    accentColor: '#90EE90',
    secondaryColor: '#1a2e1a',
    image: '/portfolio/jonesroadbeauty.webp',
    url: 'https://jonesroadbeauty.com',
    challenge: 'Jones Road Beauty needed to scale their DTC channel while maintaining the personal, educational shopping experience their founder built on social media. Product education was critical for conversion.',
    solution: 'We built a content-rich Shopify store with video tutorials on product pages, a shade-matching quiz, and a "How to Use" guide system. We integrated their social content feed directly into the shopping experience.',
    result: 'The educational content strategy drove a 65% increase in conversion rate. Video-enabled product pages saw 3x higher engagement, and the shade quiz achieved a 45% add-to-cart rate.',
  },
  {
    id: '7',
    name: 'ColourPop',
    industry: 'Beauty',
    platform: 'Shopify',
    description: 'Trend-driven beauty brand with rapid product launches and high-traffic events',
    accentColor: '#E040FB',
    secondaryColor: '#2a1a2e',
    image: '/portfolio/colourpop.webp',
    url: 'https://colourpop.com',
    challenge: 'ColourPop handles massive traffic spikes during product drops — often 50x normal volume. Their existing infrastructure struggled with checkout timeouts and inventory sync issues during launches.',
    solution: 'We optimized their Shopify Plus store for extreme traffic events with caching strategies, queue-based checkout during drops, and real-time inventory management across multiple warehouses.',
    result: 'The store now handles 50,000+ concurrent users without a single checkout timeout during product launches. Cart abandonment during drops dropped from 45% to 12%.',
  },
  {
    id: '8',
    name: 'Blackwolf Nation',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Outdoor and lifestyle brand with rugged design and community features',
    accentColor: '#FFB347',
    secondaryColor: '#2e2a1a',
    image: '/portfolio/blackwolfnation.webp',
    url: 'https://blackwolfnation.com',
    challenge: 'Blackwolf Nation needed a store that matched their adventurous brand identity while building a loyal community. Their previous site had basic functionality and no community engagement features.',
    solution: 'We designed a bold, adventure-themed Shopify store with user-generated content galleries, a community hub, and loyalty program integration. We added adventure-ready product filtering.',
    result: 'Community engagement increased by 300% and user-generated content now drives 25% of new customer acquisition. The loyalty program has a 68% active enrollment rate.',
  },
  {
    id: '9',
    name: 'Fenty Beauty',
    industry: 'Beauty',
    platform: 'Shopify',
    description: 'Inclusive beauty brand with virtual try-on and shade matching',
    accentColor: '#FF8A65',
    secondaryColor: '#2e1a14',
    image: '/portfolio/fentybeauty.webp',
    url: 'https://fentybeauty.com',
    challenge: 'Managing a massive shade range (50+ foundation shades) with accurate color representation online and providing virtual try-on experiences across all device types.',
    solution: 'We built an advanced Shopify store with AR-powered virtual try-on, accurate color calibration for each shade, and a smart shade-matching algorithm based on skin tone analysis.',
    result: 'Virtual try-on feature increased conversion rates by 38% and reduced shade-related returns by 55%. The shade matching tool drives 30% of all first-time purchases.',
  },
  {
    id: '10',
    name: 'Sol de Janeiro',
    industry: 'Beauty',
    platform: 'Shopify',
    description: 'Brazilian beauty brand with immersive product storytelling',
    accentColor: '#FFD54F',
    secondaryColor: '#2e2a1a',
    image: '/portfolio/soldejaneiro.webp',
    url: 'https://soldejaneiro.com',
    challenge: 'Sol de Janeiro needed to translate their sensorial brand experience — scents, textures, Brazilian culture — into a compelling online shopping journey that drives discovery.',
    solution: 'We created an immersive Shopify experience with scent-descriptor product pages, ingredient storytelling sections, and a quiz-based product recommendation engine.',
    result: 'Product discovery through the recommendation quiz drives 40% of new customer purchases. Average session duration increased by 95% and email list growth tripled.',
  },
  {
    id: '11',
    name: 'True Botanicals',
    industry: 'Beauty',
    platform: 'Shopify',
    description: 'Clean skincare brand with ingredient transparency and clinical results',
    accentColor: '#a8e6cf',
    secondaryColor: '#1a2a1e',
    image: '/portfolio/truebotanicals.webp',
    url: 'https://truebotanicals.com',
    challenge: 'True Botanicals needed to differentiate through clinical evidence and ingredient transparency in a crowded clean beauty market. Product pages needed to convey both luxury and science.',
    solution: 'We designed science-forward product pages with clinical study results, ingredient traceability maps, and a skin concern-based navigation system on Shopify.',
    result: 'The transparency-first approach increased trust scores by 45% and conversion rates by 32%. The brand was featured in Allure and The Cut as a leader in clean beauty eCommerce.',
  },
  {
    id: '12',
    name: 'Leea Jewelry',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Handcrafted jewelry with custom engraving and gift wrapping options',
    accentColor: '#CE93D8',
    secondaryColor: '#1e1a2e',
    image: '/portfolio/leeajewelry.webp',
    url: 'https://leeajewelry.com',
    challenge: 'Leea Jewelry needed a delicate, refined online presence that showcased their handcrafted pieces. They required custom engraving options and a premium gift-wrapping service at checkout.',
    solution: 'We built an elegant Shopify store with zoom-enabled product photography, a custom engraving preview tool, and a premium gift-wrapping checkout add-on with personalized messages.',
    result: 'The engraving feature increased average order value by 35%. Gift orders now represent 40% of all purchases, especially during holiday seasons with a 280% revenue spike.',
  },
  {
    id: '13',
    name: 'Mona Watch',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Luxury watch retailer with 360° product views and comparison tools',
    accentColor: '#90CAF9',
    secondaryColor: '#1a1a2e',
    image: '/portfolio/monawatch.webp',
    url: 'https://monawatch.com',
    challenge: 'Selling luxury watches online requires building extreme trust through detailed product presentation. The previous site had basic images and no way to compare models.',
    solution: 'We developed a premium Shopify store with 360° product rotation, macro photography, side-by-side comparison tools, and authentication documentation for each timepiece.',
    result: 'The 360° view feature reduced return rates by 30% and the comparison tool increased average order value by 45%. Trust signals drove a 55% increase in first-time purchases.',
  },
  {
    id: '14',
    name: 'Roni Helou',
    industry: 'Fashion',
    platform: 'Shopify',
    description: 'Sustainable fashion brand with transparency-focused design',
    accentColor: '#80CBC4',
    secondaryColor: '#1a2a2e',
    image: '/portfolio/ronihelou.webp',
    url: 'https://ronihelou.com',
    challenge: 'Roni Helou needed to communicate their sustainable and ethical manufacturing practices while creating a luxury shopping experience that justified premium pricing.',
    solution: 'We designed a sustainability-focused Shopify store with supply chain transparency maps, impact metrics displayed per product, and a minimalist design that let the craftsmanship speak.',
    result: 'The transparency features increased brand trust scores by 60% and the sustainable messaging attracted coverage in Fashion Revolution and Elle. Conversion rates improved by 28%.',
  },
  {
    id: '15',
    name: 'MacBook Repair Lab',
    industry: 'Electronics',
    platform: 'Shopify',
    description: 'Tech repair service with diagnostic booking and tracking system',
    accentColor: '#00D4FF',
    secondaryColor: '#0a1a2e',
    image: '/portfolio/macbookrepairlab.webp',
    url: 'https://macbookrepairlab.com',
    challenge: 'MacBook Repair Lab needed to convert visitors into service bookings with clear pricing, repair timelines, and a tracking system that reduced customer anxiety about device repair.',
    solution: 'We built a service-oriented Shopify store with an online diagnostic booking form, real-time repair status tracking, transparent pricing tables, and customer review integration.',
    result: 'Online bookings increased by 200% and the tracking system reduced support inquiries by 45%. The transparent pricing model drove a 70% increase in customer trust scores.',
  },
  {
    id: '16',
    name: 'Turtle Beach',
    industry: 'Electronics',
    platform: 'Shopify',
    description: 'Gaming audio brand with product configurator and review system',
    accentColor: '#8B5CF6',
    secondaryColor: '#1e1a2e',
    image: '/portfolio/turtlebeach.webp',
    url: 'https://turtlebeach.com',
    challenge: 'Turtle Beach needed to showcase their gaming headset range with compatibility guides, comparison tools, and user reviews that helped gamers find the right product.',
    solution: 'We built a gaming-focused Shopify store with a device compatibility checker, side-by-side product comparison, user review aggregation with verified purchase badges, and gaming-themed design elements.',
    result: 'The compatibility checker reduced wrong-purchase returns by 35% and comparison tool usage drives 25% of all conversions. User reviews increased by 150% after the verified purchase system launched.',
  },
  {
    id: '17',
    name: 'Burrow',
    industry: 'Home & Living',
    platform: 'Shopify',
    description: 'Modern furniture brand with room visualization and modular customization',
    accentColor: '#FFB347',
    secondaryColor: '#2e2a1a',
    image: '/portfolio/burrow.webp',
    url: 'https://burrow.com',
    challenge: 'Burrow needed to help customers visualize furniture in their actual living spaces. The modular nature of their products required a complex configuration system.',
    solution: 'We designed an interactive Shopify store with AR room visualization, modular product configurators showing real-time price changes, and fabric swatch ordering with free samples.',
    result: 'The AR visualization feature increased conversion rates by 42% and reduced return rates by 30%. Fabric sample requests drove a 25% increase in eventual purchases.',
  },
  {
    id: '18',
    name: 'Danube Home',
    industry: 'Home & Living',
    platform: 'Shopify',
    description: 'Home furnishings marketplace with room inspiration galleries',
    accentColor: '#F5DEB3',
    secondaryColor: '#2e2a1e',
    image: '/portfolio/danubehome.webp',
    url: 'https://danubehome.com',
    challenge: 'Danube Home needed to manage a vast catalog across multiple home categories while providing inspiration-driven shopping that helped customers envision complete room designs.',
    solution: 'We built a room-inspiration-driven Shopify store with shoppable mood boards, room-style collections, and smart cross-selling based on design aesthetics and color palettes.',
    result: 'The inspiration gallery drives 35% of all product discoveries and cross-sell revenue increased by 55%. Average order value grew by 30% through room-based bundle recommendations.',
  },
  {
    id: '19',
    name: 'EngiSoft Engineering',
    industry: 'Engineering',
    platform: 'WordPress',
    description: 'Engineering services company with project showcase and service booking system',
    accentColor: '#00D4FF',
    secondaryColor: '#0a1a2e',
    image: '/portfolio/engisoftengineering.webp',
    url: 'https://engisoftengineering.com/',
    challenge: 'EngiSoft Engineering needed a professional WordPress site to showcase their engineering services, manage project portfolios, and generate leads through a streamlined inquiry system.',
    solution: 'We built a modern WordPress site with a custom theme, project portfolio with filtering, service pages optimized for SEO, and an integrated contact and inquiry management system.',
    result: 'Lead generation increased by 180% and organic traffic grew by 95% within 6 months. The professional design helped secure 3 major enterprise contracts in the first quarter.',
  },
  {
    id: '20',
    name: 'Best Deals',
    industry: 'eCommerce',
    platform: 'WordPress',
    description: 'UAE-based deals marketplace with multi-vendor product listings and daily offers',
    accentColor: '#FF6B00',
    secondaryColor: '#2e1a0a',
    image: '/portfolio/bestdeals.webp',
    url: 'https://bestdeals.ae/',
    challenge: 'Best Deals needed a high-performance WordPress marketplace to handle thousands of product listings, daily deal rotations, and multi-vendor management across the UAE market.',
    solution: 'We built a WooCommerce-powered marketplace with vendor dashboards, automated deal scheduling, advanced search and filtering, and a mobile-first design optimized for the Middle East market.',
    result: 'The platform now handles 10,000+ product listings with sub-2s load times. Daily active users increased by 200% and vendor onboarding grew by 150% within the first 3 months.',
  },
  {
    id: '21',
    name: 'Happy Drive',
    industry: 'Automotive',
    platform: 'WordPress',
    description: 'Luxury and budget car rental service in Dubai with real-time booking system',
    accentColor: '#00D4FF',
    secondaryColor: '#0a1a2e',
    image: '/portfolio/happydrive.webp',
    url: 'https://happydrive.ae/',
    challenge: 'Happy Drive needed a WordPress site that communicated luxury and trust while handling real-time vehicle availability, booking management, and serving both budget and premium rental customers in Dubai.',
    solution: 'We designed a visually stunning WordPress site with a real-time fleet management system, instant booking engine, dynamic pricing, and a seamless mobile experience for on-the-go reservations.',
    result: 'Online bookings increased by 250% and the site achieved a 4.8-star Google rating. Mobile conversions account for 65% of all bookings, validating the mobile-first approach.',
  },
]

function PortfolioCard({ item, onSelect }: { item: PortfolioItem; onSelect: (id: string) => void }) {
  return (
    <div
      className="group bg-[#0A0A0A] rounded-xl border border-[rgba(182,255,0,0.06)] overflow-hidden hover:border-[rgba(182,255,0,0.2)] transition-all duration-500 relative"
    >
      {/* Desktop hover overlay with buttons */}
      <div className="absolute inset-0 bg-[rgba(5,5,5,0.85)] hidden sm:flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto p-4">
        <motion.button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onSelect(item.id)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 bg-[#B6FF00] text-[#050505] rounded-full px-5 py-2.5 md:px-6 md:py-3 font-semibold text-sm md:text-base cursor-pointer shadow-[0_0_20px_rgba(182,255,0,0.15)] hover:shadow-[0_0_30px_rgba(182,255,0,0.3)] transition-shadow duration-300"
        >
          View Project
          <ExternalLink className="w-4 h-4" />
        </motion.button>
        <motion.a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-5 py-2.5 md:px-6 md:py-3 font-semibold text-sm md:text-base border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
        >
          <Globe className="w-4 h-4" />
          Visit Website
        </motion.a>
      </div>

      {/* Screenshot thumbnail */}
      <div className="relative transition-all duration-500 group-hover:scale-[1.02] p-3 md:p-4">
        <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(182,255,0,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)]">
          <img
            src={item.image}
            alt={`${item.name} - ${item.industry} ${item.platform} store built by Appalachian Growth Solutions`}
            loading="lazy"
            className="w-full object-contain object-top bg-[#111] aspect-[16/10]"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4 pt-0 space-y-2 md:space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-block px-2 py-0.5 text-[11px] md:text-xs rounded-md font-medium"
            style={{
              backgroundColor: `${item.accentColor}15`,
              color: item.accentColor,
            }}
          >
            {item.industry}
          </span>
          <span
            className={`inline-block px-2 py-0.5 text-[11px] md:text-xs rounded-md font-medium ${
              item.platform === 'Shopify'
                ? 'bg-[rgba(182,255,0,0.1)] text-[#B6FF00]'
                : 'bg-[rgba(0,212,255,0.1)] text-[#00D4FF]'
            }`}
          >
            {item.platform}
          </span>
        </div>

        <h3 className="text-white font-bold text-sm md:text-base leading-tight">
          {item.name}
        </h3>

        <p className="text-[#aaa] text-xs md:text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Bottom tags — desktop only */}
        <div className="hidden sm:flex flex-wrap gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.04)]">
          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded bg-[rgba(182,255,0,0.08)] text-[#B6FF00]">
            {item.platform}
          </span>
          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded bg-[rgba(182,255,0,0.05)] text-[#aaa]">
            {item.industry}
          </span>
        </div>

        {/* Mobile action buttons — always visible on touch devices */}
        <div className="flex sm:hidden items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <button
            onClick={() => onSelect(item.id)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#B6FF00] text-[#050505] rounded-full px-4 py-2.5 font-semibold text-sm cursor-pointer"
          >
            View Project
            <ExternalLink className="w-4 h-4" />
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-white/10 text-white rounded-full px-4 py-2.5 font-semibold text-sm border border-white/20"
          >
            <Globe className="w-4 h-4" />
            Visit
          </a>
        </div>
      </div>
    </div>
  )
}

function CaseStudyModal({
  item,
  onClose,
}: {
  item: PortfolioItem
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0A0A0A] rounded-2xl border border-[rgba(182,255,0,0.15)] w-[95vw] sm:w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 relative"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#999] hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Screenshot */}
        <div className="mb-6 -mx-2 md:-mx-4">
          <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
            <img
              src={item.image}
              alt={`${item.name} full screenshot - ${item.industry} ${item.platform} store`}
              loading="lazy"
              className="w-full object-contain object-top bg-[#111] aspect-[16/9]"
            />
          </div>
        </div>

        {/* Project Name */}
        <h2 className="text-white text-2xl font-bold mb-4 pr-12">{item.name}</h2>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className="inline-block px-3 py-1 text-xs rounded-md font-medium"
            style={{
              backgroundColor: `${item.accentColor}15`,
              color: item.accentColor,
            }}
          >
            {item.industry}
          </span>
          <span
            className={`inline-block px-3 py-1 text-xs rounded-md font-medium ${
              item.platform === 'Shopify'
                ? 'bg-[rgba(182,255,0,0.1)] text-[#B6FF00]'
                : 'bg-[rgba(0,212,255,0.1)] text-[#00D4FF]'
            }`}
          >
            {item.platform}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#999] text-sm leading-relaxed mb-8">{item.description}</p>

        {/* Challenge / Solution / Result */}
        <div className="space-y-6">
          {[
            { label: 'The Challenge', text: item.challenge, accent: '#FF6B6B' },
            { label: 'Our Solution', text: item.solution, accent: '#B6FF00' },
            { label: 'The Result', text: item.result, accent: '#00D4FF' },
          ].map((section) => (
            <div key={section.label}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: section.accent }}>
                {section.label}
              </h3>
              <p className="text-[#bbb] text-sm leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#B6FF00] text-[#050505] rounded-full px-8 py-3 font-semibold text-sm hover:scale-105 transition-transform duration-200"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                onClose()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-sm border border-white/15 text-white hover:border-[rgba(182,255,0,0.4)] hover:text-[#B6FF00] transition-all duration-200 cursor-pointer"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const { data } = usePublicContent()

  const portfolioItems = data?.portfolioItems?.length
    ? data.portfolioItems
    : defaultPortfolioItems

  const categories = (() => {
    if (!data?.portfolioItems?.length) return defaultCategories
    const platforms = new Set<string>()
    const industries = new Set<string>()
    for (const item of data.portfolioItems) {
      if (item.platform) platforms.add(item.platform)
      if (item.industry) industries.add(item.industry)
    }
    return ['All', ...Array.from(new Set([...platforms, ...industries]))]
  })()

  const selectedItem = selectedProject !== null
    ? portfolioItems.find((item) => item.id === selectedProject) ?? null
    : null

  const filteredItems =
    activeFilter === 'All'
      ? portfolioItems
      : portfolioItems.filter(
          (item) => item.platform === activeFilter || item.industry === activeFilter
        )

  const INITIAL_COUNT = 6
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_COUNT)
  const hasMore = filteredItems.length > INITIAL_COUNT

  // Reset showAll when filter changes
  const handleFilterChange = (cat: string) => {
    setActiveFilter(cat)
    setShowAll(false)
  }

  return (
    <section id="portfolio" className="bg-[#050505] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <SectionLabel>OUR WORK</SectionLabel>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            STORES WE&apos;VE BUILT
          </h2>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`min-h-[44px] px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#B6FF00] text-black neon-glow'
                    : 'bg-transparent text-[#888] border border-[rgba(182,255,0,0.15)] hover:border-[rgba(182,255,0,0.35)] hover:text-[#B6FF00]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Grid — all cards equal size */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {displayedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, layout: { duration: 0.3 } }}
              >
                <PortfolioCard item={item} onSelect={setSelectedProject} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More / View Less Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mt-10 md:mt-14"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2.5 text-sm md:text-base font-semibold text-white rounded-full px-8 py-3 border border-white/10 hover:border-[#B6FF00]/40 hover:text-[#B6FF00] transition-all duration-300 bg-[rgba(182,255,0,0.06)] hover:bg-[rgba(182,255,0,0.1)] cursor-pointer"
            >
              {showAll ? 'View Less' : `View All Projects (${filteredItems.length})`}
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedItem && (
          <CaseStudyModal item={selectedItem} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
