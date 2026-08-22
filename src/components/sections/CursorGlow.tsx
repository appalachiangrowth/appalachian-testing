'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -300, y: -300 })
  const targetRef = useRef({ x: -300, y: -300 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      const glow = glowRef.current
      if (!glow) return

      const lerp = 0.15
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp

      const x = posRef.current.x - 150
      const y = posRef.current.y - 150
      glow.style.transform = `translate(${x}px, ${y}px)`

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className='pointer-events-none fixed top-0 left-0 z-[2] hidden md:block'
      style={{
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(182,255,0,0.06) 0%, transparent 70%)',
        willChange: 'transform',
      }}
      aria-hidden='true'
    />
  )
}
