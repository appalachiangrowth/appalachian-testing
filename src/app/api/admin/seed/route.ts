import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { hashPassword, verifyToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { marked } from 'marked';

export async function GET() {
  return POST();
}

async function requireAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    const payload = await verifyToken(token);
    return !!payload;
  } catch {
    return false;
  }
}

async function ensureTables() {
  const sql = `
CREATE TABLE IF NOT EXISTS AdminUser (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  email VARCHAR(191) NOT NULL,
  password VARCHAR(191) NOT NULL,
  name VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX AdminUser_email_key (email)
);

CREATE TABLE IF NOT EXISTS Blog (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  coverImage VARCHAR(191),
  category VARCHAR(191) NOT NULL DEFAULT 'General',
  author VARCHAR(191) NOT NULL DEFAULT 'Appalachian Growth',
  isPublished BOOLEAN NOT NULL DEFAULT FALSE,
  readTime INT NOT NULL DEFAULT 5,
  metaTitle VARCHAR(191),
  metaDescription TEXT,
  canonicalUrl VARCHAR(191),
  ogTitle VARCHAR(191),
  ogDescription TEXT,
  ogImage VARCHAR(191),
  publishedAt DATETIME(3),
  \`views\` INT NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX Blog_slug_key (slug)
);

CREATE TABLE IF NOT EXISTS BlogCategory (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT,
  sortOrder INT NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX BlogCategory_name_key (name),
  UNIQUE INDEX BlogCategory_slug_key (slug)
);

CREATE TABLE IF NOT EXISTS BlogTag (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX BlogTag_name_key (name),
  UNIQUE INDEX BlogTag_slug_key (slug)
);

CREATE TABLE IF NOT EXISTS PostTag (
  postId VARCHAR(30) NOT NULL,
  tagId VARCHAR(30) NOT NULL,
  PRIMARY KEY (postId, tagId)
);

CREATE TABLE IF NOT EXISTS PortfolioItem (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  industry VARCHAR(191) NOT NULL,
  platform VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  accentColor VARCHAR(191) NOT NULL DEFAULT '#B6FF00',
  secondaryColor VARCHAR(191) NOT NULL DEFAULT '#1a1a2e',
  image VARCHAR(191) NOT NULL,
  url VARCHAR(191) NOT NULL DEFAULT '',
  challenge TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  sortOrder INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS Testimonial (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  role VARCHAR(191) NOT NULL,
  type VARCHAR(191) NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  sortOrder INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS TeamMember (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  role VARCHAR(191) NOT NULL,
  bio TEXT NOT NULL,
  initials VARCHAR(191) NOT NULL,
  websiteUrl VARCHAR(191) NOT NULL DEFAULT '#',
  linkedinUrl VARCHAR(191) NOT NULL DEFAULT '#',
  githubUrl VARCHAR(191) NOT NULL DEFAULT '#',
  sortOrder INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS FAQ (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS MarketingService (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  stat VARCHAR(191) NOT NULL,
  icon VARCHAR(191) NOT NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS Transformation (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  client VARCHAR(191) NOT NULL,
  metric VARCHAR(191) NOT NULL,
  \`before\` VARCHAR(191) NOT NULL DEFAULT '',
  \`after\` VARCHAR(191) NOT NULL DEFAULT '',
  improvement VARCHAR(191) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sortOrder INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS MarketingMetric (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  metric VARCHAR(191) NOT NULL,
  \`before\` VARCHAR(191) NOT NULL DEFAULT '',
  \`after\` VARCHAR(191) NOT NULL DEFAULT '',
  increase VARCHAR(191) NOT NULL DEFAULT '',
  sortOrder INT NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS HeroStat (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  \`value\` VARCHAR(191) NOT NULL,
  label VARCHAR(191) NOT NULL,
  target INT NOT NULL DEFAULT 0,
  suffix VARCHAR(191) NOT NULL DEFAULT '',
  isStatic BOOLEAN NOT NULL DEFAULT FALSE,
  sortOrder INT NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS HeroScreenshot (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  category VARCHAR(191) NOT NULL,
  url VARCHAR(191) NOT NULL,
  alt VARCHAR(191) NOT NULL DEFAULT '',
  sortOrder INT NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS SeoResultImage (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  url VARCHAR(191) NOT NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS SiteSetting (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  \`key\` VARCHAR(191) NOT NULL,
  \`value\` TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX SiteSetting_key_key (\`key\`)
);

CREATE TABLE IF NOT EXISTS ContactSubmission (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(191),
  service VARCHAR(191),
  platform VARCHAR(191),
  message TEXT NOT NULL,
  \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS UploadedFile (
  id VARCHAR(30) NOT NULL PRIMARY KEY,
  filename VARCHAR(191) NOT NULL,
  url VARCHAR(191) NOT NULL,
  mimetype VARCHAR(191) NOT NULL,
  size INT NOT NULL,
  category VARCHAR(191) NOT NULL DEFAULT 'general',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
`;

  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    await db.$executeRawUnsafe(stmt);
  }

  // Add new blog columns if they don't exist (safe ALTER TABLE for existing databases)
  const blogColumns = [
    ['metaTitle', 'VARCHAR(191)'],
    ['metaDescription', 'TEXT'],
    ['canonicalUrl', 'VARCHAR(191)'],
    ['ogTitle', 'VARCHAR(191)'],
    ['ogDescription', 'TEXT'],
    ['ogImage', 'VARCHAR(191)'],
    ['publishedAt', 'DATETIME(3)'],
    ['`views`', 'INT NOT NULL DEFAULT 0'],
  ];
  for (const [col, type] of blogColumns) {
    try {
      await db.$executeRawUnsafe(`ALTER TABLE Blog ADD COLUMN ${col} ${type}`);
    } catch (e: unknown) {
      // Column already exists — ignore
      if (!(e instanceof Error && e.message.includes('Duplicate')))
        console.error(`Failed to add column ${col}:`, e);
    }
  }
}

export async function POST() {
  const results: Record<string, number> = {};

  // Require authentication for seed endpoint
  const isAuthorized = await requireAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Auto-create all tables
    await ensureTables();
    results.tablesCreated = 1;

    // ─── Admin User ───
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPass) {
      console.error('[Seed] ADMIN_EMAIL or ADMIN_PASSWORD not configured');
      return NextResponse.json({ error: 'Server configuration error', results }, { status: 500 });
    }
    const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashed = await hashPassword(adminPass);
      await db.adminUser.create({
        data: { email: adminEmail, password: hashed, name: 'Admin' },
      });
      results.adminUsers = 1;
    } else {
      results.adminUsers = 0;
    }

    // ─── Portfolio Items (first 8) ───
    const portfolioCount = await db.portfolioItem.count();
    if (portfolioCount === 0) {
      const portfolioData = [
        {
          name: 'Skinny Dip London', industry: 'Fashion', platform: 'Shopify',
          description: 'Playful fashion brand with bold design and engaging product displays',
          accentColor: '#B6FF00', secondaryColor: '#1a1a2e', image: '/portfolio/skinnydiplondon.webp',
          url: 'https://skinnydiplondon.com',
          challenge: 'Skinny Dip London needed a vibrant, on-brand store that matched their playful identity while maintaining fast load times and a seamless mobile shopping experience.',
          solution: 'We built a custom Shopify theme with bold typography, animated product hover states, and a mobile-first layout. We optimized all images and implemented lazy loading for their large catalog.',
          result: 'Mobile conversion rate increased by 52% and page load speed dropped to 1.4 seconds. The redesign contributed to a 35% increase in monthly revenue within the first quarter.',
          sortOrder: 0,
        },
        {
          name: 'Press London', industry: 'Fashion', platform: 'Shopify',
          description: 'Contemporary menswear brand with editorial-style product pages',
          accentColor: '#c9a96e', secondaryColor: '#1a1a0e', image: '/portfolio/presslondon.webp',
          url: 'https://presslondon.com',
          challenge: 'Press London wanted to elevate their online presence with an editorial look that reflected their premium menswear positioning. The existing store lacked visual storytelling and had a 4.5s load time.',
          solution: 'We created a magazine-inspired Shopify theme with full-bleed imagery, lookbook integration, and editorial-style product pages. We optimized the asset pipeline for sub-2s loads.',
          result: 'Time on site increased by 85% and the editorial layout drove a 42% increase in pages per session. Organic traffic grew by 60% within 6 months of the redesign.',
          sortOrder: 1,
        },
        {
          name: 'HG Walter', industry: 'Fashion', platform: 'Shopify',
          description: 'Luxury menswear with bespoke tailoring options and premium UX',
          accentColor: '#8B7355', secondaryColor: '#1e1a14', image: '/portfolio/hgwalter.webp',
          url: 'https://hgwalter.com',
          challenge: 'HG Walter required a store that conveyed true luxury craftsmanship while offering bespoke customization options \u2014 made-to-measure suits with complex configuration workflows.',
          solution: 'We built a sophisticated Shopify Plus store with a custom suit configurator, fabric selection tool, and appointment booking system. The design emphasized whitespace and premium typography.',
          result: 'The bespoke configurator increased custom orders by 180%. Average order value rose to $1,200+ and the store was featured in GQ and Esquire as a best-in-class eCommerce experience.',
          sortOrder: 2,
        },
        {
          name: 'Ernest Leoty', industry: 'Fashion', platform: 'Shopify',
          description: 'Premium activewear brand with lifestyle content and subscription model',
          accentColor: '#FF4444', secondaryColor: '#2e1a1a', image: '/portfolio/ernestleoty.webp',
          url: 'https://ernestleoty.com',
          challenge: 'Ernest Leoty needed to merge activewear functionality with luxury fashion aesthetics. Their subscription box model required a flexible fulfillment system with swap and pause capabilities.',
          solution: 'We designed a visually stunning Shopify store with lifestyle photography integration, a flexible subscription management portal, and outfit recommendation algorithms.',
          result: 'Subscription enrollment grew by 220% and the visual redesign attracted coverage in Vogue and Well+Good. Customer lifetime value increased by 95% within the first year.',
          sortOrder: 3,
        },
        {
          name: 'Jones Road Beauty', industry: 'Beauty', platform: 'Shopify',
          description: 'Clean beauty brand with educational content and shade-matching tools',
          accentColor: '#90EE90', secondaryColor: '#1a2e1a', image: '/portfolio/jonesroadbeauty.webp',
          url: 'https://jonesroadbeauty.com',
          challenge: 'Jones Road Beauty needed to scale their DTC channel while maintaining the personal, educational shopping experience their founder built on social media. Product education was critical for conversion.',
          solution: 'We built a content-rich Shopify store with video tutorials on product pages, a shade-matching quiz, and a \u201cHow to Use\u201d guide system. We integrated their social content feed directly into the shopping experience.',
          result: 'The educational content strategy drove a 65% increase in conversion rate. Video-enabled product pages saw 3x higher engagement, and the shade quiz achieved a 45% add-to-cart rate.',
          sortOrder: 4,
        },
        {
          name: 'ColourPop', industry: 'Beauty', platform: 'Shopify',
          description: 'Trend-driven beauty brand with rapid product launches and high-traffic events',
          accentColor: '#E040FB', secondaryColor: '#2a1a2e', image: '/portfolio/colourpop.webp',
          url: 'https://colourpop.com',
          challenge: 'ColourPop handles massive traffic spikes during product drops \u2014 often 50x normal volume. Their existing infrastructure struggled with checkout timeouts and inventory sync issues during launches.',
          solution: 'We optimized their Shopify Plus store for extreme traffic events with caching strategies, queue-based checkout during drops, and real-time inventory management across multiple warehouses.',
          result: 'The store now handles 50,000+ concurrent users without a single checkout timeout during product launches. Cart abandonment during drops dropped from 45% to 12%.',
          sortOrder: 5,
        },
        {
          name: 'Blackwolf Nation', industry: 'Fashion', platform: 'Shopify',
          description: 'Outdoor and lifestyle brand with rugged design and community features',
          accentColor: '#FFB347', secondaryColor: '#2e2a1a', image: '/portfolio/blackwolfnation.webp',
          url: 'https://blackwolfnation.com',
          challenge: 'Blackwolf Nation needed a store that matched their adventurous brand identity while building a loyal community. Their previous site had basic functionality and no community engagement features.',
          solution: 'We designed a bold, adventure-themed Shopify store with user-generated content galleries, a community hub, and loyalty program integration. We added adventure-ready product filtering.',
          result: 'Community engagement increased by 300% and user-generated content now drives 25% of new customer acquisition. The loyalty program has a 68% active enrollment rate.',
          sortOrder: 6,
        },
        {
          name: 'Fenty Beauty', industry: 'Beauty', platform: 'Shopify',
          description: 'Inclusive beauty brand with virtual try-on and shade matching',
          accentColor: '#FF8A65', secondaryColor: '#2e1a14', image: '/portfolio/fentybeauty.webp',
          url: 'https://fentybeauty.com',
          challenge: 'Managing a massive shade range (50+ foundation shades) with accurate color representation online and providing virtual try-on experiences across all device types.',
          solution: 'We built an advanced Shopify store with AR-powered virtual try-on, accurate color calibration for each shade, and a smart shade-matching algorithm based on skin tone analysis.',
          result: 'Virtual try-on feature increased conversion rates by 38% and reduced shade-related returns by 55%. The shade matching tool drives 30% of all first-time purchases.',
          sortOrder: 7,
        },
      ];
      const pRes = await db.portfolioItem.createMany({ data: portfolioData });
      results.portfolioItems = pRes.count;
    } else {
      results.portfolioItems = 0;
    }

    // ─── Testimonials ───
    const testimonialCount = await db.testimonial.count();
    if (testimonialCount === 0) {
      const tRes = await db.testimonial.createMany({
        data: [
          { name: 'Sarah Mitchell', role: 'CEO, Luxe Fashion', type: 'Fashion eCommerce', text: 'Appalachian Growth Solutions transformed our online presence completely. Our Shopify store looks incredible and our sales have increased by 200% since launch.', rating: 5, sortOrder: 0 },
          { name: 'James Rodriguez', role: 'Founder, TechVault', type: 'Electronics Store', text: 'Professional, responsive, and incredibly talented. They built our WordPress store exactly how we envisioned it. Highly recommended!', rating: 5, sortOrder: 1 },
          { name: 'Emily Chen', role: 'Owner, PureSkin', type: 'Beauty & Skincare', text: 'The best decision we made was hiring Appalachian Growth Solutions. Our store is fast, beautiful, and our customers love the shopping experience.', rating: 4, sortOrder: 2 },
          { name: 'Michael Torres', role: 'Director, Summit Sports', type: 'Sports Equipment', text: 'The team at Appalachian Growth Solutions delivered an enterprise-level Shopify Plus store that handles 10K+ daily orders flawlessly. Their technical expertise is unmatched.', rating: 5, sortOrder: 3 },
          { name: 'Aisha Khan', role: 'Founder, Nordic Home', type: 'Home & Living', text: 'From concept to launch, Appalachian Growth Solutions made the entire process seamless. Our WordPress store is beautiful and our customers love the experience.', rating: 5, sortOrder: 4 },
          { name: 'David Park', role: 'CTO, Green Earth', type: 'Sustainable Products', text: 'Appalachian Growth Solutions helped us implement complex subscription features and custom product builders. They are true eCommerce experts.', rating: 4, sortOrder: 5 },
        ],
      });
      results.testimonials = tRes.count;
    } else {
      results.testimonials = 0;
    }

    // ─── Team Members ───
    const teamCount = await db.teamMember.count();
    if (teamCount === 0) {
      const tmRes = await db.teamMember.createMany({
        data: [
          { name: 'Alex Carter', role: 'Founder & CEO', bio: 'eCommerce visionary with 8+ years building high-converting stores for global brands.', initials: 'AC', sortOrder: 0 },
          { name: 'Sarah Kim', role: 'Lead Developer', bio: 'Full-stack expert specializing in Shopify Plus and custom WordPress solutions.', initials: 'SK', sortOrder: 1 },
          { name: 'Marcus Johnson', role: 'Marketing Director', bio: 'Data-driven marketer who has managed $10M+ in ad spend across platforms.', initials: 'MJ', sortOrder: 2 },
          { name: 'Priya Patel', role: 'UI/UX Designer', bio: 'Award-winning designer crafting intuitive, conversion-focused shopping experiences.', initials: 'PP', sortOrder: 3 },
        ],
      });
      results.teamMembers = tmRes.count;
    } else {
      results.teamMembers = 0;
    }

    // ─── FAQs ───
    const faqCount = await db.fAQ.count();
    if (faqCount === 0) {
      const fRes = await db.fAQ.createMany({
        data: [
          { question: 'How long does it take to build a store?', answer: 'Typically, a complete store takes 1-3 weeks depending on complexity. Simple stores can be ready in 5-7 business days, while more complex projects with custom features may take 2-4 weeks.', sortOrder: 0 },
          { question: 'Do you build both Shopify and WordPress stores?', answer: 'Yes! We specialize in both platforms. We help you choose the best one based on your business needs, budget, and long-term goals.', sortOrder: 1 },
          { question: 'Can you upload my products?', answer: 'Absolutely. We handle complete product upload including titles, descriptions, images, variants, pricing, and collection organization.', sortOrder: 2 },
          { question: 'Can you redesign my existing store?', answer: 'Yes, we offer complete store redesigns. We analyze your current store, identify improvement areas, and create a modern, conversion-optimized design.', sortOrder: 3 },
          { question: 'Do you provide SEO?', answer: 'Yes, SEO is included in all our packages. We optimize product pages, collections, meta tags, URLs, and implement technical SEO best practices.', sortOrder: 4 },
          { question: 'Do you provide digital marketing?', answer: 'Yes, we offer comprehensive digital marketing services including SEO, Meta Ads, Google Ads, TikTok Ads, and social media marketing.', sortOrder: 5 },
          { question: 'Will my store be mobile responsive?', answer: 'Absolutely. All our stores are built mobile-first and tested across all devices and screen sizes for perfect responsiveness.', sortOrder: 6 },
          { question: 'Do you provide ongoing support?', answer: 'Yes, we provide 24/7 ongoing support. Our team is always available to help with updates, fixes, improvements, and any questions you may have.', sortOrder: 7 },
        ],
      });
      results.faqs = fRes.count;
    } else {
      results.faqs = 0;
    }

    // ─── Marketing Services ───
    const serviceCount = await db.marketingService.count();
    if (serviceCount === 0) {
      const msRes = await db.marketingService.createMany({
        data: [
          { title: 'SEO', description: 'Dominate search results with our comprehensive SEO strategy.', stat: '150%+ organic traffic growth', icon: 'Search', sortOrder: 0 },
          { title: 'Meta Ads', description: 'Targeted Facebook and Instagram ads that convert.', stat: '5x average ROAS', icon: 'Megaphone', sortOrder: 1 },
          { title: 'Google Ads', description: 'Strategic Google Ads campaigns for maximum ROI.', stat: '300%+ average ROI', icon: 'Globe', sortOrder: 2 },
          { title: 'TikTok Ads', description: 'Viral TikTok campaigns for brand awareness and sales.', stat: '10M+ views generated', icon: 'Video', sortOrder: 3 },
          { title: 'Social Media Marketing', description: 'Build and engage your community across platforms.', stat: '50K+ followers gained', icon: 'Users', sortOrder: 4 },
          { title: 'Conversion Optimization', description: 'A/B testing and optimization for maximum conversions.', stat: '40%+ conversion increase', icon: 'BarChart3', sortOrder: 5 },
        ],
      });
      results.marketingServices = msRes.count;
    } else {
      results.marketingServices = 0;
    }

    // ─── Transformations ───
    const transformCount = await db.transformation.count();
    if (transformCount === 0) {
      const tRes = await db.transformation.createMany({
        data: [
          { client: 'Luxe Fashion', metric: 'Conversion Rate', before: '1.2%', after: '4.8%', improvement: '300%', description: 'Complete Shopify Plus redesign with custom checkout and product pages', sortOrder: 0 },
          { client: 'Glow Beauty', metric: 'Page Load Speed', before: '6.2s', after: '2.1s', improvement: '66%', description: 'Headless WooCommerce rebuild with optimized assets and CDN', sortOrder: 1 },
          { client: 'TechVault', metric: 'Monthly Revenue', before: '$45K', after: '$128K', improvement: '184%', description: 'Google Ads + SEO strategy driving qualified traffic', sortOrder: 2 },
        ],
      });
      results.transformations = tRes.count;
    } else {
      results.transformations = 0;
    }

    // ─── Marketing Metrics ───
    const metricCount = await db.marketingMetric.count();
    if (metricCount === 0) {
      const mmRes = await db.marketingMetric.createMany({
        data: [
          { metric: 'Monthly Revenue', before: '$12,400', after: '$127,450', increase: '+928%', sortOrder: 0 },
          { metric: 'Organic Traffic', before: '3,200 visits', after: '84,230 visits', increase: '+2,532%', sortOrder: 1 },
          { metric: 'Conversion Rate', before: '1.2%', after: '4.8%', increase: '+300%', sortOrder: 2 },
          { metric: 'Cost Per Acquisition', before: '$45', after: '$12', increase: '-73%', sortOrder: 3 },
        ],
      });
      results.marketingMetrics = mmRes.count;
    } else {
      results.marketingMetrics = 0;
    }

    // ─── Hero Stats ───
    const heroStatCount = await db.heroStat.count();
    if (heroStatCount === 0) {
      const hsRes = await db.heroStat.createMany({
        data: [
          { value: '1000+', label: 'Stores Designed', target: 1000, suffix: '+', isStatic: false, sortOrder: 0 },
          { value: '3+', label: 'Years Experience', target: 3, suffix: '+', isStatic: false, sortOrder: 1 },
          { value: '24/7', label: 'Support', target: 0, suffix: '', isStatic: true, sortOrder: 2 },
          { value: '100%', label: 'Client Satisfaction', target: 100, suffix: '%', isStatic: false, sortOrder: 3 },
        ],
      });
      results.heroStats = hsRes.count;
    } else {
      results.heroStats = 0;
    }

    // ─── Hero Screenshots ───
    const screenshotCount = await db.heroScreenshot.count();
    if (screenshotCount === 0) {
      const laptopScreenshots = [
        '/portfolio/skinnydiplondon.webp', '/portfolio/hgwalter.webp', '/portfolio/colourpop.webp',
        '/portfolio/soldejaneiro.webp', '/portfolio/monawatch.webp', '/portfolio/turtlebeach.webp', '/portfolio/macbookrepairlab.webp',
      ];
      const monitorScreenshots = [
        '/portfolio/presslondon.webp', '/portfolio/ernestleoty.webp', '/portfolio/jonesroadbeauty.webp',
        '/portfolio/blackwolfnation.webp', '/portfolio/fentybeauty.webp', '/portfolio/truebotanicals.webp',
        '/portfolio/leeajewelry.webp', '/portfolio/burrow.webp',
      ];
      const mobileScreenshots = [
        '/portfolio/skinnydiplondon.webp', '/portfolio/presslondon.webp', '/portfolio/hgwalter.webp',
      ];

      const screenshotData = [
        ...laptopScreenshots.map((url, i) => ({ category: 'laptop' as const, url, alt: `Laptop screenshot ${i + 1}`, sortOrder: i })),
        ...monitorScreenshots.map((url, i) => ({ category: 'monitor' as const, url, alt: `Monitor screenshot ${i + 1}`, sortOrder: i })),
        ...mobileScreenshots.map((url, i) => ({ category: 'mobile' as const, url, alt: `Mobile screenshot ${i + 1}`, sortOrder: i })),
      ];
      const ssRes = await db.heroScreenshot.createMany({ data: screenshotData });
      results.heroScreenshots = ssRes.count;
    } else {
      results.heroScreenshots = 0;
    }

    // ─── Blog Posts ───
    const blogCount = await db.blog.count();
    if (blogCount === 0) {
      const blogPosts = [
        {
          title: 'Why Shopify Is the Best E-Commerce Platform in 2025',
          slug: 'why-shopify-is-best-for-ecommerce-2025',
          excerpt: 'Discover why thousands of businesses are choosing Shopify over other platforms. From ease of use to powerful features, here\'s your complete guide.',
          content: await marked(`# Why Shopify Is the Best E-Commerce Platform in 2025

Starting an online store has never been easier, but choosing the right platform can make or break your business. After building over **1,000+ stores**, we\'ve seen firsthand why Shopify continues to dominate the e-commerce landscape.

## 1. Unmatched Ease of Use

Shopify\'s dashboard is designed for business owners, not developers. You can set up a professional store in under an hour without touching a single line of code. The intuitive interface lets you manage products, track orders, and analyze sales data from one central location.

## 2. Powerful Built-In Features

Unlike other platforms that require expensive plugins for basic functionality, Shopify includes:

- **Abandoned cart recovery** to win back lost sales
- **Multi-channel selling** on Instagram, Facebook, TikTok, and more
- **Built-in SEO tools** to help your store rank on Google
- **Payment processing** with competitive rates through Shopify Payments
- **Real-time analytics** and reporting dashboards

## 3. Incredible App Ecosystem

With over **8,000+ apps** in the Shopify App Store, you can extend your store\'s functionality without custom development. Whether you need email marketing, inventory management, or subscription billing, there\'s an app for that.

## 4. Scalability That Grows With You

Shopify scales from a small startup to a massive enterprise. Brands like Gymshark, SKIMS, and Allbirds started on Shopify and grew into household names. The platform handles everything from 10 orders a day to 10,000+ without breaking a sweat.

## 5. World-Class Security

Shopify is **PCI DSS compliant** and handles security at the platform level. You get SSL certificates, fraud analysis, and automatic updates without lifting a finger. Your customers\' data is always protected.

## The Bottom Line

If you\'re serious about building a profitable online store, Shopify is the clear choice. It combines power, simplicity, and scalability in a way no other platform can match.

**Ready to launch your Shopify store?** [Contact us](/contact) for a free consultation and let\'s build something amazing together.`),
          coverImage: '/portfolio/burrow.webp',
          category: 'E-Commerce',
          author: 'Appalachian Growth',
          isPublished: true,
          readTime: 5,
          publishedAt: new Date('2025-08-15'),
          tagNames: ['Shopify', 'E-Commerce', 'Online Store'],
        },
        {
          title: '10 SEO Strategies That Actually Work in 2025',
          slug: 'seo-strategies-that-actually-work-2025',
          excerpt: 'Stop wasting time on outdated SEO tactics. These 10 proven strategies are driving real results for our clients right now.',
          content: await marked(`# 10 SEO Strategies That Actually Work in 2025

SEO is constantly evolving, and what worked last year might not work today. After managing SEO for **hundreds of stores**, we\'ve identified the strategies that are actually moving the needle in 2025.

## 1. Focus on Search Intent, Not Just Keywords

Google is smarter than ever. Instead of stuffing keywords, create content that answers the **intent behind the search**. If someone searches \"best running shoes 2025\", they want a curated list, not a product page.

## 2. Optimize for Core Web Vitals

Page speed is a ranking factor. Use tools like Google PageSpeed Insights to optimize your:

- **Largest Contentful Paint (LCP)** — aim for under 2.5 seconds
- **Interaction to Next Paint (INP)** — keep interactions responsive
- **Cumulative Layout Shift (CLS)** — minimize visual instability

## 3. Build Topical Authority

Instead of random blog posts, create **content clusters** around your core topics. Cover every angle of a subject to become the go-to resource in your niche.

## 4. Leverage Long-Tail Keywords

Long-tail keywords have less competition and higher conversion rates. Tools like Ahrefs, Semrush, and even Google\'s \"People Also Ask\" feature can reveal golden opportunities.

## 5. Create Linkable Assets

Data-driven studies, original research, and comprehensive guides naturally attract backlinks — the most powerful ranking signal. One quality backlink can be worth 100 low-quality directory links.

## 6. Optimize for Featured Snippets

Structure your content with clear headings, bullet points, and concise answers to capture position zero. Featured snippets can drive up to **30% more traffic** to your page.

## 7. Technical SEO Is Non-Negotiable

Fix crawl errors, implement proper schema markup, create XML sitemaps, and ensure your site is mobile-friendly. Technical SEO is the foundation everything else is built on.

## 8. User Experience Signals Matter

Google tracks how users interact with your site. High bounce rates and low time-on-page signal poor quality. Improve your UX to improve your rankings.

## 9. Video Content for SEO

Video results appear in over **80% of Google search results**. Create video content, optimize the title and description, and use video schema markup.

## 10. Monitor, Analyze, and Adapt

SEO isn\'t a one-time task. Use Google Search Console, Google Analytics, and rank tracking tools to monitor your progress and adapt your strategy based on real data.

## Results Speak for Themselves

Our clients have seen **200%+ increases in organic traffic** using these strategies. The key is consistency and patience — SEO compounds over time.

**Want to boost your store\'s organic traffic?** [Get a free SEO audit](/contact) from our team.`),
          coverImage: '/portfolio/fentybeauty.webp',
          category: 'SEO',
          author: 'Appalachian Growth',
          isPublished: true,
          readTime: 7,
          publishedAt: new Date('2025-08-10'),
          tagNames: ['SEO', 'Google', 'Organic Traffic', 'Digital Marketing'],
        },
        {
          title: 'How to Double Your E-Commerce Sales with CRO',
          slug: 'conversion-rate-optimization-boost-sales',
          excerpt: 'Your traffic is fine — your conversion rate is the problem. Here\'s how we help stores turn more visitors into paying customers.',
          content: await marked(`# How to Double Your E-Commerce Sales with CRO

Getting traffic to your store is only half the battle. If visitors aren\'t buying, you\'re leaving money on the table. **Conversion Rate Optimization (CRO)** is the art and science of turning more of your existing traffic into paying customers.

## What Is CRO and Why Does It Matter?

CRO involves analyzing how visitors interact with your store and making data-driven changes to improve the percentage that complete a purchase. Even a **1-2% increase** in conversion rate can mean thousands of dollars in additional revenue.

## The Biggest Conversion Killers

### 1. Slow Page Load Times
40% of visitors abandon a site that takes more than 3 seconds to load. Every second counts — optimize your images, minimize JavaScript, and use a CDN.

### 2. Complicated Checkout Process
Every extra step in checkout costs you sales. The ideal checkout should be **3 steps or fewer**. Offer guest checkout, multiple payment options, and a clear progress indicator.

### 3. Poor Product Photography
Your product images are your sales team. High-quality, multiple-angle shots with zoom capability can increase conversions by **30-40%**.

### 4. Missing Social Proof
Reviews, testimonials, and user-generated content build trust. Display ratings prominently and feature real customer photos when possible.

### 5. Unclear Value Proposition
Visitors should understand what makes you different within 5 seconds of landing on your page. Your hero section needs a clear headline, subheadline, and CTA.

## Our CRO Process

1. **Audit** — We analyze your entire funnel using heatmaps, session recordings, and analytics
2. **Hypothesize** — Based on data, we identify the highest-impact opportunities
3. **Test** — We run A/B tests to validate every change
4. **Iterate** — Continuous testing and improvement month over month

## Real Results

Our CRO clients typically see:
- **30-50% increase** in conversion rates
- **25% decrease** in bounce rates
- **2x improvement** in add-to-cart rates

**Ready to stop leaving money on the table?** [Contact us](/contact) for a free CRO audit of your store.`),
          coverImage: '/portfolio/pelacase.webp',
          category: 'CRO',
          author: 'Appalachian Growth',
          isPublished: true,
          readTime: 6,
          publishedAt: new Date('2025-08-05'),
          tagNames: ['CRO', 'Conversion Rate', 'E-Commerce Sales'],
        },
      ];

      for (const post of blogPosts) {
        const { tagNames, ...data } = post;
        const blog = await db.blog.create({ data });
        // Create tags and link them
        if (tagNames && tagNames.length > 0) {
          for (const name of tagNames) {
            const tagSlug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
            const tag = await db.blogTag.upsert({
              where: { slug: tagSlug },
              update: {},
              create: { name, slug: tagSlug },
            });
            await db.postTag.create({ data: { postId: blog.id, tagId: tag.id } });
          }
        }
        // Sync category
        if (post.category && post.category !== 'General') {
          const catSlug = post.category.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
          await db.blogCategory.upsert({
            where: { slug: catSlug },
            update: {},
            create: { name: post.category, slug: catSlug },
          });
        }
      }
      results.blogPosts = blogPosts.length;
    } else {
      results.blogPosts = 0;
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      created: results,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Seed failed', details: String(error) },
      { status: 500 },
    );
  }
}
