"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────
type PuppyState = "walking" | "sitting" | "pointing";

interface Position {
  x: number;
  y: number;
}

// ── Intro & FAQ-based guide tips (puppy speak, non-intrusive) ───────
const INTRO_MESSAGE = "👋 Hey! I'm the Appalachian Growth Solutions guide pup. Ask me anything!";

const FAQ_TIPS = [
  "⚡ Small stores in 2 days, standard ones in 4-5!",
  "🛒 Yep — Shopify AND WordPress, your pick!",
  "🔧 We maintain, optimize & grow your store for you!",
  "🎨 Got an old store? We'll give it a fresh modern look!",
  "🔍 SEO? Absolutely — we get you found on Google!",
  "🛡️ Support doesn't stop after launch — we've got you!",
  "📈 Our SEO attracts people already ready to buy!",
  "🧠 SEO changes daily with AI — we adapt so you don't have to!",
  "🎯 We bring the RIGHT customers to your door!",
];

const IDLE_MESSAGES = [
  "*happy tail wag* 🐕",
  "Woof! 🐾",
  "Scrolling with you! ⬇️",
  "*sniffs around* 👃",
  "This is pawsome! 🐾",
];

// ── Helpers ────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('puppy-keyframes')) {
  const style = document.createElement('style');
  style.id = 'puppy-keyframes';
  style.textContent = `
    @keyframes puppy-walk {
      0%, 100% { transform: translateY(0); }
      25% { transform: translateY(-3px); }
      50% { transform: translateY(0); }
      75% { transform: translateY(-2px); }
    }
    @keyframes puppy-point {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(-3deg); }
    }
    @keyframes puppy-idle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-1px); }
    }
    @keyframes paw-fade-right {
      0% { transform: translateY(0) translateX(0); opacity: 0.6; }
      100% { transform: translateY(20px) translateX(10px); opacity: 0; }
    }
    @keyframes paw-fade-left {
      0% { transform: translateY(0) translateX(0); opacity: 0.6; }
      100% { transform: translateY(20px) translateX(-10px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ── Component ──────────────────────────────────────────────────────
export default function DogMascot() {
  const [position, setPosition] = useState<Position>({ x: 60, y: 70 });
  const [state, setState] = useState<PuppyState>("sitting");
  const [facingLeft, setFacingLeft] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const targetRef = useRef<Position>({ x: 60, y: 70 });
  const animFrameRef = useRef<number>(0);
  const stateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const directionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDirectionIdx = useRef(-1);

  // ── Puppy image selection ──────────────────────────────────────
  const puppyImage = useMemo(() => {
    switch (state) {
      case "walking":
        return "/puppy-walk.png";
      case "pointing":
        return "/puppy-point.png";
      case "sitting":
      default:
        return "/puppy-sit.png";
    }
  }, [state]);

  // ── Bubble helper (declared first, no deps on other callbacks) ──
  const showBubbleWithText = useCallback(
    (text: string, duration = 4000) => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      setBubbleText(text);
      setShowBubble(true);

      bubbleTimerRef.current = setTimeout(() => {
        setShowBubble(false);
      }, duration);
    },
    []
  );

  // ── Show a random FAQ-based guide tip ─────────────────────────
  const showDirectionTip = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * FAQ_TIPS.length);
    } while (idx === lastDirectionIdx.current);
    lastDirectionIdx.current = idx;
    showBubbleWithText(FAQ_TIPS[idx], 5500);
  }, [showBubbleWithText]);

  // ── Show a random idle/cute message ───────────────────────────
  const showIdleMessage = useCallback(() => {
    const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
    showBubbleWithText(msg, 3000);
  }, [showBubbleWithText]);

  // ── Movement logic ─────────────────────────────────────────────
  const moveToRandomTarget = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 40;
    const puppySize = 60;

    targetRef.current = {
      x: rand(margin, vw - margin - puppySize),
      y: rand(vh * 0.15, vh * 0.75),
    };
    setState("walking");
  }, []);

  // ── Main state cycle (declared after all deps) ─────────────────
  const startStateCycle = useCallback(() => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);

    const cycle = () => {
      const action = Math.random();

      if (action < 0.35) {
        setState("sitting");
        stateTimerRef.current = setTimeout(cycle, rand(4000, 8000));
      } else if (action < 0.50) {
        setState("pointing");
        showDirectionTip();
        stateTimerRef.current = setTimeout(cycle, rand(6000, 9000));
      } else if (action < 0.60) {
        setState("sitting");
        showIdleMessage();
        stateTimerRef.current = setTimeout(cycle, rand(4000, 7000));
      } else {
        moveToRandomTarget();
        stateTimerRef.current = setTimeout(cycle, rand(5000, 10000));
      }
    };

    cycle();
  }, [moveToRandomTarget, showDirectionTip, showIdleMessage]);

  // ── Animation frame for smooth movement ────────────────────────
  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;

      const dx = targetRef.current.x - position.x;
      const dy = targetRef.current.y - position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2 && state === "walking") {
        const speed = 0.8;
        const newX = position.x + (dx / dist) * speed;
        const newY = position.y + (dy / dist) * speed;
        setPosition({ x: newX, y: newY });

        if (Math.abs(dx) > 1) {
          setFacingLeft(dx < 0);
        }
      } else if (state === "walking") {
        setState("sitting");
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [position.x, position.y, state]);

  // ── Bubble direction based on position ──
  const bubbleDir = useMemo(() => {
    if (typeof window === "undefined") return "right" as const;
    return (position.x > window.innerWidth / 2 ? "left" : "right") as "left" | "right";
  }, [position.x]);

  // ── Start behavior after mount ─────────────────────────────────
  useEffect(() => {
    const introTimer = setTimeout(() => {
      showBubbleWithText(INTRO_MESSAGE, 5500);
    }, 2500);

    const cycleTimer = setTimeout(() => {
      startStateCycle();
    }, 9000);

    // Less frequent tips — every 20s, 25% chance (non-intrusive)
    directionTimerRef.current = setInterval(() => {
      if (Math.random() < 0.25) {
        setState("pointing");
        showDirectionTip();
      }
    }, 20000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(cycleTimer);
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (directionTimerRef.current) clearInterval(directionTimerRef.current);
    };
  }, [startStateCycle, showDirectionTip, showBubbleWithText]);

  // ── Click handler ──────────────────────────────────────────────
  const handlePuppyClick = () => {
    setHasInteracted(true);
    if (state === "sitting") {
      setState("pointing");
      showDirectionTip();
      setTimeout(() => setState("sitting"), 3000);
    } else {
      showIdleMessage();
    }
  };

  // ── Toggle visibility ──────────────────────────────────────────
  const toggleVisibility = () => {
    if (isHidden) {
      setIsHidden(false);
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsHidden(true), 300);
    }
  };

  const isWalking = state === "walking";
  const isPointing = state === "pointing";

  const puppyAnimName = isWalking ? 'puppy-walk' : isPointing ? 'puppy-point' : 'puppy-idle';
  const puppyAnimDuration = isWalking ? '0.4s' : isPointing ? '0.8s' : '2s';

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleVisibility}
        className="fixed bottom-20 right-4 z-[200] w-10 h-10 rounded-full bg-[#111] border border-[rgba(182,255,0,0.2)] text-[#B6FF00] flex items-center justify-center text-xs hover:bg-[rgba(182,255,0,0.1)] transition-all duration-200 hover:scale-110 active:scale-95"
        title={isHidden ? "Show guide dog" : "Hide guide dog"}
      >
        {isHidden ? "🐕" : "✕"}
      </button>

      {/* Puppy mascot */}
      {!isHidden && (
        <div
          className="fixed z-[150] pointer-events-auto"
          style={{
            left: position.x,
            top: position.y,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            willChange: 'transform, opacity',
          }}
        >
          {/* Speech bubble - OUTSIDE the flipped container so text never flips */}
          {showBubble && (
            <div
              style={{
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}
              className={`absolute ${
                bubbleDir === "right" ? "left-full ml-2" : "right-full mr-2"
              } bottom-4 w-max max-w-[220px] sm:max-w-[260px]`}
            >
              <div className="relative bg-[#111] border border-[rgba(182,255,0,0.25)] rounded-2xl px-3.5 py-2.5 text-[#ccc] text-xs sm:text-sm leading-relaxed shadow-lg shadow-[rgba(0,0,0,0.5)]">
                {bubbleText}
                {/* Bubble tail */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#111] border border-[rgba(182,255,0,0.25)] rotate-45 ${
                    bubbleDir === "right"
                      ? "-left-[5px] border-r-0 border-b-0"
                      : "-right-[5px] border-l-0 border-t-0"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Puppy body - only the image gets flipped */}
          <div
            className="relative cursor-pointer select-none"
            onClick={handlePuppyClick}
            style={{
              animation: `${puppyAnimName} ${puppyAnimDuration} ease-in-out infinite`,
            }}
          >
            {/* Glow ring on hover */}
            <div className="absolute -inset-2 rounded-full bg-[rgba(182,255,0,0.1)] opacity-0 hover:opacity-100 transition-opacity duration-300" />

            {/* Puppy image - only this gets flipped */}
            <div style={{ transform: `scaleX(${facingLeft ? -1 : 1})` }}>
              <img
                src={puppyImage}
                alt="Guide Dog Mascot"
                className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] object-contain drop-shadow-[0_2px_8px_rgba(182,255,0,0.15)] hover:scale-[1.15] active:scale-90 transition-transform duration-200"
              />
            </div>

            {/* Click me hint - outside flipped container */}
            {!hasInteracted && (
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-[9px] sm:text-[10px] font-medium text-[#B6FF00]/70 tracking-wide">
                  Click me! 🐾
                </span>
              </div>
            )}
          </div>

          {/* Walking paw prints */}
          {isWalking && <PawPrints facingLeft={facingLeft} />}
        </div>
      )}
    </>
  );
}

// ── Paw prints trail ───────────────────────────────────────────────
function PawPrints({ facingLeft }: { facingLeft: boolean }) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
      <div
        className="text-[8px]"
        style={{
          animation: `paw-fade-${facingLeft ? 'left' : 'right'} 1.2s ease-out infinite`,
        }}
      >
        🐾
      </div>
    </div>
  );
}
