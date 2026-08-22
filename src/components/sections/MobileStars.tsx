'use client';

/*
 * Static star field for mobile view — no animations, zero JS overhead.
 * Scattered lightly across the FULL page height (not just viewport)
 * to match the desktop aesthetic. Uses absolute positioning so stars
 * scroll with the content and cover the entire page.
 * Desktop uses the animated StarField component instead.
 */

interface StarDot {
  left: string;
  top: string;
  size: number;
  opacity: number;
  glow: number;
  isAccent: boolean;
}

/* Seeded positions — spread across a very tall page (~8000px+)
 * Not dense in any one area, just a few per section of the page */
const stars: StarDot[] = [
  /* ~0-500px — Hero area */
  { left: '8%',  top: '2%',  size: 1.2, opacity: 0.6, glow: 0,   isAccent: false },
  { left: '45%', top: '1%',  size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '78%', top: '3%',  size: 1.8, opacity: 0.8, glow: 3,   isAccent: true  },
  { left: '25%', top: '5%',  size: 1,   opacity: 0.5, glow: 0,   isAccent: false },
  { left: '92%', top: '4%',  size: 1.3, opacity: 0.6, glow: 0,   isAccent: false },

  /* ~500-1000px — TrustBar / Platform area */
  { left: '12%', top: '8%',  size: 1.4, opacity: 0.55, glow: 0,   isAccent: false },
  { left: '55%', top: '9%',  size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },
  { left: '88%', top: '10%', size: 2,   opacity: 0.9, glow: 4,   isAccent: true  },
  { left: '35%', top: '11%', size: 1,   opacity: 0.45, glow: 0,   isAccent: false },

  /* ~1000-1500px — Services area */
  { left: '5%',  top: '14%', size: 1.6, opacity: 0.7, glow: 2.5, isAccent: false },
  { left: '42%', top: '16%', size: 1.2, opacity: 0.55, glow: 0,   isAccent: false },
  { left: '72%', top: '15%', size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '95%', top: '17%', size: 1,   opacity: 0.5, glow: 0,   isAccent: false },

  /* ~1500-2000px — Process area */
  { left: '18%', top: '20%', size: 1.3, opacity: 0.6, glow: 0,   isAccent: false },
  { left: '60%', top: '22%', size: 1.8, opacity: 0.8, glow: 3,   isAccent: true  },
  { left: '85%', top: '21%', size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },

  /* ~2000-2500px — Portfolio area */
  { left: '8%',  top: '26%', size: 1.4, opacity: 0.65, glow: 0,   isAccent: false },
  { left: '38%', top: '28%', size: 1,   opacity: 0.45, glow: 0,   isAccent: false },
  { left: '68%', top: '27%', size: 1.7, opacity: 0.75, glow: 2,   isAccent: false },
  { left: '90%', top: '29%', size: 1.2, opacity: 0.55, glow: 0,   isAccent: false },

  /* ~2500-3000px — WhyChooseUs area */
  { left: '15%', top: '33%', size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '50%', top: '34%', size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },
  { left: '80%', top: '35%', size: 1.9, opacity: 0.85, glow: 3,   isAccent: true  },

  /* ~3000-3500px — Results area */
  { left: '5%',  top: '39%', size: 1.2, opacity: 0.55, glow: 0,   isAccent: false },
  { left: '32%', top: '41%', size: 1.6, opacity: 0.7, glow: 2.5, isAccent: false },
  { left: '65%', top: '40%', size: 1,   opacity: 0.5, glow: 0,   isAccent: false },
  { left: '92%', top: '42%', size: 1.3, opacity: 0.6, glow: 0,   isAccent: false },

  /* ~3500-4000px — Digital Marketing area */
  { left: '10%', top: '46%', size: 1.4, opacity: 0.65, glow: 0,   isAccent: false },
  { left: '48%', top: '47%', size: 1.8, opacity: 0.8, glow: 3,   isAccent: true  },
  { left: '75%', top: '48%', size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },

  /* ~4000-4500px — Testimonials area */
  { left: '20%', top: '52%', size: 1,   opacity: 0.45, glow: 0,   isAccent: false },
  { left: '58%', top: '53%', size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '88%', top: '54%', size: 1.2, opacity: 0.55, glow: 0,   isAccent: false },

  /* ~4500-5000px — Team area */
  { left: '7%',  top: '58%', size: 1.6, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '40%', top: '59%', size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },
  { left: '72%', top: '60%', size: 1.3, opacity: 0.6, glow: 0,   isAccent: false },
  { left: '95%', top: '61%', size: 2,   opacity: 0.85, glow: 3.5, isAccent: true  },

  /* ~5000-5500px — Blog area */
  { left: '14%', top: '65%', size: 1.2, opacity: 0.55, glow: 0,   isAccent: false },
  { left: '52%', top: '66%', size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '82%', top: '67%', size: 1,   opacity: 0.5, glow: 0,   isAccent: false },

  /* ~5500-6000px — FAQ area */
  { left: '5%',  top: '71%', size: 1.4, opacity: 0.65, glow: 0,   isAccent: false },
  { left: '35%', top: '72%', size: 1.7, opacity: 0.75, glow: 2,   isAccent: false },
  { left: '68%', top: '73%', size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },
  { left: '90%', top: '74%', size: 1.3, opacity: 0.6, glow: 0,   isAccent: false },

  /* ~6000-6500px — CTA Banner area */
  { left: '18%', top: '78%', size: 1.8, opacity: 0.8, glow: 3,   isAccent: true  },
  { left: '55%', top: '79%', size: 1,   opacity: 0.45, glow: 0,   isAccent: false },
  { left: '85%', top: '80%', size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },

  /* ~6500-7000px — Contact area */
  { left: '8%',  top: '84%', size: 1.2, opacity: 0.55, glow: 0,   isAccent: false },
  { left: '42%', top: '85%', size: 1.6, opacity: 0.7, glow: 2.5, isAccent: false },
  { left: '75%', top: '86%', size: 1,   opacity: 0.5, glow: 0,   isAccent: false },

  /* ~7000-7500px — Footer area */
  { left: '15%', top: '90%', size: 1.4, opacity: 0.65, glow: 0,   isAccent: false },
  { left: '50%', top: '91%', size: 1.1, opacity: 0.5, glow: 0,   isAccent: false },
  { left: '80%', top: '92%', size: 1.7, opacity: 0.75, glow: 2,   isAccent: false },
  { left: '30%', top: '94%', size: 1.3, opacity: 0.6, glow: 0,   isAccent: false },
  { left: '92%', top: '95%', size: 1.5, opacity: 0.7, glow: 2,   isAccent: false },
  { left: '60%', top: '97%', size: 1,   opacity: 0.5, glow: 0,   isAccent: false },
  { left: '10%', top: '98%', size: 1.8, opacity: 0.8, glow: 3,   isAccent: true  },
];

function CrescentMoon() {
  return (
    <div
      className="absolute"
      style={{ top: '2%', right: '8%' }}
      aria-hidden="true"
    >
      <svg width="60" height="60" viewBox="0 0 180 180" fill="none">
        <circle cx="65" cy="90" r="55" fill="rgba(255,255,240,0.04)" />
        <circle cx="65" cy="90" r="45" fill="rgba(255,255,245,0.18)" />
        <circle cx="83" cy="82" r="40" fill="#050505" />
        <circle cx="42" cy="78" r="6" fill="rgba(255,255,240,0.04)" />
        <circle cx="52" cy="105" r="4" fill="rgba(255,255,240,0.03)" />
        <circle cx="36" cy="92" r="3" fill="rgba(255,255,240,0.03)" />
        <circle cx="65" cy="90" r="45" fill="none" stroke="rgba(182,255,0,0.06)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function MobileStars() {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-0 pointer-events-none md:hidden"
      style={{ minHeight: '100%', height: 'auto' }}
      aria-hidden="true"
    >
      {stars.map((star, i) => {
        const color = star.isAccent
          ? `rgba(182,255,0,${star.opacity})`
          : `rgba(255,255,255,${star.opacity})`;
        const glowColor = star.isAccent
          ? `rgba(182,255,0,${star.opacity * 0.4})`
          : `rgba(200,220,255,${star.opacity * 0.3})`;

        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: color,
              boxShadow:
                star.glow > 0
                  ? `0 0 ${star.glow * 2}px ${star.glow * 0.5}px ${glowColor}`
                  : 'none',
            }}
          />
        );
      })}
      <CrescentMoon />
    </div>
  );
}
