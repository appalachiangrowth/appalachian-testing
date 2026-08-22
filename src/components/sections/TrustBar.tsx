'use client';

const partners = [
  { name: 'Shopify Partner', color: '#96BF48' },
  { name: 'Google Partner', color: '#4285F4' },
  { name: 'Meta Partner', color: '#0668E1' },
  { name: 'WooCommerce', color: '#96588A' },
  { name: 'Stripe Verified', color: '#635BFF' },
  { name: 'WordPress.org', color: '#21759B' },
];

function BadgeRow({ rowId }: { rowId: number }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, setIdx) =>
        partners.map((p) => (
          <div
            key={`trust-${rowId}-${p.name}-${setIdx}`}
            className='group flex shrink-0 items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 transition-colors'
          >
            <span
              className='h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125'
              style={{ backgroundColor: p.color }}
            />
            <span className='text-xs sm:text-sm font-medium text-glow text-[#aaa] transition-colors group-hover:text-[#B6FF00]'>{p.name}</span>
          </div>
        )),
      )}
    </>
  );
}

export default function TrustBar() {
  return (
    <section id='trust-bar' className='relative w-full bg-[#0A0A0A] border-t border-[rgba(182,255,0,0.06)] border-b border-[rgba(182,255,0,0.06)]'>
      {/* Label */}
      <p className='text-center text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-[#888] mb-4 md:mb-6 pt-4 pb-4 sm:pt-6 sm:pb-6 md:pt-8 md:pb-8'>
        TRUSTED BY LEADING BRANDS
      </p>

      {/* Marquee container */}
      <div className='relative overflow-hidden'>
        {/* Left fade */}
        <div className='pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent' />
        {/* Right fade */}
        <div className='pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent' />

        <div
          className='flex w-max'
          style={{ animation: 'marquee 40s linear infinite' }}
        >
          <div className='flex'>
            <BadgeRow rowId={1} />
          </div>
          <div className='flex'>
            <BadgeRow rowId={2} />
          </div>
        </div>
      </div>

      {/* Bottom gradient separator */}
      <div className='w-full h-px bg-gradient-to-r from-transparent via-[rgba(182,255,0,0.1)] to-transparent' />
    </section>
  );
}
