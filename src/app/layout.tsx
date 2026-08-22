import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopify, WordPress & SEO Services | Appalachian Growth Solutions",
  description:
    "Appalachian Growth Solutions builds high-converting Shopify, WordPress and WooCommerce websites with SEO and digital marketing services to help businesses grow online.",
  authors: [{ name: "Appalachian Growth Solutions" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://appalachiangrowthsolutions.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: "/appalachian-favicon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/appalachian-favicon-512.png",
  },
  openGraph: {
    title: "Shopify, WordPress & SEO Services | Appalachian Growth Solutions",
    description: "Appalachian Growth Solutions builds high-converting Shopify, WordPress and WooCommerce websites with SEO and digital marketing services to help businesses grow online.",
    url: "/",
    siteName: "Appalachian Growth Solutions",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify, WordPress & SEO Services | Appalachian Growth Solutions",
    description: "Appalachian Growth Solutions builds high-converting Shopify, WordPress and WooCommerce websites with SEO and digital marketing services to help businesses grow online.",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://appalachiangrowthsolutions.com';

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Appalachian Growth Solutions",
  "description": "Premium digital solutions agency. We build, grow, and scale Shopify and WordPress stores.",
  "url": siteUrl,
  "logo": `${siteUrl}/appalachian-logo.png`,
  "sameAs": [
    "https://instagram.com/appalachian.agency",
    "https://facebook.com/appalachian.agency",
    "https://twitter.com/appalachian_growth",
    "https://linkedin.com/company/appalachian-growth-solutions"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "eCommerce Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Shopify Store Development",
          "description": "Custom Shopify stores designed to convert visitors into customers."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "WordPress Store Development",
          "description": "Professional WooCommerce stores with full customization."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Digital Marketing",
          "description": "Data-driven marketing strategies across Google Ads, Meta Ads, TikTok Ads, and SEO."
        }
      }
    ]
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to build a store?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We deliver stores quickly without compromising quality. Small websites can take as little as 2 days, standard stores 4–5 days, and highly customized websites 1–2 weeks. Our larger team works on multiple parts of your website simultaneously, helping us deliver faster while saving you valuable time."
      }
    },
    {
      "@type": "Question",
      "name": "Do you build both Shopify and WordPress stores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We build Shopify, WordPress, and WooCommerce stores tailored to your business, whether you need a new online store or want to improve an existing one."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide ongoing website maintenance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. We can handle everything from building and maintaining your store to adding products, optimizing your website, and growing sales. Through SEO and digital marketing, we help make your store visible to relevant customers who are already searching for the products or services you offer."
      }
    },
    {
      "@type": "Question",
      "name": "Can you redesign my existing store?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We can redesign and modernize your existing Shopify or WordPress store while improving its design, user experience, mobile responsiveness, and conversion potential."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We provide SEO services designed to improve your website's visibility in search engines. Our services can include on-page SEO, technical SEO, keyword optimization, content optimization, local SEO, and ongoing SEO campaigns."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide ongoing support after my website launches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We can provide ongoing support after launch, including website updates, product changes, troubleshooting, maintenance, and continued improvements. We can also discuss an ongoing support or growth plan based on your needs."
      }
    },
    {
      "@type": "Question",
      "name": "How Appalachian SEO Benefits Your Business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We help businesses connect with people who are already searching for their products or services. A strong SEO strategy can also strengthen your online reputation, establish industry credibility, and encourage greater audience engagement. By targeting relevant long-tail keywords, we can attract prospects with strong buying intent who are more likely to become customers."
      }
    },
    {
      "@type": "Question",
      "name": "Why Trust Appalachian Growth Solutions With Your SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "At Appalachian Growth Solutions, we understand that SEO is never a one-time effort. Google, search, and the internet—especially with the rise of AI—are changing every day. We keep adjusting our strategies as things evolve, using our local knowledge and a dedicated team to help your business stay visible and keep growing."
      }
    },
    {
      "@type": "Question",
      "name": "Are we the right fit for you?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "At Appalachian Growth Solutions, we focus on bringing the right traffic to your website—people who are more likely to become customers. We work hard to help you grow your business and reach more of your market. We also understand that choosing the right SEO company can be difficult, especially if you've had a bad experience before. That's why we aim to make the process simple and show you a better way to grow online."
      }
    }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Appalachian Growth Solutions",
  "url": `${siteUrl}/`,
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Shopify, WordPress & SEO Services | Appalachian Growth Solutions",
  "url": `${siteUrl}/`,
  "description": "Appalachian Growth Solutions builds high-converting Shopify, WordPress and WooCommerce websites with SEO and digital marketing services to help businesses grow online."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/appalachian-logo.png" as="image" type="image/png" />
        <link rel="icon" href="/appalachian-favicon-512.png" type="image/png" sizes="512x512" />
        <link rel="preload" href="/portfolio/skinnydiplondon.webp" as="image" type="image/webp" />
        <link rel="preload" href="/portfolio/hgwalter.webp" as="image" type="image/webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#050505] text-[#E5E5E5]`}
      >
        {children}
      </body>
    </html>
  );
}