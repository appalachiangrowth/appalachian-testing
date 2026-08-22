'use client';

import React, {
  type ElementType,
  type HTMLAttributes,
  type Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Light-weight shim – mirrors the subset of framer-motion types our */
/** components actually use so TypeScript stays happy.               */

export type Variants = any;
export type Transition = any;
export type { MouseEvent } from 'react';

/* ------------------------------------------------------------------ */
/*  AnimatePresence shim                                               */
/* ------------------------------------------------------------------ */

export function AnimatePresence({
  children,
  mode,
  ..._rest
}: {
  children: React.ReactNode;
  mode?: string;
  [key: string]: any;
}) {
  return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/*  useInView shim (IntersectionObserver-based)                        */
/* ------------------------------------------------------------------ */

export function useInView(
  ref: React.RefObject<HTMLElement | null>,
  options?: { once?: boolean; margin?: string; amount?: number },
): boolean {
  const [isInView, setIsInView] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const once = options?.once ?? true;
    const margin = options?.margin;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (once && hasTriggered.current) return;
        if (inView) hasTriggered.current = true;
        setIsInView(inView);
      },
      { rootMargin: margin ?? '0px', threshold: options?.amount ?? 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.once, options?.margin, options?.amount]);

  return isInView;
}

/* ------------------------------------------------------------------ */
/*  Motion props (the ones we need to accept & silently drop)          */
/* ------------------------------------------------------------------ */

interface MotionProps extends HTMLAttributes<HTMLElement> {
  initial?: any;
  animate?: any;
  exit?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  whileFocus?: any;
  whileDrag?: any;
  variants?: any;
  transition?: any;
  onAnimationComplete?: (...args: any[]) => void;
  onAnimationStart?: (...args: any[]) => void;
  layoutId?: string;
  viewport?: any;
  custom?: any;
  drag?: any;
  dragConstraints?: any;
  onDragStart?: (...args: any[]) => void;
  onDrag?: (...args: any[]) => void;
  onDragEnd?: (...args: any[]) => void;
  layout?: any;
  ref?: Ref<HTMLElement>;
}

/* ------------------------------------------------------------------ */
/*  Factory: creates a thin wrapper for a given HTML tag               */
/* ------------------------------------------------------------------ */

function createMotionElement(Tag: ElementType) {
  const MotionComp = forwardRef<HTMLElement, MotionProps>(function MotionComp(
    {
      // Motion-specific props to strip
      initial,
      animate,
      exit,
      whileHover,
      whileTap,
      whileInView,
      whileFocus,
      whileDrag,
      variants,
      transition,
      onAnimationComplete,
      onAnimationStart,
      layoutId,
      viewport,
      custom,
      drag,
      dragConstraints,
      onDragStart,
      onDrag,
      onDragEnd,
      layout,
      // Standard HTML props that pass through
      style,
      className,
      children,
      id,
      onClick,
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
      ...rest
    },
    ref,
  ) {
    // Build a clean style object (filter out motion-only style keys)
    const cleanStyle: React.CSSProperties = (style as React.CSSProperties) || {};

    return (
      <Tag
        ref={ref}
        style={cleanStyle}
        className={className}
        id={id}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        {...rest}
      >
        {children}
      </Tag>
    );
  });

  MotionComp.displayName = `motion.${typeof Tag === 'string' ? Tag : 'div'}`;
  return MotionComp;
}

/* ------------------------------------------------------------------ */
/*  motion proxy object                                                */
/* ------------------------------------------------------------------ */

const motion = new Proxy({} as Record<string, ElementType>, {
  get(_target, prop: string) {
    // Map common tags
    const tag = prop as ElementType;
    return createMotionElement(tag);
  },
});

export { motion };
