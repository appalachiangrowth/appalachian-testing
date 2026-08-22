"use client";

import { motion } from "@/lib/motion";
import { Rocket, Zap, Crown, Check } from "lucide-react";
import SectionLabel from '@/components/sections/SectionLabel';

const tiers = [
  {
    name: "Starter",
    price: "$1,499",
    period: "one-time",
    icon: Rocket,
    tagline: "Perfect for new stores",
    featured: false,
    features: [
      "Custom Shopify/WordPress Theme",
      "Up to 50 Products",
      "Mobile Responsive Design",
      "Basic SEO Setup",
      "30-Day Support",
      "SSL Certificate Setup",
    ],
    cta: "Get Started",
    ctaStyle: "outline" as const,
  },
  {
    name: "Professional",
    price: "$3,499",
    period: "one-time",
    icon: Zap,
    tagline: "For growing businesses",
    featured: true,
    features: [
      "Everything in Starter",
      "Up to 500 Products",
      "Custom Functionality",
      "Advanced SEO & Analytics",
      "Payment Gateway Integration",
      "Speed Optimization",
      "90-Day Support",
      "Email Marketing Setup",
    ],
    cta: "Get Started",
    ctaStyle: "filled" as const,
  },
  {
    name: "Enterprise",
    price: "Let's Talk",
    period: "",
    icon: Crown,
    tagline: "For large-scale operations",
    featured: false,
    features: [
      "Everything in Professional",
      "Unlimited Products",
      "Custom App Development",
      "Dedicated Account Manager",
      "Priority 24/7 Support",
      "Multi-channel Integration",
      "Custom Training",
      "API Development",
    ],
    cta: "Contact Us",
    ctaStyle: "outline" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: (featured: boolean) => ({
    opacity: 0,
    y: featured ? 50 : 30,
  }),
  visible: (featured: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: featured ? 0.7 : 0.6,
      ease: "easeOut",
    },
  }),
};

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#050505] py-24 md:py-32">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(182,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 350,
            height: 350,
            left: '50%',
            top: '10%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(182,255,0,0.05) 0%, transparent 70%)',
            animation: 'float-orb 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 250,
            height: 250,
            left: '80%',
            top: '80%',
            background: 'radial-gradient(circle, rgba(182,255,0,0.03) 0%, transparent 70%)',
            animation: 'float-orb 24s ease-in-out infinite 6s',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
            Transparent Pricing for Every Stage
          </h2>
          <p className="text-base text-[#888] md:text-lg">
            Choose the plan that fits your business needs. All plans include free consultation.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="mt-16 grid grid-cols-1 items-center gap-6 md:mt-20 md:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                custom={tier.featured}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className={
                  "group relative rounded-2xl border backdrop-blur-sm bg-[#0A0A0A] p-6 transition-colors duration-300 md:p-8 " +
                  (tier.featured
                    ? "scale-[1.02] border-[rgba(182,255,0,0.2)] md:scale-[1.02] shadow-[0_0_60px_rgba(182,255,0,0.08)]"
                    : "border-[rgba(182,255,0,0.08)]")
                }
                style={
                  tier.featured
                    ? { backgroundColor: "rgba(182,255,0,0.02)" }
                    : undefined
                }
              >
                {/* Top highlight line */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.15)] to-transparent" />

                {/* Hover gradient line */}
                <div className="absolute inset-x-0 top-0 h-[1px] overflow-hidden rounded-t-2xl">
                  <div
                    className="h-full w-full bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.3)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                {/* MOST POPULAR badge */}
                {tier.featured && (
                  <div className="mb-6">
                    <span className="inline-block rounded-full bg-[#B6FF00] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#050505]">
                      Most Popular
                    </span>
                  </div>
                )}

                {!tier.featured && <div className="mb-6 h-[34px]" />}

                {/* Icon */}
                <div
                  className={
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-xl " +
                    (tier.featured
                      ? "bg-[rgba(182,255,0,0.1)]"
                      : "bg-[rgba(182,255,0,0.05)]")
                  }
                >
                  <Icon
                    className={
                      tier.featured
                        ? "h-6 w-6 text-[#B6FF00]"
                        : "h-6 w-6 text-[#B6FF00]/70"
                    }
                  />
                </div>

                {/* Tier name & tagline */}
                <h3 className="mb-1 text-xl font-bold text-white">{tier.name}</h3>
                <p className="mb-6 text-sm text-[#888]">{tier.tagline}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white md:text-5xl">{tier.price}</span>
                  {tier.period && (
                    <span className="ml-2 text-base text-[#888]">/{tier.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 py-1.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B6FF00]" />
                      <span className="text-sm text-[#bbb]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={
                    "w-full rounded-xl py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 " +
                    (tier.ctaStyle === "filled"
                      ? "bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 hover:shadow-[0_0_30px_rgba(182,255,0,0.2)]"
                      : "border border-[rgba(182,255,0,0.3)] bg-transparent text-[#B6FF00] hover:border-[#B6FF00] hover:shadow-[0_0_20px_rgba(182,255,0,0.1)]")
                  }
                >
                  {tier.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="mt-12 text-center text-sm text-[#666] md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          All prices are one-time. No monthly fees. Free consultation included.
        </motion.p>
      </div>
    </section>
  );
}
