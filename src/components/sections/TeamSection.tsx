'use client'

import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'

export default function TeamSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0A0A0A] section-divider">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionReveal>
          <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <SectionLabel>ABOUT US</SectionLabel>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                HELPING BUSINESSES
                <br />
                <span className="text-gradient">GROW ONLINE.</span>
              </h2>
              <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#B6FF00] to-transparent" />
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[#888] sm:text-base">
                Practical digital expertise, thoughtful design, and growth-focused solutions for businesses ready to move forward.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(182,255,0,0.14)] bg-[#0D0D0D] p-6 shadow-[0_0_35px_rgba(182,255,0,0.04)] sm:p-8 md:p-10">
              <div className="mb-8 flex flex-wrap gap-3">
                {['3–4 Years Experience', 'Shopify & WordPress', 'SEO & Digital Marketing'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[rgba(182,255,0,0.18)] bg-[rgba(182,255,0,0.05)] px-3 py-1.5 text-xs font-medium text-[#B6FF00]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="space-y-6 text-base leading-relaxed text-[#B8B8B8] sm:text-lg">
                <p>
                  At <strong className="font-semibold text-white">Appalachian Growth Solutions</strong>, we are a digital growth agency with <strong className="font-semibold text-white">3–4 years of experience</strong> helping businesses build and grow their online presence. Our team specializes in <strong className="font-semibold text-white">Shopify and WordPress development, SEO, eCommerce solutions, website design, and digital marketing</strong>, creating professional digital experiences designed to help businesses reach more customers.
                </p>

                <p>
                  Our team of <strong className="font-semibold text-white">developers, designers, and digital marketing specialists</strong> works closely with each client to understand their goals and deliver the right solution. Whether you’re launching a new website, improving your SEO, or growing your online store, we’re focused on delivering quality work and helping your business grow online.
                </p>
              </div>

              <div className="mt-8 grid gap-4 border-t border-[rgba(255,255,255,0.08)] pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xl font-bold text-[#B6FF00]">01</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#777]">Understand</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#B6FF00]">02</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#777]">Build</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#B6FF00]">03</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#777]">Grow</p>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
